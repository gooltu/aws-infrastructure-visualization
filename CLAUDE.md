# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # tsc type-check + vite production build
npm run preview   # serve the production build locally
npx tsc --noEmit  # type-check only, no emit
```

There is no test suite. Use Playwright (already a devDependency) to visually verify changes:

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

## Architecture

The app is a single-page React + React Flow canvas — no routing, no backend, no state management library.

**Data flow:** `src/data/threeTierArchitecture.ts` exports static `initialNodes` and `initialEdges` arrays → `InfrastructureGraph` loads them into React Flow's `useNodesState`/`useEdgesState` → two `useMemo` hooks derive `displayNodes` and `displayEdges` from the live state + `selectedNodeId` before passing to `<ReactFlow>`.

**Node system:** There are exactly two React Flow node types registered in `nodeTypes`:
- `awsGroup` → `GroupNode` — renders bounding boxes for `region | vpc | az | subnet`. Sizing is done via the node's `style.width/height`; children position themselves relative to the parent using `parentId` + `extent: 'parent'`.
- `awsResource` → `ResourceNode` — renders a colored icon card for `ec2 | rds | alb | s3 | lambda | cloudfront`. Has top + bottom `Handle`s. The `isSelected` flag is injected into node data by `InfrastructureGraph` (not stored in the source data) to drive the blue highlight border.

**Edge highlighting:** Clicking a node sets `selectedNodeId`. `displayEdges` (memoized) maps over edges: connected edges get blue stroke + `animated: true`; unconnected edges get faded opacity. Clicking the pane or the same node again clears the selection. The breadcrumb in `StatusBar` is computed from the node's `parentId` chain via `buildBreadcrumb`.

**Types:** `src/types/aws.ts` defines `GroupNodeData`, `ResourceNodeData`, and `AWSEdgeData`. Both node data interfaces include an index signature (`[key: string]: unknown`) required by React Flow's generic constraints.

## Adding a new resource type

1. Add the subtype literal to `ResourceSubtype` in `src/types/aws.ts`.
2. Add a config entry (colors + icon SVG) to `subtypeConfig` in `ResourceNode.tsx`.
3. Add the node to `initialNodes` in `threeTierArchitecture.ts` with `type: 'awsResource'` and the new subtype.

## Adding a new hierarchy level

Group nodes nest via `parentId`. Positions are relative to the parent. The parent must declare its dimensions in `style: { width, height }`. Children use `extent: 'parent'` to stay constrained. Insert the new group node into `initialNodes` before its children (React Flow renders in array order; earlier = lower z-index).
