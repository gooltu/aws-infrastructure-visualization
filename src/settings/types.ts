export interface Tier {
  id: string;
  label: string;
  resourceTypes: string[];
}

export interface GraphSettings {
  showEdges: boolean;
  publicSubnetsFirst: boolean;
  tiers: Tier[];
}
