import type { GraphSettings } from './types';

export const DEFAULT_SETTINGS: GraphSettings = {
  showEdges: true,
  publicSubnetsFirst: true,
  tiers: [
    {
      id: 'internet',
      label: 'Internet & Edge',
      resourceTypes: [
        'aws_internet_gateway',
        'aws_cloudfront_distribution',
        'aws_lb',
        'aws_alb',
        'aws_api_gateway_rest_api',
      ],
    },
    {
      id: 'compute',
      label: 'Compute',
      resourceTypes: [
        'aws_instance',
        'aws_lambda_function',
        'aws_ecs_service',
        'aws_ecs_cluster',
        'aws_autoscaling_group',
        'aws_launch_template',
      ],
    },
    {
      id: 'data',
      label: 'Data',
      resourceTypes: [
        'aws_db_instance',
        'aws_rds_cluster',
        'aws_elasticache_cluster',
        'aws_dynamodb_table',
        'aws_s3_bucket',
      ],
    },
  ],
};
