import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ResourceNodeData, ResourceSubtype } from '../../types/aws';

import iconAwsEmrCluster from './Icon-Resource/Res_Amazon-EMR_Cluster_48.png';
import iconAwsMskconnectConnector from './Icon-Resource/Res_Amazon-MSK_Amazon-MSK-Connect_48.png';
import iconAwsOsisPipeline from './Icon-Resource/Res_Amazon-OpenSearch-Service_OpenSearch-Ingestion_48.png';
import iconAwsAthenaDataCatalog from './Icon-Resource/Res_Amazon-Athena_Data-Source-Connectors_48.png';
import iconAwsGlueCrawler from './Icon-Resource/Res_AWS-Glue_Crawler_48.png';
import iconAwsGlueCatalogDatabase from './Icon-Resource/Res_AWS-Glue_Data-Catalog_48.png';
import iconAwsGlueDataQualityRuleset from './Icon-Resource/Res_AWS-Glue_Data-Quality_48.png';
import iconAwsLakeformationDataLakeSettings from './Icon-Resource/Res_AWS-Lake-Formation_Data-Lake_48.png';
import iconAwsApiGatewayRestApi from './Icon-Resource/Res_Amazon-API-Gateway_Endpoint_48.png';
import iconAwsCloudwatchEventBus from './Icon-Resource/Res_Amazon-EventBridge_Custom-Event-Bus_48.png';
import iconAwsPipesPipe from './Icon-Resource/Res_Amazon-EventBridge_Pipes_48.png';
import iconAwsCloudwatchEventRule from './Icon-Resource/Res_Amazon-EventBridge_Rule_48.png';
import iconAwsSchedulerSchedule from './Icon-Resource/Res_Amazon-EventBridge_Scheduler_48.png';
import iconAwsSchemasSchema from './Icon-Resource/Res_Amazon-EventBridge_Schema_48.png';
import iconAwsSchemasRegistry from './Icon-Resource/Res_Amazon-EventBridge_Schema-Registry_48.png';
import iconAwsMqBroker from './Icon-Resource/Res_Amazon-MQ_Broker_48.png';
import iconAwsSnsTopicSubscription from './Icon-Resource/Res_Amazon-Simple-Notification-Service_HTTP-Notification_48.png';
import iconAwsSnsTopic from './Icon-Resource/Res_Amazon-Simple-Notification-Service_Topic_48.png';
import iconAwsSqsQueue from './Icon-Resource/Res_Amazon-Simple-Queue-Service_Queue_48.png';
import iconAwsManagedblockchainMember from './Icon-Resource/Res_Amazon-Managed-Blockchain_Blockchain_48.png';
import iconAwsSesv2EmailIdentity from './Icon-Resource/Res_Amazon-Simple-Email-Service_Email_48.png';
import iconAwsAmi from './Icon-Resource/Res_Amazon-EC2_AMI_48.png';
import iconAwsAutoscalingGroup from './Icon-Resource/Res_Amazon-EC2_Auto-Scaling_48.png';
import iconAwsEip from './Icon-Resource/Res_Amazon-EC2_Elastic-IP-Address_48.png';
import iconAwsInstance from './Icon-Resource/Res_Amazon-EC2_Instance_48.png';
import iconAwsLaunchTemplate from './Icon-Resource/Res_Amazon-EC2_Instances_48.png';
import iconAwsSpotInstanceRequest from './Icon-Resource/Res_Amazon-EC2_Spot-Instance_48.png';
import iconAwsElasticBeanstalkApplication from './Icon-Resource/Res_AWS-Elastic-Beanstalk_Application_48.png';
import iconAwsElasticBeanstalkEnvironment from './Icon-Resource/Res_AWS-Elastic-Beanstalk_Deployment_48.png';
import iconAwsLambdaFunction from './Icon-Resource/Res_AWS-Lambda_Lambda-Function_48.png';
import iconAwsEcrRepository from './Icon-Resource/Res_Amazon-Elastic-Container-Registry_Registry_48.png';
import iconAwsEcsCluster from './Icon-Resource/Res_Amazon-EC2_Auto-Scaling_48.png';
import iconAwsEcsService from './Icon-Resource/Res_Amazon-Elastic-Container-Service_Service_48.png';
import iconAwsEcsTaskDefinition from './Icon-Resource/Res_Amazon-Elastic-Container-Service_Task_48.png';
import iconAwsEksCluster from './Icon-Resource/Res_Amazon-Elastic-Kubernetes-Service_EKS-on-Outposts_48.png';
import iconAwsRdsClusterInstance from './Icon-Resource/Res_Amazon-Aurora_Amazon-Aurora-Instance-alternate_48.png';
import iconAwsDbInstance from './Icon-Resource/Res_Amazon-Aurora_Amazon-RDS-Instance_48.png';
import iconAwsRdsCluster from './Icon-Resource/Res_Amazon-Aurora-Instance_48.png';
import iconAwsDocdbelasticCluster from './Icon-Resource/Res_Amazon-DocumentDB_Elastic-Clusters_48.png';
import iconAwsDaxCluster from './Icon-Resource/Res_Amazon-DynamoDB_Amazon-DynamoDB-Accelerator_48.png';
import iconAwsDynamodbTable from './Icon-Resource/Res_Amazon-DynamoDB_Table_48.png';
import iconAwsElasticacheCluster from './Icon-Resource/Res_Amazon-ElastiCache_ElastiCache-for-Memcached_48.png';
import iconAwsElasticacheReplicationGroup from './Icon-Resource/Res_Amazon-ElastiCache_ElastiCache-for-Redis_48.png';
import iconAwsDbProxy from './Icon-Resource/Res_Amazon-RDS-Proxy-Instance_48.png';
import iconAwsDmsReplicationTask from './Icon-Resource/Res_AWS-Database-Migration-Service_Database-migration-workflow-or-job_48.png';
import iconAwsCloud9EnvironmentEc2 from './Icon-Resource/Res_AWS-Cloud9_Cloud9_48.png';
import iconAwsWorkspacesWorkspace from './Icon-Resource/Res_Amazon-WorkSpaces-Family_Amazon-WorkSpaces_48.png';
import iconAwsWorkspaceswebPortal from './Icon-Resource/Res_Amazon-WorkSpaces-Family_Amazon-WorkSpaces-Web_48.png';
import iconAwsLocationGeofenceCollection from './Icon-Resource/Res_Amazon-Location-Service_Geofence_48.png';
import iconAwsLocationMap from './Icon-Resource/Res_Amazon-Location-Service_Map _48.png';
import iconAwsLocationPlaceIndex from './Icon-Resource/Res_Amazon-Location-Service_Place_48.png';
import iconAwsLocationRouteCalculator from './Icon-Resource/Res_Amazon-Location-Service_Routes_48.png';
import iconAwsLocationTracker from './Icon-Resource/Res_Amazon-Location-Service_Track _48.png';
import iconAwsAmplifyApp from './Icon-Resource/Res_AWS-Amplify_AWS-Amplify-Studio_48.png';
import iconAwsIotCertificate from './Icon-Resource/Res_AWS-IoT_Certificate_48.png';
import iconAwsIotPolicy from './Icon-Resource/Res_AWS-IoT_Policy_48.png';
import iconAwsIotanalyticsChannel from './Icon-Resource/Res_AWS-IoT-Analytics_Channel_48.png';
import iconAwsIotanalyticsDatastore from './Icon-Resource/Res_AWS-IoT-Analytics_Data-Store_48.png';
import iconAwsIotanalyticsDataset from './Icon-Resource/Res_AWS-IoT-Analytics_Dataset_48.png';
import iconAwsIotanalyticsPipeline from './Icon-Resource/Res_AWS-IoT-Analytics_Pipeline_48.png';
import iconAwsIotfleethubApplication from './Icon-Resource/Res_AWS-IoT-Device-Management_Fleet-Hub_48.png';
import iconAwsGreengrassv2ComponentVersion from './Icon-Resource/Res_AWS-IoT-Greengrass_Component_48.png';
import iconAwsIotTopicRule from './Icon-Resource/Res_AWS-IoT-Rule_48.png';
import iconAwsIotsitewiseAsset from './Icon-Resource/Res_AWS-IoT-SiteWise_Asset_48.png';
import iconAwsIotsitewiseAssetModel from './Icon-Resource/Res_AWS-IoT-SiteWise_Asset-Model_48.png';
import iconAwsSagemakerModel from './Icon-Resource/Res_Amazon-SageMaker_Model_48.png';
import iconAwsSagemakerNotebookInstance from './Icon-Resource/Res_Amazon-SageMaker_Notebook_48.png';
import iconAwsCloudwatchMetricAlarm from './Icon-Resource/Res_Amazon-CloudWatch_Alarm_48.png';
import iconAwsOamLink from './Icon-Resource/Res_Amazon-CloudWatch_Cross-account-Observability_48.png';
import iconAwsCloudwatchLogDataProtectionPolicy from './Icon-Resource/Res_Amazon-CloudWatch_Data-Protection_48.png';
import iconAwsEvidentlyProject from './Icon-Resource/Res_Amazon-CloudWatch_Evidently_48.png';
import iconAwsCloudwatchLogGroup from './Icon-Resource/Res_Amazon-CloudWatch_Logs_48.png';
import iconAwsRumAppMonitor from './Icon-Resource/Res_Amazon-CloudWatch_RUM_48.png';
import iconAwsSyntheticsCanary from './Icon-Resource/Res_Amazon-CloudWatch_Synthetics_48.png';
import iconAwsCloudformationStack from './Icon-Resource/Res_AWS-CloudFormation_Stack_48.png';
import iconAwsCloudtrailEventDataStore from './Icon-Resource/Res_AWS-CloudTrail_CloudTrail-Lake_48.png';
import iconAwsOpsworksApplication from './Icon-Resource/Res_AWS-OpsWorks_Apps_48.png';
import iconAwsOpsworksInstance from './Icon-Resource/Res_AWS-OpsWorks_Instances_48.png';
import iconAwsOpsworksPermission from './Icon-Resource/Res_AWS-OpsWorks_Permissions_48.png';
import iconAwsOpsworksStack from './Icon-Resource/Res_AWS-OpsWorks_Stack2_48.png';
import iconAwsOrganizationsAccount from './Icon-Resource/Res_AWS-Organizations_Account_48.png';
import iconAwsOrganizationsOrganizationalUnit from './Icon-Resource/Res_AWS-Organizations_Organizational-Unit_48.png';
import iconAwsSsmDocument from './Icon-Resource/Res_AWS-Systems-Manager_Documents_48.png';
import iconAwsSsmincidentsResponsePlan from './Icon-Resource/Res_AWS-Systems-Manager_Incident-Manager_48.png';
import iconAwsSsmMaintenanceWindow from './Icon-Resource/Res_AWS-Systems-Manager_Maintenance-Windows_48.png';
import iconAwsSsmParameter from './Icon-Resource/Res_AWS-Systems-Manager_Parameter-Store_48.png';
import iconAwsSsmPatchBaseline from './Icon-Resource/Res_AWS-Systems-Manager_Patch-Manager_48.png';
import iconAwsSsmAssociation from './Icon-Resource/Res_AWS-Systems-Manager_State-Manager_48.png';
import iconAwsMediaconnectGateway from './Icon-Resource/Res_AWS-Elemental-MediaConnect_MediaConnect-Gateway_48.png';
import iconAwsDatasyncAgent from './Icon-Resource/Res_AWS-Datasync_Agent_48.png';
import iconAwsDatasyncDiscoveryJob from './Icon-Resource/Res_AWS-DataSync_Discovery_48.png';
import iconAwsM2Environment from './Icon-Resource/Res_AWS-Mainframe-Modernization_Runtime_48.png';
import iconAwsRefactorspacesApplication from './Icon-Resource/Res_AWS-Migration-Hub_Refactor-Spaces-Applications_48.png';
import iconAwsRefactorspacesEnvironment from './Icon-Resource/Res_AWS-Migration-Hub_Refactor-Spaces-Environments_48.png';
import iconAwsRefactorspacesService from './Icon-Resource/Res_AWS-Migration-Hub_Refactor-Spaces-Services_48.png';
import iconAwsTransferConnector from './Icon-Resource/Res_AWS-Transfer-Family_AWS-AS2_48.png';
import iconAwsTransferServer from './Icon-Resource/Res_AWS-Transfer-Family_AWS-FTP_48.png';
import iconAwsCloudfrontDistribution from './Icon-Resource/Res_Amazon-CloudFront_Download-Distribution_48.png';
import iconAwsCloudfrontFunction from './Icon-Resource/Res_Amazon-CloudFront_Functions_48.png';
import iconAwsRoute53recoveryreadinessReadinessCheck from './Icon-Resource/Res_Amazon-Route-53_Readiness-Checks_48.png';
import iconAwsRoute53ResolverEndpoint from './Icon-Resource/Res_Amazon-Route-53_Resolver_48.png';
import iconAwsRoute53ResolverFirewallDomainList from './Icon-Resource/Res_Amazon-Route-53_Resolver-DNS-Firewall_48.png';
import iconAwsRoute53ResolverQueryLogConfig from './Icon-Resource/Res_Amazon-Route-53_Resolver-Query-Logging_48.png';
import iconAwsRoute53recoverycontrolconfigCluster from './Icon-Resource/Res_Amazon-Route-53_Route-53-Application-Recovery-Controller_48.png';
import iconAwsRouteTable from './Icon-Resource/Res_Amazon-Route-53_Route-Table_48.png';
import iconAwsRoute53recoverycontrolconfigRoutingControl from './Icon-Resource/Res_Amazon-Route-53_Routing-Controls_48.png';
import iconAwsRoute53Zone from './Icon-Resource/Res_Amazon-Route-53-Hosted-Zone_48.png';
import iconAwsEc2CarrierGateway from './Icon-Resource/Res_Amazon-VPC_Carrier-Gateway_48.png';
import iconAwsCustomerGateway from './Icon-Resource/Res_Amazon-VPC_Customer-Gateway_48.png';
import iconAwsNetworkInterface from './Icon-Resource/Res_Amazon-VPC_Elastic-Network-Interface_48.png';
import iconAwsVpcEndpoint from './Icon-Resource/Res_Amazon-VPC_Endpoints_48.png';
import iconAwsFlowLog from './Icon-Resource/Res_Amazon-VPC_Flow-Logs_48.png';
import iconAwsInternetGateway from './Icon-Resource/Res_Amazon-VPC_Internet-Gateway_48.png';
import iconAwsNatGateway from './Icon-Resource/Res_Amazon-VPC_NAT-Gateway_48.png';
import iconAwsEc2NetworkInsightsAnalysis from './Icon-Resource/Res_Amazon-VPC_Network-Access-Analyzer_48.png';
import iconAwsNetworkAcl from './Icon-Resource/Res_Amazon-VPC_Network-Access-Control-List_48.png';
import iconAwsVpcPeeringConnection from './Icon-Resource/Res_Amazon-VPC_Peering-Connection_48.png';
import iconAwsEc2NetworkInsightsPath from './Icon-Resource/Res_Amazon-VPC_Reachability-Analyzer_48.png';
import iconAwsEc2TrafficMirrorSession from './Icon-Resource/Res_Amazon-VPC_Traffic-Mirroring_48.png';
import iconAwsVpc from './Icon-Resource/Res_Amazon-VPC_Virtual-private-cloud-VPC_48.png';
import iconAwsVpnConnection from './Icon-Resource/Res_Amazon-VPC_VPN-Connection_48.png';
import iconAwsVpnGateway from './Icon-Resource/Res_Amazon-VPC_VPN-Gateway_48.png';
import iconAwsAppmeshMesh from './Icon-Resource/Res_AWS-App-Mesh_Mesh_48.png';
import iconAwsAppmeshVirtualGateway from './Icon-Resource/Res_AWS-App-Mesh_Virtual-Gateway_48.png';
import iconAwsAppmeshVirtualNode from './Icon-Resource/Res_AWS-App-Mesh_Virtual-Node_48.png';
import iconAwsAppmeshVirtualRouter from './Icon-Resource/Res_AWS-App-Mesh_Virtual-Router_48.png';
import iconAwsAppmeshVirtualService from './Icon-Resource/Res_AWS-App-Mesh_Virtual-Service_48.png';
import iconAwsServiceDiscoveryPrivateDnsNamespace from './Icon-Resource/Res_AWS-Cloud-Map_Namespace_48.png';
import iconAwsServiceDiscoveryService from './Icon-Resource/Res_AWS-Cloud-Map_Service_48.png';
import iconAwsNetworkmanagerCoreNetwork from './Icon-Resource/Res_AWS-Cloud-WAN_Core-Network-Edge_48.png';
import iconAwsNetworkmanagerTransitGatewayRouteTableAttachment from './Icon-Resource/Res_AWS-Cloud-WAN_Transit-Gateway-Route-Table-Attachment_48.png';
import iconAwsDxGateway from './Icon-Resource/Res_AWS-Direct-Connect_Gateway_48.png';
import iconAwsEc2TransitGatewayVpcAttachment from './Icon-Resource/Res_AWS-Transit-Gateway_Attachment_48.png';
import iconAwsLb from './Icon-Resource/Res_Elastic-Load-Balancing_Application-Load-Balancer_48.png';
import iconAwsElb from './Icon-Resource/Res_Elastic-Load-Balancing_Classic-Load-Balancer_48.png';
import iconAwsAcmpcaCertificateAuthority from './Icon-Resource/Res_AWS-Certificate-Manager_Certificate-Authority_48.png';
import iconAwsDirectoryServiceDirectory from './Icon-Resource/Res_AWS-Directory-Service_AWS-Managed-Microsoft-AD_48.png';
import iconAwsAccessanalyzerAnalyzer from './Icon-Resource/Res_AWS-Identity-Access-Management_IAM-Access-Analyzer_48.png';
import iconAwsRolesanywhereTrustAnchor from './Icon-Resource/Res_AWS-Identity-Access-Management_IAM-Roles-Anywhere_48.png';
import iconAwsIamAccessKey from './Icon-Resource/Res_AWS-Identity-Access-Management_Long-Term-Security-Credential_48.png';
import iconAwsIamVirtualMfaDevice from './Icon-Resource/Res_AWS-Identity-Access-Management_MFA-Token_48.png';
import iconAwsIamPolicy from './Icon-Resource/Res_AWS-Identity-Access-Management_Permissions_48.png';
import iconAwsIamRole from './Icon-Resource/Res_AWS-Identity-Access-Management_Role_48.png';
import iconAwsKmsCustomKeyStore from './Icon-Resource/Res_AWS-Key-Management-Service_External-Key-Store_48.png';
import iconAwsNetworkfirewallFirewall from './Icon-Resource/Res_AWS-Network-Firewall_Endpoints_48.png';
import iconAwsShieldProtection from './Icon-Resource/Res_AWS-Shield_AWS-Shield-Advanced_48.png';
import iconAwsWafv2RuleGroup from './Icon-Resource/Res_AWS-WAF_Filtering-Rule_48.png';
import iconAwsDlmLifecyclePolicy from './Icon-Resource/Res_Amazon-Elastic-Block-Store_Amazon-Data-Lifecycle-Manager_48.png';
import iconAwsEbsSnapshot from './Icon-Resource/Res_Amazon-Elastic-Block-Store_Snapshot_48.png';
import iconAwsEbsVolume from './Icon-Resource/Res_Amazon-Elastic-Block-Store_Volume_48.png';
import iconAwsEfsFileSystem from './Icon-Resource/Res_Amazon-Elastic-File-System_File-System_48.png';
import iconAwsFsxFileCache from './Icon-Resource/Res_Amazon-File-Cache_Hybrid-NFS-linked-datasets_48.png';
import iconAwsS3Bucket from './Icon-Resource/Res_Amazon-Simple-Storage-Service_Bucket_48.png';
import iconAwsS3AccessPoint from './Icon-Resource/Res_Amazon-Simple-Storage-Service_General-Access-Points_48.png';
import iconAwsS3Object from './Icon-Resource/Res_Amazon-Simple-Storage-Service_Object_48.png';
import iconAwsS3BucketIntelligentTieringConfiguration from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Intelligent-Tiering_48.png';
import iconAwsS3controlMultiRegionAccessPoint from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Multi-Region-Access-Points_48.png';
import iconAwsS3controlObjectLambdaAccessPoint from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Object-Lambda_48.png';
import iconAwsS3BucketObjectLockConfiguration from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Object-Lock_48.png';
import iconAwsS3outpostsEndpoint from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-On-Outposts_48.png';
import iconAwsS3BucketReplicationConfiguration from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Replication_48.png';
import iconAwsS3controlStorageLensConfiguration from './Icon-Resource/Res_Amazon-Simple-Storage-Service_S3-Storage-Lens_48.png';
import iconAwsGlacierVault from './Icon-Resource/Res_Amazon-Simple-Storage-Service-Glacier_Vault_48.png';
import iconAwsBackupFramework from './Icon-Resource/Res_AWS-Backup_Audit-Manager_48.png';
import iconAwsBackupPlan from './Icon-Resource/Res_AWS-Backup_Backup-Plan_48.png';
import iconAwsBackupRestoreTestingPlan from './Icon-Resource/Res_AWS-Backup_Backup-Restore_48.png';
import iconAwsBackupVault from './Icon-Resource/Res_AWS-Backup_Backup-Vault_48.png';
import iconAwsBackupReportPlan from './Icon-Resource/Res_AWS-Backup_Compliance-Reporting_48.png';
import iconAwsBackupGatewayGateway from './Icon-Resource/Res_AWS-Backup_Gateway_48.png';
import iconAwsBackupLegalHold from './Icon-Resource/Res_AWS-Backup_Legal-Hold_48.png';
import iconAwsBackupVaultLockConfiguration from './Icon-Resource/Res_AWS-Backup_Vault-Lock_48.png';
import iconAwsStoragegatewayCachedIscsiVolume from './Icon-Resource/Res_AWS-Storage-Gateway_Cached-Volume_48.png';
import iconAwsStoragegatewayGateway from './Icon-Resource/Res_AWS-Storage-Gateway_File-Gateway_48.png';
import iconAwsStoragegatewayStoredIscsiVolume from './Icon-Resource/Res_AWS-Storage-Gateway_Noncached-Volume_48.png';
import iconAwsStoragegatewayTapePool from './Icon-Resource/Res_AWS-Storage-Gateway_Tape-Gateway_48.png';

export interface SubtypeConfig {
  iconSrc: string;
  awsServiceName: string;
  category: string;
}

export const subtypeConfig: Record<ResourceSubtype, SubtypeConfig> = {
  aws_emr_cluster: { iconSrc: iconAwsEmrCluster, awsServiceName: 'Amazon EMR', category: 'Analytics' },
  aws_mskconnect_connector: { iconSrc: iconAwsMskconnectConnector, awsServiceName: 'Amazon MSK', category: 'Analytics' },
  aws_osis_pipeline: { iconSrc: iconAwsOsisPipeline, awsServiceName: 'Amazon OpenSearch Service', category: 'Analytics' },
  aws_athena_data_catalog: { iconSrc: iconAwsAthenaDataCatalog, awsServiceName: 'Amazon Athena', category: 'Analytics' },
  aws_glue_crawler: { iconSrc: iconAwsGlueCrawler, awsServiceName: 'AWS Glue', category: 'Analytics' },
  aws_glue_catalog_database: { iconSrc: iconAwsGlueCatalogDatabase, awsServiceName: 'AWS Glue', category: 'Analytics' },
  aws_glue_data_quality_ruleset: { iconSrc: iconAwsGlueDataQualityRuleset, awsServiceName: 'AWS Glue', category: 'Analytics' },
  aws_lakeformation_data_lake_settings: { iconSrc: iconAwsLakeformationDataLakeSettings, awsServiceName: 'AWS Lake Formation', category: 'Analytics' },
  aws_api_gateway_rest_api: { iconSrc: iconAwsApiGatewayRestApi, awsServiceName: 'Amazon API Gateway', category: 'Application-Integration' },
  aws_cloudwatch_event_bus: { iconSrc: iconAwsCloudwatchEventBus, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_pipes_pipe: { iconSrc: iconAwsPipesPipe, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_cloudwatch_event_rule: { iconSrc: iconAwsCloudwatchEventRule, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_scheduler_schedule: { iconSrc: iconAwsSchedulerSchedule, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_schemas_schema: { iconSrc: iconAwsSchemasSchema, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_schemas_registry: { iconSrc: iconAwsSchemasRegistry, awsServiceName: 'Amazon EventBridge', category: 'Application-Integration' },
  aws_mq_broker: { iconSrc: iconAwsMqBroker, awsServiceName: 'Amazon MQ', category: 'Application-Integration' },
  aws_sns_topic_subscription: { iconSrc: iconAwsSnsTopicSubscription, awsServiceName: 'Amazon Simple Notification Service', category: 'Application-Integration' },
  aws_sns_topic: { iconSrc: iconAwsSnsTopic, awsServiceName: 'Amazon Simple Notification Service', category: 'Application-Integration' },
  aws_sqs_queue: { iconSrc: iconAwsSqsQueue, awsServiceName: 'Amazon Simple Queue Service', category: 'Application-Integration' },
  aws_managedblockchain_member: { iconSrc: iconAwsManagedblockchainMember, awsServiceName: 'Amazon Managed Blockchain', category: 'Blockchain' },
  aws_sesv2_email_identity: { iconSrc: iconAwsSesv2EmailIdentity, awsServiceName: 'Amazon Simple Email Service', category: 'Business-Applications' },
  aws_ami: { iconSrc: iconAwsAmi, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_autoscaling_group: { iconSrc: iconAwsAutoscalingGroup, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_eip: { iconSrc: iconAwsEip, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_instance: { iconSrc: iconAwsInstance, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_launch_template: { iconSrc: iconAwsLaunchTemplate, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_spot_instance_request: { iconSrc: iconAwsSpotInstanceRequest, awsServiceName: 'Amazon EC2', category: 'Compute' },
  aws_elastic_beanstalk_application: { iconSrc: iconAwsElasticBeanstalkApplication, awsServiceName: 'AWS Elastic Beanstalk', category: 'Compute' },
  aws_elastic_beanstalk_environment: { iconSrc: iconAwsElasticBeanstalkEnvironment, awsServiceName: 'AWS Elastic Beanstalk', category: 'Compute' },
  aws_lambda_function: { iconSrc: iconAwsLambdaFunction, awsServiceName: 'AWS Lambda', category: 'Compute' },
  aws_ecr_repository: { iconSrc: iconAwsEcrRepository, awsServiceName: 'Amazon Elastic Container Registry', category: 'Containers' },
  aws_ecs_cluster: { iconSrc: iconAwsEcsCluster, awsServiceName: 'Amazon Elastic Container Cluster', category: 'Compute' },
  aws_ecs_service: { iconSrc: iconAwsEcsService, awsServiceName: 'Amazon Elastic Container Service', category: 'Containers' },
  aws_ecs_task_definition: { iconSrc: iconAwsEcsTaskDefinition, awsServiceName: 'Amazon Elastic Container Service', category: 'Containers' },
  aws_eks_cluster: { iconSrc: iconAwsEksCluster, awsServiceName: 'Amazon Elastic Kubernetes Service', category: 'Containers' },
  aws_rds_cluster_instance: { iconSrc: iconAwsRdsClusterInstance, awsServiceName: 'Amazon Aurora', category: 'Database' },
  aws_db_instance: { iconSrc: iconAwsDbInstance, awsServiceName: 'Amazon RDS', category: 'Database' },
  aws_rds_cluster: { iconSrc: iconAwsRdsCluster, awsServiceName: 'Amazon Aurora', category: 'Database' },
  aws_docdbelastic_cluster: { iconSrc: iconAwsDocdbelasticCluster, awsServiceName: 'Amazon DocumentDB', category: 'Database' },
  aws_dax_cluster: { iconSrc: iconAwsDaxCluster, awsServiceName: 'Amazon DynamoDB', category: 'Database' },
  aws_dynamodb_table: { iconSrc: iconAwsDynamodbTable, awsServiceName: 'Amazon DynamoDB', category: 'Database' },
  aws_elasticache_cluster: { iconSrc: iconAwsElasticacheCluster, awsServiceName: 'Amazon ElastiCache', category: 'Database' },
  aws_elasticache_replication_group: { iconSrc: iconAwsElasticacheReplicationGroup, awsServiceName: 'Amazon ElastiCache', category: 'Database' },
  aws_db_proxy: { iconSrc: iconAwsDbProxy, awsServiceName: 'Amazon RDS', category: 'Database' },
  aws_dms_replication_task: { iconSrc: iconAwsDmsReplicationTask, awsServiceName: 'AWS Database Migration Service', category: 'Database' },
  aws_cloud9_environment_ec2: { iconSrc: iconAwsCloud9EnvironmentEc2, awsServiceName: 'AWS Cloud9', category: 'Developer-Tools' },
  aws_workspaces_workspace: { iconSrc: iconAwsWorkspacesWorkspace, awsServiceName: 'Amazon WorkSpaces', category: 'End-User-Computing' },
  aws_workspacesweb_portal: { iconSrc: iconAwsWorkspaceswebPortal, awsServiceName: 'Amazon WorkSpaces', category: 'End-User-Computing' },
  aws_location_geofence_collection: { iconSrc: iconAwsLocationGeofenceCollection, awsServiceName: 'Amazon Location Service', category: 'Front-End-Web-Mobile' },
  aws_location_map: { iconSrc: iconAwsLocationMap, awsServiceName: 'Amazon Location Service', category: 'Front-End-Web-Mobile' },
  aws_location_place_index: { iconSrc: iconAwsLocationPlaceIndex, awsServiceName: 'Amazon Location Service', category: 'Front-End-Web-Mobile' },
  aws_location_route_calculator: { iconSrc: iconAwsLocationRouteCalculator, awsServiceName: 'Amazon Location Service', category: 'Front-End-Web-Mobile' },
  aws_location_tracker: { iconSrc: iconAwsLocationTracker, awsServiceName: 'Amazon Location Service', category: 'Front-End-Web-Mobile' },
  aws_amplify_app: { iconSrc: iconAwsAmplifyApp, awsServiceName: 'AWS Amplify', category: 'Front-End-Web-Mobile' },
  aws_iot_certificate: { iconSrc: iconAwsIotCertificate, awsServiceName: 'AWS IoT', category: 'IoT' },
  aws_iot_policy: { iconSrc: iconAwsIotPolicy, awsServiceName: 'AWS IoT', category: 'IoT' },
  aws_iotanalytics_channel: { iconSrc: iconAwsIotanalyticsChannel, awsServiceName: 'AWS IoT Analytics', category: 'IoT' },
  aws_iotanalytics_datastore: { iconSrc: iconAwsIotanalyticsDatastore, awsServiceName: 'AWS IoT Analytics', category: 'IoT' },
  aws_iotanalytics_dataset: { iconSrc: iconAwsIotanalyticsDataset, awsServiceName: 'AWS IoT Analytics', category: 'IoT' },
  aws_iotanalytics_pipeline: { iconSrc: iconAwsIotanalyticsPipeline, awsServiceName: 'AWS IoT Analytics', category: 'IoT' },
  aws_iotfleethub_application: { iconSrc: iconAwsIotfleethubApplication, awsServiceName: 'AWS IoT Device Management', category: 'IoT' },
  aws_greengrassv2_component_version: { iconSrc: iconAwsGreengrassv2ComponentVersion, awsServiceName: 'AWS IoT Greengrass', category: 'IoT' },
  aws_iot_topic_rule: { iconSrc: iconAwsIotTopicRule, awsServiceName: 'AWS IoT', category: 'IoT' },
  aws_iotsitewise_asset: { iconSrc: iconAwsIotsitewiseAsset, awsServiceName: 'AWS IoT SiteWise', category: 'IoT' },
  aws_iotsitewise_asset_model: { iconSrc: iconAwsIotsitewiseAssetModel, awsServiceName: 'AWS IoT SiteWise', category: 'IoT' },
  aws_sagemaker_model: { iconSrc: iconAwsSagemakerModel, awsServiceName: 'Amazon SageMaker', category: 'Machine-Learning' },
  aws_sagemaker_notebook_instance: { iconSrc: iconAwsSagemakerNotebookInstance, awsServiceName: 'Amazon SageMaker', category: 'Machine-Learning' },
  aws_cloudwatch_metric_alarm: { iconSrc: iconAwsCloudwatchMetricAlarm, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_oam_link: { iconSrc: iconAwsOamLink, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_cloudwatch_log_data_protection_policy: { iconSrc: iconAwsCloudwatchLogDataProtectionPolicy, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_evidently_project: { iconSrc: iconAwsEvidentlyProject, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_cloudwatch_log_group: { iconSrc: iconAwsCloudwatchLogGroup, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_rum_app_monitor: { iconSrc: iconAwsRumAppMonitor, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_synthetics_canary: { iconSrc: iconAwsSyntheticsCanary, awsServiceName: 'Amazon CloudWatch', category: 'Management-Governance' },
  aws_cloudformation_stack: { iconSrc: iconAwsCloudformationStack, awsServiceName: 'AWS CloudFormation', category: 'Management-Governance' },
  aws_cloudtrail_event_data_store: { iconSrc: iconAwsCloudtrailEventDataStore, awsServiceName: 'AWS CloudTrail', category: 'Management-Governance' },
  aws_opsworks_application: { iconSrc: iconAwsOpsworksApplication, awsServiceName: 'AWS OpsWorks', category: 'Management-Governance' },
  aws_opsworks_instance: { iconSrc: iconAwsOpsworksInstance, awsServiceName: 'AWS OpsWorks', category: 'Management-Governance' },
  aws_opsworks_permission: { iconSrc: iconAwsOpsworksPermission, awsServiceName: 'AWS OpsWorks', category: 'Management-Governance' },
  aws_opsworks_stack: { iconSrc: iconAwsOpsworksStack, awsServiceName: 'AWS OpsWorks', category: 'Management-Governance' },
  aws_organizations_account: { iconSrc: iconAwsOrganizationsAccount, awsServiceName: 'AWS Organizations', category: 'Management-Governance' },
  aws_organizations_organizational_unit: { iconSrc: iconAwsOrganizationsOrganizationalUnit, awsServiceName: 'AWS Organizations', category: 'Management-Governance' },
  aws_ssm_document: { iconSrc: iconAwsSsmDocument, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_ssmincidents_response_plan: { iconSrc: iconAwsSsmincidentsResponsePlan, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_ssm_maintenance_window: { iconSrc: iconAwsSsmMaintenanceWindow, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_ssm_parameter: { iconSrc: iconAwsSsmParameter, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_ssm_patch_baseline: { iconSrc: iconAwsSsmPatchBaseline, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_ssm_association: { iconSrc: iconAwsSsmAssociation, awsServiceName: 'AWS Systems Manager', category: 'Management-Governance' },
  aws_mediaconnect_gateway: { iconSrc: iconAwsMediaconnectGateway, awsServiceName: 'AWS Elemental MediaConnect', category: 'Media-Services' },
  aws_datasync_agent: { iconSrc: iconAwsDatasyncAgent, awsServiceName: 'AWS DataSync', category: 'Migration-and-Transfer' },
  aws_datasync_discovery_job: { iconSrc: iconAwsDatasyncDiscoveryJob, awsServiceName: 'AWS DataSync', category: 'Migration-and-Transfer' },
  aws_m2_environment: { iconSrc: iconAwsM2Environment, awsServiceName: 'AWS Mainframe Modernization', category: 'Migration-and-Transfer' },
  aws_refactorspaces_application: { iconSrc: iconAwsRefactorspacesApplication, awsServiceName: 'AWS Migration Hub', category: 'Migration-and-Transfer' },
  aws_refactorspaces_environment: { iconSrc: iconAwsRefactorspacesEnvironment, awsServiceName: 'AWS Migration Hub', category: 'Migration-and-Transfer' },
  aws_refactorspaces_service: { iconSrc: iconAwsRefactorspacesService, awsServiceName: 'AWS Migration Hub', category: 'Migration-and-Transfer' },
  aws_transfer_connector: { iconSrc: iconAwsTransferConnector, awsServiceName: 'AWS Transfer Family', category: 'Migration-and-Transfer' },
  aws_transfer_server: { iconSrc: iconAwsTransferServer, awsServiceName: 'AWS Transfer Family', category: 'Migration-and-Transfer' },
  aws_cloudfront_distribution: { iconSrc: iconAwsCloudfrontDistribution, awsServiceName: 'Amazon CloudFront', category: 'Networking-and-Content-Delivery' },
  aws_cloudfront_function: { iconSrc: iconAwsCloudfrontFunction, awsServiceName: 'Amazon CloudFront', category: 'Networking-and-Content-Delivery' },
  aws_route53recoveryreadiness_readiness_check: { iconSrc: iconAwsRoute53recoveryreadinessReadinessCheck, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route53_resolver_endpoint: { iconSrc: iconAwsRoute53ResolverEndpoint, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route53_resolver_firewall_domain_list: { iconSrc: iconAwsRoute53ResolverFirewallDomainList, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route53_resolver_query_log_config: { iconSrc: iconAwsRoute53ResolverQueryLogConfig, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route53recoverycontrolconfig_cluster: { iconSrc: iconAwsRoute53recoverycontrolconfigCluster, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route_table: { iconSrc: iconAwsRouteTable, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_route53recoverycontrolconfig_routing_control: { iconSrc: iconAwsRoute53recoverycontrolconfigRoutingControl, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_route53_zone: { iconSrc: iconAwsRoute53Zone, awsServiceName: 'Amazon Route 53', category: 'Networking-and-Content-Delivery' },
  aws_ec2_carrier_gateway: { iconSrc: iconAwsEc2CarrierGateway, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_customer_gateway: { iconSrc: iconAwsCustomerGateway, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_network_interface: { iconSrc: iconAwsNetworkInterface, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_vpc_endpoint: { iconSrc: iconAwsVpcEndpoint, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_flow_log: { iconSrc: iconAwsFlowLog, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_internet_gateway: { iconSrc: iconAwsInternetGateway, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_nat_gateway: { iconSrc: iconAwsNatGateway, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_ec2_network_insights_analysis: { iconSrc: iconAwsEc2NetworkInsightsAnalysis, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_network_acl: { iconSrc: iconAwsNetworkAcl, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_vpc_peering_connection: { iconSrc: iconAwsVpcPeeringConnection, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_ec2_network_insights_path: { iconSrc: iconAwsEc2NetworkInsightsPath, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_ec2_traffic_mirror_session: { iconSrc: iconAwsEc2TrafficMirrorSession, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_vpc: { iconSrc: iconAwsVpc, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_vpn_connection: { iconSrc: iconAwsVpnConnection, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_vpn_gateway: { iconSrc: iconAwsVpnGateway, awsServiceName: 'Amazon VPC', category: 'Networking-and-Content-Delivery' },
  aws_appmesh_mesh: { iconSrc: iconAwsAppmeshMesh, awsServiceName: 'AWS App Mesh', category: 'Networking-and-Content-Delivery' },
  aws_appmesh_virtual_gateway: { iconSrc: iconAwsAppmeshVirtualGateway, awsServiceName: 'AWS App Mesh', category: 'Networking-and-Content-Delivery' },
  aws_appmesh_virtual_node: { iconSrc: iconAwsAppmeshVirtualNode, awsServiceName: 'AWS App Mesh', category: 'Networking-and-Content-Delivery' },
  aws_appmesh_virtual_router: { iconSrc: iconAwsAppmeshVirtualRouter, awsServiceName: 'AWS App Mesh', category: 'Networking-and-Content-Delivery' },
  aws_appmesh_virtual_service: { iconSrc: iconAwsAppmeshVirtualService, awsServiceName: 'AWS App Mesh', category: 'Networking-and-Content-Delivery' },
  aws_service_discovery_private_dns_namespace: { iconSrc: iconAwsServiceDiscoveryPrivateDnsNamespace, awsServiceName: 'AWS Cloud Map', category: 'Networking-and-Content-Delivery' },
  aws_service_discovery_service: { iconSrc: iconAwsServiceDiscoveryService, awsServiceName: 'AWS Cloud Map', category: 'Networking-and-Content-Delivery' },
  aws_networkmanager_core_network: { iconSrc: iconAwsNetworkmanagerCoreNetwork, awsServiceName: 'AWS Cloud WAN', category: 'Networking-and-Content-Delivery' },
  aws_networkmanager_transit_gateway_route_table_attachment: { iconSrc: iconAwsNetworkmanagerTransitGatewayRouteTableAttachment, awsServiceName: 'AWS Cloud WAN', category: 'Networking-and-Content-Delivery' },
  aws_dx_gateway: { iconSrc: iconAwsDxGateway, awsServiceName: 'AWS Direct Connect', category: 'Networking-and-Content-Delivery' },
  aws_ec2_transit_gateway_vpc_attachment: { iconSrc: iconAwsEc2TransitGatewayVpcAttachment, awsServiceName: 'AWS Transit Gateway', category: 'Networking-and-Content-Delivery' },
  aws_lb: { iconSrc: iconAwsLb, awsServiceName: 'Elastic Load Balancing', category: 'Networking-and-Content-Delivery' },
  aws_elb: { iconSrc: iconAwsElb, awsServiceName: 'Elastic Load Balancing', category: 'Networking-and-Content-Delivery' },
  aws_acmpca_certificate_authority: { iconSrc: iconAwsAcmpcaCertificateAuthority, awsServiceName: 'AWS Certificate Manager', category: 'Security-Identity-and-Compliance' },
  aws_directory_service_directory: { iconSrc: iconAwsDirectoryServiceDirectory, awsServiceName: 'AWS Directory Service', category: 'Security-Identity-and-Compliance' },
  aws_accessanalyzer_analyzer: { iconSrc: iconAwsAccessanalyzerAnalyzer, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_rolesanywhere_trust_anchor: { iconSrc: iconAwsRolesanywhereTrustAnchor, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_iam_access_key: { iconSrc: iconAwsIamAccessKey, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_iam_virtual_mfa_device: { iconSrc: iconAwsIamVirtualMfaDevice, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_iam_policy: { iconSrc: iconAwsIamPolicy, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_iam_role: { iconSrc: iconAwsIamRole, awsServiceName: 'AWS Identity and Access Management', category: 'Security-Identity-and-Compliance' },
  aws_kms_custom_key_store: { iconSrc: iconAwsKmsCustomKeyStore, awsServiceName: 'AWS Key Management Service', category: 'Security-Identity-and-Compliance' },
  aws_networkfirewall_firewall: { iconSrc: iconAwsNetworkfirewallFirewall, awsServiceName: 'AWS Network Firewall', category: 'Security-Identity-and-Compliance' },
  aws_shield_protection: { iconSrc: iconAwsShieldProtection, awsServiceName: 'AWS Shield', category: 'Security-Identity-and-Compliance' },
  aws_wafv2_rule_group: { iconSrc: iconAwsWafv2RuleGroup, awsServiceName: 'AWS WAF', category: 'Security-Identity-and-Compliance' },
  aws_dlm_lifecycle_policy: { iconSrc: iconAwsDlmLifecyclePolicy, awsServiceName: 'Amazon Elastic Block Store', category: 'Storage' },
  aws_ebs_snapshot: { iconSrc: iconAwsEbsSnapshot, awsServiceName: 'Amazon Elastic Block Store', category: 'Storage' },
  aws_ebs_volume: { iconSrc: iconAwsEbsVolume, awsServiceName: 'Amazon Elastic Block Store', category: 'Storage' },
  aws_efs_file_system: { iconSrc: iconAwsEfsFileSystem, awsServiceName: 'Amazon Elastic File System', category: 'Storage' },
  aws_fsx_file_cache: { iconSrc: iconAwsFsxFileCache, awsServiceName: 'Amazon File Cache', category: 'Storage' },
  aws_s3_bucket: { iconSrc: iconAwsS3Bucket, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3_access_point: { iconSrc: iconAwsS3AccessPoint, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3_object: { iconSrc: iconAwsS3Object, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3_bucket_intelligent_tiering_configuration: { iconSrc: iconAwsS3BucketIntelligentTieringConfiguration, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3control_multi_region_access_point: { iconSrc: iconAwsS3controlMultiRegionAccessPoint, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3control_object_lambda_access_point: { iconSrc: iconAwsS3controlObjectLambdaAccessPoint, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3_bucket_object_lock_configuration: { iconSrc: iconAwsS3BucketObjectLockConfiguration, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3outposts_endpoint: { iconSrc: iconAwsS3outpostsEndpoint, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3_bucket_replication_configuration: { iconSrc: iconAwsS3BucketReplicationConfiguration, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_s3control_storage_lens_configuration: { iconSrc: iconAwsS3controlStorageLensConfiguration, awsServiceName: 'Amazon Simple Storage Service', category: 'Storage' },
  aws_glacier_vault: { iconSrc: iconAwsGlacierVault, awsServiceName: 'Amazon S3 Glacier', category: 'Storage' },
  aws_backup_framework: { iconSrc: iconAwsBackupFramework, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_plan: { iconSrc: iconAwsBackupPlan, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_restore_testing_plan: { iconSrc: iconAwsBackupRestoreTestingPlan, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_vault: { iconSrc: iconAwsBackupVault, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_report_plan: { iconSrc: iconAwsBackupReportPlan, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_gateway_gateway: { iconSrc: iconAwsBackupGatewayGateway, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_legal_hold: { iconSrc: iconAwsBackupLegalHold, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_backup_vault_lock_configuration: { iconSrc: iconAwsBackupVaultLockConfiguration, awsServiceName: 'AWS Backup', category: 'Storage' },
  aws_storagegateway_cached_iscsi_volume: { iconSrc: iconAwsStoragegatewayCachedIscsiVolume, awsServiceName: 'AWS Storage Gateway', category: 'Storage' },
  aws_storagegateway_gateway: { iconSrc: iconAwsStoragegatewayGateway, awsServiceName: 'AWS Storage Gateway', category: 'Storage' },
  aws_storagegateway_stored_iscsi_volume: { iconSrc: iconAwsStoragegatewayStoredIscsiVolume, awsServiceName: 'AWS Storage Gateway', category: 'Storage' },
  aws_storagegateway_tape_pool: { iconSrc: iconAwsStoragegatewayTapePool, awsServiceName: 'AWS Storage Gateway', category: 'Storage' },
};

function ResourceNode({ data }: NodeProps<ResourceNodeData>) {
  const cfg = subtypeConfig[data.subtype];
  const isSelected = data.isSelected === true;
  const lines = data.shortLabel.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#4a5568', border: '1px solid #2d3748', width: 6, height: 6 }}
      />

      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 10,
          background: '#131825',
          border: `2px solid ${isSelected ? '#4dabf7' : '#2a3448'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSelected
            ? '0 0 0 3px rgba(77, 171, 247, 0.3), 0 4px 12px rgba(0,0,0,0.4)'
            : '0 2px 8px rgba(0,0,0,0.35)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <img src={cfg.iconSrc} width={36} height={36} alt={data.subtype} style={{ display: 'block' }} />
      </div>

      <div
        style={{
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: isSelected ? '#93c5fd' : '#cbd5e1',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
              letterSpacing: '0.2px',
              transition: 'color 0.2s',
            }}
          >
            {line}
          </span>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#4a5568', border: '1px solid #2d3748', width: 6, height: 6 }}
      />
    </div>
  );
}

export default memo(ResourceNode);
