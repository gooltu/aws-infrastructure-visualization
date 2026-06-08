# AWS Cloud Infrastructure Visualization React Application

**Project Overview:**
Build a React frontend application that displays AWS cloud server infrastructure resources as an interactive, Miro-style infinite canvas diagram with zoom-in/zoom-out functionality, node-based visualization, and hierarchical grouping by AWS infrastructure levels.

---

## Core Requirements

### 1. Technology Stack
- **Framework:** React 18+ with Vite (recommended for fast dev setup)
- **Primary Library:** `@xyflow/react` (React Flow v12+ from xyflow) for node-based graph visualization
- **State Management:** React hooks (useState, useCallback) or Zustand for complex state
- **CSS:** CSS Modules or Tailwind CSS for styling
- **AWS Icons:** Use official AWS Shape Pack icons or @aws-icons package

### 2. Infinite Canvas Features
- Miro-board style infinite canvas with drag/pan functionality
- Zoom-in and zoom-out controls (keyboard: +/-, UI buttons, mouse wheel)
- Minimap component for navigation overview
- Controls component for zoom management
- Background grid pattern for visual reference
- Snap-to-grid functionality for node positioning

### 3. Node Structure & Hierarchy
Implement hierarchical grouping with bounding boxes following AWS infrastructure hierarchy:

AWS Region (outermost bounding box)
└─ VPC (bounding box)
└─ Availability Zone (bounding box)
└─ Subnet (bounding box)
└─ Resources (individual nodes):
- EC2 Servers
- Databases (RDS, Aurora)
- Load Balancers (ALB, NLB)
- Lambda Functions
- S3 Buckets
- Other AWS services



### 4. Edge/Connection Features
- Data movement between resources represented as edges (arrows)
- Edge types: smoothstep/bezier curves for professional appearance
- **Interactive highlighting:** When clicking any node, highlight all connecting edges to that node (as shown in Frame 2.png)
- Edge styling: Different colors for different data flow types (incoming/outgoing)
- Edge labels for data volume/traffic information

### 5. Initial Data: 3-Tier Web Architecture
Display this architecture initially:

**Presentation Tier:**
- Application Load Balancer (ALB)
- CloudFront Distribution

**Application Tier:**
- ECS with Fargate (or EC2 Auto Scaling Group)
- Internal-facing Load Balancer

**Data Tier:**
- Aurora MySQL Multi-AZ Database
- RDS Instance

Connect these with edges showing data flow:
- User → CloudFront → ALB → EC2/ECS → Internal ALB → Database

### 6. Node Design Specifications
- Each node is a React component (customizable per resource type)
- Node properties: id, position (x, y), size, type, data (label, icons, metadata)
- Include AWS service icons for visual recognition
- Node colors by resource type (e.g., databases = blue, servers = orange, LB = green)
- Hover effects showing additional resource details
- Click handler for edge highlighting and detail panels

### 7. Bounding Box Groups
- Visual bounding boxes with semi-transparent backgrounds for each hierarchy level
- Group labels at top-left of each box (Region name, VPC ID, AZ letter, Subnet ID)
- Nested box styling (different border colors/thickness per level)
- Optional: Collapse/expand groups to show/hide nested resources

### 8. Interactive Features
- Click node → Highlight connecting edges (primary requirement)
- Double-click node → Open detail panel/modal with resource metadata
- Drag nodes → Reposition within subnet constraints
- Right-click menu → Context actions (view in AWS console, edit, delete)
- Search/filter bar → Find resources by name/tag
- Layer controls → Toggle visibility of hierarchy levels

### 9. UI Components
- **Top toolbar:** Search, filter controls, export options, AWS account selector
- **Left sidebar:** Resource palette (drag-and-drop new resources)
- **Right panel:** Node/edge detail inspector (when selected)
- **Bottom controls:** Zoom level indicator, fit-view button, view mode toggle
- **Minimap:** Corner navigation view

### 10. Data Structure
Define TypeScript interfaces:

```typescript
interface AWSResource {
  id: string;
  type: 'ec2' | 'rds' | 'alb' | 'lambda' | 's3' | ...;
  position: { x: number; y: number };
  data: {
    label: string;
    arn: string;
    region: string;
    vpcId: string;
    az: string;
    subnetId: string;
    tags: Record<string, string>;
    metrics?: { cpuUsage: number; networkIn: number; networkOut: number };
  };
}

interface AWSEdge {
  id: string;
  source: string;
  target: string;
  data: {
    label?: string;
    trafficType: 'http' | 'tcp' | 'database';
    volume?: string;
  };
}

interface AWSGroup {
  id: string;
  type: 'region' | 'vpc' | 'az' | 'subnet';
  position: { x: number; y: number };
  size: { width: number; height: number };
  children: string[]; // resource/group IDs
  data: {
    name: string;
    cidr?: string;
    awsId: string;
  };
}
```

### 11. Sample Initial Data (3-Tier Architecture)
Create a hardcoded dataset representing:
- Region: `us-east-1`
- VPC: `vpc-0abc123`
- AZs: `us-east-1a`, `us-east-1b`
- Subnets: public (2), private (2)
- Resources: ALB, 2 EC2 (web), 2 EC2 (app), Internal ALB, Aurora DB

Position nodes logically showing the architecture flow left-to-right

### 12. AWS Integration (Optional Phase 2)
- AWS API Gateway + Lambda backend for fetching real infrastructure data
- Use AWS CloudView API pattern similar to Miro's integration
- VPC Resource map API for automated visualization
- AWS Credentials management (HTTPS, IAM roles)

---

## Implementation Steps

### Phase 1: Core Setup
1. Create Vite React project
2. Install `@xyflow/react` and dependencies
3. Setup basic ReactFlow component with infinite canvas
4. Add zoom controls, minimap, background

### Phase 2: Nodes & Groups
5. Create custom node components for each AWS resource type
6. Implement bounding box group components
7. Add hierarchical positioning logic (Region → VPC → AZ → Subnet → Resource)
8. Style nodes with AWS icons and color coding

### Phase 3: Edges & Interactions
9. Define edge types and styling (smoothstep curves)
10. Implement edge highlighting on node click (CRITICAL FEATURE)
11. Add hover effects and detail panels
12. Create drag/pan functionality

### Phase 4: 3-Tier Architecture
13. Create hardcoded dataset for 3-tier web architecture
14. Position nodes logically showing data flow
15. Add edges representing traffic paths
16. Test all interactions

### Phase 5: Polish & UI
17. Build toolbar, sidebar, detail panel components
18. Add search/filter functionality
19. Implement fit-view and auto-layout
20. Add responsive design and performance optimization

---

## Code Structure Example
src/
components/
ReactFlow/
InfrastructureGraph.tsx // Main ReactFlow component
CustomNodes/
EC2Node.tsx
RDSNode.tsx
ALBNode.tsx
LambdaNode.tsx
GenericNode.tsx
GroupBox.tsx // Bounding box component
EdgeHighlighting.tsx // Edge highlight logic
UI/
Toolbar.tsx
Sidebar.tsx
DetailPanel.tsx
ZoomControls.tsx
data/
threeTierArchitecture.ts // Sample 3-tier data
awsResourceTypes.ts // Resource type definitions
types/
aws.ts // TypeScript interfaces
hooks/
useEdgeHighlighting.ts // Edge highlight logic
useAWSData.ts // Data fetching (phase 2)
utils/
layoutHelpers.ts // Auto-positioning logic
awsIconMapper.ts // Icon mapping
App.tsx
main.tsx



---

## Key Dependencies to Install

```bash
npm create vite@latest aws-infrastructure-viz -- --template react
cd aws-infrastructure-viz
npm install @xyflow/react
npm install @aws-icons/react  # Optional: AWS icons
npm install tailwindcss       # Optional: Styling
npm install zustand          # Optional: State management
npm install lucide-react     # Icons for UI components
```

---

## Critical Features to Test

1. **Edge highlighting on node click** (Frame 2.png behavior) - PRIMARY REQUIREMENT
2. Zoom-in/zoom-out smoothness and performance
3. Bounding box nesting correctness (Region→VPC→AZ→Subnet→Resource)
4. 3-tier architecture displays correctly with proper data flow edges
5. Node drag within subnet constraints
6. Minimap navigation accuracy
7. Search/filter functionality

---

## Reference Resources

- **React Flow documentation:** https://reactflow.dev
- **AWS 3-Tier Architecture Workshop:** https://github.com/aws-samples/aws-three-tier-web-architecture-workshop
- **Miro AWS CloudView example:** https://help.miro.com/hc/en-us/articles/19893178414226-AWS-Cloud-View
- **AWS VPC Resource Map:** https://docs.aws.amazon.com/vpc/latest/userguide/view-vpc-resource-map.html
- **AWS Diagram Templates:** (Refer to your attached mockup images)

---

## Expected Deliverables

1. Fully functional React app with infinite canvas
2. Interactive node-based AWS infrastructure visualization
3. Hierarchical bounding box grouping
4. Edge highlighting on node click
5. Pre-loaded 3-tier web architecture demo
6. Zoom/pan/minimap controls
7. Clean, professional UI matching provided mockups

---

**Note:** Since you mentioned "Refer to the attached pics for UI screen mockups" (Frame 2.png and others), ensure the developer reviews those images carefully to match the exact UI design, color scheme, spacing, and interaction patterns shown in your mockups. The edge highlighting behavior on Frame 2.png is a critical interaction to replicate.

---

This prompt provides comprehensive guidance for a developer to build your AWS infrastructure visualization application.


