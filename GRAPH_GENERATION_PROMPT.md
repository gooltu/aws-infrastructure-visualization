You are an expert JavaScript/TypeScript developer specializing in infrastructure-as-code visualization and graph theory. 

I want to build a complete Node.js / React utility pipeline that parses a standard Terraform Plan JSON file (`tfplan.json`), builds a custom graph representation containing resources, relationships (edges), and modules (node groups), layouts it using `elkjs`, and formats it for rendering inside a React Flow canvas.

Please write a complete, clean, and highly robust implementation spanning the following 4 distinct steps:

---

### Step 1: Parse tfplan.json and Map to a Custom CompoundGraph Class
- Use a custom `CompoundGraph` class using JavaScript `Map` and `Set` collections to handle custom resource additions.
- Parse the `planned_values.root_module` block of a standard `tfplan.json`.
- **Node Groups**: Extract nested modules (e.g., `module.vpc`, `module.db`) and treat them as Group containers. Handle deeply nested sub-modules gracefully (e.g., `module.vpc.module.subnet`).
- **Nodes**: Extract individual resources (e.g., `aws_instance.web`, `aws_security_group.allow_tls`) as child nodes belonging to their respective module group (or the root module if top-level). Store resource attributes like `type`, `name`, and `provider_name` inside the node's metadata.
- **Edges**: Parse the `configuration.root_module` block (specifically looking at `expressions` or the `depends_on` array fields) to establish connections and edges between resource IDs.

---

### Step 2: Transform the Custom Graph into ELK JSON Format
- Write a transformation function `exportToELK(customGraph)` that converts the memory graph into a strict ELK JSON schema.
- Map Terraform modules to nested ELK nodes containing a `children` array and configure them with `"elk.algorithm": "layered"`.
- Inject mandatory layout options into the root configuration to ensure complex cloud architectures look clean:
  - `"elk.algorithm": "layered"`
  - `"elk.direction": "RIGHT"`
  - `"elk.hierarchyHandling": "INCLUDE_CHILDREN"`
  - `"elk.spacing.nodeNode": "60"`
  - `"elk.padding": "[top=40,left=40,bottom=40,right=40]"`
- Set fixed default dimensions for resource nodes so ELK can perform accurate math calculations. Use the same dimensions as we are currently doing in the project to render resource nodes and groups. Also create a configuration file where I can tweek the render properties.

---

### Step 3: Run Layout Calculations with elkjs
- Write an asynchronous execution function that passes the generated ELK graph into the `elkjs` library engine via `elk.layout(elkGraph)`.
- The output should contain updated root and relative child/nested nodes filled out with calculated structural coordinate positions (`x`, `y`) and bounding box dimensions (`width`, `height`).

---

### Step 4: Convert ELK Layout Output into React Flow Payload
- Write a final data parser function `convertToReactFlow(layoutedElkGraph)` that flattens the nested ELK hierarchy into a split structure containing a flat `nodes` array and a flat `edges` array.
- **React Flow Groups**: Transform nested ELK module containers into React Flow nodes with `type: 'group'`, passing along computed `width` and `height` dimensions into their `style` property.
- **React Flow Nodes**: Flatten child resource nodes. For any node nested inside a group, compute its absolute positioning correctly or apply `parentId: groupId` alongside `extent: 'parent'`, adjusting child coordinates to be relative to their parent boundaries.
- **React Flow Edges**: Cleanly export all edge mappings with unique IDs pointing to their respective string target and source attributes.

---

### Implementation Requirements
1. Provide the code in clean, modular modern typescript/javascript.
2. Provide a mock wrapper example simulating how a raw `tfplan.json` extract feeds into the execution wrapper, triggers the layout engine, and returns the finished React Flow configurations.
3. Keep the pipeline functions separated cleanly so each step can be unit tested independently.
