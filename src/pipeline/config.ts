// Tweak these values to adjust how resources and groups are rendered on canvas.

export const RESOURCE_NODE_WIDTH = 90;
export const RESOURCE_NODE_HEIGHT = 110;

export const ELK_ROOT_OPTIONS: Record<string, string> = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.spacing.nodeNode': '60',
  'elk.padding': '[top=50,left=50,bottom=50,right=50]',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
};

export const ELK_GROUP_OPTIONS: Record<string, string> = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.padding': '[top=50,left=50,bottom=50,right=50]',
  'elk.spacing.nodeNode': '50',
  'elk.layered.spacing.nodeNodeBetweenLayers': '60',
};
