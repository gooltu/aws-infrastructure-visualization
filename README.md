# AWS Infrastructure Visualizer

> **[🚀 Live Preview → aws-infrastructure-visualization.vercel.app](https://aws-infrastructure-visualization.vercel.app/)**

> **This is a VS Code Extension project.** It is designed to run from inside Visual Studio Code as a WebView panel alongside your Terraform files — not as a standalone web app. The Vercel link above is a live UI preview only.

A **VS Code Extension** that renders your Terraform (HCL) infrastructure as an interactive, Miro-style node diagram directly inside the editor. Open a `.tf` file, launch the visualizer from the Command Palette or Editor Title Menu, and see your AWS resources — VPCs, subnets, EC2, RDS, ALB, S3 — laid out as a navigable canvas with a built-in Terraform config explorer and Monaco code editor, all without leaving VS Code.

---

## Screenshots

| | |
|---|---|
| ![Screen1](.claude/Design/Screen1.png) | ![Screen2](.claude/Design/Screen2.png) |
| ![Screen3](.claude/Design/Screen3.png) | ![Screen4](.claude/Design/Screen4.png) |
| ![Screen5](.claude/Design/Screen5.png) | ![Screen6](.claude/Design/Screen6.png) |
| ![Screen7](.claude/Design/Screen7.png) | ![Screen8](.claude/Design/Screen8.png) |
| ![Screen9](.claude/Design/Screen9.png) | ![Screen10](.claude/Design/Screen10.png) |
| ![Screen11](.claude/Design/Screen11.png) | ![Screen12](.claude/Design/Screen12.png) |
| ![Screen13](.claude/Design/Screen13.png) | |

---

## Problem Statement

Terraform Infrastructure-as-Code files often grow into thousands of lines of HCL across multiple modules.

- **Cognitive Load** — New developers struggle to build a mental map of how resources connect just by reading code.
- **Dependency Hell** — Debugging circular dependencies or implicit `depends_on` relationships is difficult without a visual representation.
- **Context Switching** — Developers rely on external tools or messy `terraform graph` DOT outputs, breaking their coding flow.

---

## Features

- **Infinite canvas** — Miro-style pan, zoom, and dot-grid background powered by React Flow
- **Hierarchical bounding boxes** — Region → VPC → Availability Zone → Subnet → Resources, all nested and labeled
- **AWS service icons** — EC2 (orange), RDS (blue), ALB (purple), S3 (green) with color-coded cards
- **Edge highlighting** — Click any node to highlight its connections in bright blue; all others fade. Click again or click the canvas to deselect
- **Breadcrumb navigation** — Status bar shows the full hierarchy path of the selected node (e.g. `us-east / main VPC / App ELB`)
- **Terraform config explorer** — Left panel with collapsible sections for Variables, Locals, Outputs, Providers, and Modules. Variables open by default with type badges and default values
- **Monaco code editor** — Right panel with full HCL syntax highlighting, pre-populated with a complete `main.tf` for the 3-tier architecture
- **3-tier architecture demo** — Pre-loaded with ALB → EC2 web tier → EC2 app tier → Aurora MySQL (read-write + read-only replicas) + S3, across two availability zones

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Graph engine | `@xyflow/react` (React Flow v12) |
| Code editor | `@monaco-editor/react` |
| Icons | `lucide-react` + inline SVG |
| Language | TypeScript (strict mode) |
| Styling | Inline styles, dark theme |
| Deploy | Vercel |

---

## Architecture

The app is a single-page React + React Flow canvas — no routing, no backend, no state management library.

**Data flow:** `src/data/threeTierArchitecture.ts` exports static `initialNodes` and `initialEdges` arrays → `InfrastructureGraph` loads them into React Flow's `useNodesState`/`useEdgesState` → two `useMemo` hooks derive `displayNodes` and `displayEdges` from the live state + `selectedNodeId` before passing to `<ReactFlow>`.

**Node system:** Two React Flow node types are registered:
- `awsGroup` → `GroupNode` — renders bounding boxes for `region | vpc | az | subnet`. Sizing via `style.width/height`; children position relative to parent using `parentId` + `extent: 'parent'`
- `awsResource` → `ResourceNode` — renders a colored icon card for `ec2 | rds | alb | s3 | lambda | cloudfront`. The `isSelected` flag is injected at render time (not stored in source data) to drive the blue highlight border

**Edge highlighting:** Clicking a node sets `selectedNodeId`. `displayEdges` maps over edges: connected edges get blue stroke + `animated: true`; unconnected edges get faded opacity. The breadcrumb in `StatusBar` walks the `parentId` chain via `buildBreadcrumb`.

**Layout:** Three-panel IDE layout — `LeftPanel` (260px, collapsible Terraform config) + ReactFlow canvas (flex-1) + `RightPanel` (400px, Monaco editor). `overflow: hidden` on the row gives Monaco a computable height via flex.

---

## Getting Started

> **Intended usage:** Install the extension in VS Code, open any Terraform project, and run `Terraform: Open Visualizer` from the Command Palette (`⇧⌘P`). The graph panel opens beside your editor automatically.

The Vercel deployment is a standalone UI preview for development and demonstration purposes. To work on the extension locally:

```bash
npm install
npm run dev        # dev server at localhost:5173 (UI preview)
npm run build      # tsc type-check + vite production build
npm run preview    # serve the production build locally
npx tsc --noEmit   # type-check only
```

### Visual verification (no test suite)

```bash
# dev server must be running first
node -e "
const { chromium } = require('./node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/screenshot.png' });
  await browser.close();
})();
"
```

### Adding a new resource type

1. Add the subtype literal to `ResourceSubtype` in `src/types/aws.ts`
2. Add a config entry (colors + icon SVG) to `subtypeConfig` in `src/components/nodes/ResourceNode.tsx`
3. Add the node to `initialNodes` in `src/data/threeTierArchitecture.ts` with `type: 'awsResource'`

### Adding a new hierarchy level

Group nodes nest via `parentId`. Positions are relative to the parent. The parent must declare its dimensions in `style: { width, height }`. Children use `extent: 'parent'` to stay constrained. Insert the new group node into `initialNodes` before its children (React Flow renders in array order; earlier = lower z-index).

---

## Use Cases

### New Hire Onboarding
Alex joins a new team with 50+ Terraform files. Opening the visualizer immediately shows the hierarchy of modules (VPC → Subnets → Compute) — the architecture understood in seconds, not hours of HCL reading.

### Debugging Dependencies
Alex gets a cycle error during `terraform plan`. Selecting the suspect resource highlights all its edges, making circular references immediately visible.

### Impact Analysis
Alex plans to delete a Security Group. Clicking it in the graph highlights all incoming edges — revealing that an RDS instance depends on it before any destructive action is taken.

### Navigating Large Monoliths
In a 500-resource file, Alex clicks a database node. The editor jumps to the exact resource block definition.

---

## Roadmap (v2.0)

- **State Integration** — Overlay `terraform.tfstate` to show deployed vs. code-defined resources
- **Cost Estimation** — Infracost integration showing estimated costs on nodes
- **Drift Detection** — Visual flagging of resources that have drifted from state
- **Bi-directional Sync** — Clicking a node scrolls the editor to the resource definition; cursor placement in code highlights the node
- **Real-time Parsing** — Update the graph on save as HCL is edited
- **Export** — Save graph as PNG/SVG for documentation

---

## Design

Full design screens are documented in [`.claude/Design/design.md`](.claude/Design/design.md).
