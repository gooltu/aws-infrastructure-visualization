export const terraformMainTf = `terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "terraform-state-three-tier"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

# ─── Data Sources ─────────────────────────────────────────────────────────────

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# ─── Locals ───────────────────────────────────────────────────────────────────

locals {
  name_prefix = "\${var.project}-\${var.environment}"

  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ─── VPC ──────────────────────────────────────────────────────────────────────

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "\${local.name_prefix}-vpc" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "\${local.name_prefix}-igw" }
}

# ─── Subnets ──────────────────────────────────────────────────────────────────

resource "aws_subnet" "web" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.web_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "\${local.name_prefix}-web-subnet-\${count.index + 1}"
    Tier = "web"
  }
}

resource "aws_subnet" "app" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.app_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "\${local.name_prefix}-app-subnet-\${count.index + 1}"
    Tier = "app"
  }
}

resource "aws_subnet" "db" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.db_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "\${local.name_prefix}-db-subnet-\${count.index + 1}"
    Tier = "database"
  }
}

# ─── Route Tables ─────────────────────────────────────────────────────────────

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "\${local.name_prefix}-public-rt" }
}

resource "aws_route_table_association" "web" {
  count          = length(aws_subnet.web)
  subnet_id      = aws_subnet.web[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat" {
  count  = length(var.availability_zones)
  domain = "vpc"
  tags   = { Name = "\${local.name_prefix}-nat-eip-\${count.index + 1}" }
}

resource "aws_nat_gateway" "main" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.web[count.index].id
  tags          = { Name = "\${local.name_prefix}-nat-\${count.index + 1}" }
  depends_on    = [aws_internet_gateway.main]
}

resource "aws_route_table" "private" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = { Name = "\${local.name_prefix}-private-rt-\${count.index + 1}" }
}

resource "aws_route_table_association" "app" {
  count          = length(aws_subnet.app)
  subnet_id      = aws_subnet.app[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

resource "aws_route_table_association" "db" {
  count          = length(aws_subnet.db)
  subnet_id      = aws_subnet.db[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# ─── Security Groups ──────────────────────────────────────────────────────────

resource "aws_security_group" "alb" {
  name        = "\${local.name_prefix}-alb-sg"
  description = "Allow HTTP/HTTPS from internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "\${local.name_prefix}-alb-sg" }
}

resource "aws_security_group" "web" {
  name        = "\${local.name_prefix}-web-sg"
  description = "Allow traffic from ALB to web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "\${local.name_prefix}-web-sg" }
}

resource "aws_security_group" "app" {
  name        = "\${local.name_prefix}-app-sg"
  description = "Allow traffic from web and ALB to app tier"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id, aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "\${local.name_prefix}-app-sg" }
}

resource "aws_security_group" "db" {
  name        = "\${local.name_prefix}-db-sg"
  description = "Allow MySQL from app tier only"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "\${local.name_prefix}-db-sg" }
}

# ─── Application Load Balancer ────────────────────────────────────────────────

resource "aws_lb" "app" {
  name                       = "\${local.name_prefix}-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.alb.id]
  subnets                    = aws_subnet.web[*].id
  enable_deletion_protection = var.enable_deletion_protection

  tags = { Name = "\${local.name_prefix}-alb" }
}

resource "aws_lb_target_group" "web" {
  name     = "\${local.name_prefix}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    timeout             = 5
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# ─── Web Tier (ASG) ───────────────────────────────────────────────────────────

resource "aws_launch_template" "web" {
  name_prefix   = "\${local.name_prefix}-web-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.web_instance_type

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.web.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    systemctl enable nginx
    systemctl start nginx
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "\${local.name_prefix}-web-server"
    })
  }
}

resource "aws_autoscaling_group" "web" {
  name                = "\${local.name_prefix}-web-asg"
  min_size            = var.web_asg_min
  max_size            = var.web_asg_max
  desired_capacity    = var.web_asg_min
  vpc_zone_identifier = aws_subnet.web[*].id
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "\${local.name_prefix}-web-server"
    propagate_at_launch = true
  }
}

# ─── App Tier (ASG) ───────────────────────────────────────────────────────────

resource "aws_launch_template" "app" {
  name_prefix   = "\${local.name_prefix}-app-lt-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.app_instance_type

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    yum update -y
    yum install -y java-17-amazon-corretto
    # Application startup here
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "\${local.name_prefix}-app-server"
    })
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "\${local.name_prefix}-app-asg"
  min_size            = var.app_asg_min
  max_size            = var.app_asg_max
  desired_capacity    = var.app_asg_min
  vpc_zone_identifier = aws_subnet.app[*].id
  health_check_type   = "EC2"

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "\${local.name_prefix}-app-server"
    propagate_at_launch = true
  }
}

# ─── RDS Aurora MySQL ─────────────────────────────────────────────────────────

resource "aws_db_subnet_group" "main" {
  name       = "\${local.name_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.db[*].id
  tags       = { Name = "\${local.name_prefix}-db-subnet-group" }
}

resource "aws_rds_cluster" "main" {
  cluster_identifier        = "\${local.name_prefix}-aurora-cluster"
  engine                    = "aurora-mysql"
  engine_version            = "8.0.mysql_aurora.3.05.2"
  database_name             = var.db_name
  master_username           = var.db_master_username
  master_password           = var.db_master_password
  db_subnet_group_name      = aws_db_subnet_group.main.name
  vpc_security_group_ids    = [aws_security_group.db.id]
  deletion_protection       = var.enable_deletion_protection
  backup_retention_period   = 7
  preferred_backup_window   = "03:00-04:00"
  skip_final_snapshot       = false
  final_snapshot_identifier = "\${local.name_prefix}-final-snapshot"

  tags = { Name = "\${local.name_prefix}-aurora-cluster" }
}

resource "aws_rds_cluster_instance" "writer" {
  identifier         = "\${local.name_prefix}-aurora-writer"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.db_instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
  tags               = { Name = "\${local.name_prefix}-aurora-writer" }
}

resource "aws_rds_cluster_instance" "reader" {
  identifier         = "\${local.name_prefix}-aurora-reader"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.db_instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
  tags               = { Name = "\${local.name_prefix}-aurora-reader" }
}

# ─── S3 Bucket ────────────────────────────────────────────────────────────────

resource "aws_s3_bucket" "assets" {
  bucket = var.s3_bucket_name
  tags   = { Name = var.s3_bucket_name }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─── Outputs ──────────────────────────────────────────────────────────────────

output "vpc_id" {
  description = "ID of the main VPC"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.app.dns_name
}

output "rds_cluster_endpoint" {
  description = "Writer endpoint for the Aurora cluster"
  value       = aws_rds_cluster.main.endpoint
  sensitive   = true
}

output "rds_reader_endpoint" {
  description = "Reader endpoint for the Aurora cluster"
  value       = aws_rds_cluster.main.reader_endpoint
  sensitive   = true
}

output "s3_bucket_name" {
  description = "Name of the assets S3 bucket"
  value       = aws_s3_bucket.assets.id
}

output "web_asg_name" {
  description = "Name of the web-tier Auto Scaling Group"
  value       = aws_autoscaling_group.web.name
}

output "app_asg_name" {
  description = "Name of the app-tier Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}
`;
