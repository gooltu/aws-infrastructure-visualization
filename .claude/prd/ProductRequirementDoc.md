# Product Requirements Document: Terraform Infrastructure Visualizer

---

### Document Metadata

| Attribute | Details |
| :--- | :--- |
| **Product Name** | Terraform VS Code Extension |
| **Feature Name** | Infrastructure Visualizer (Live Graph) |
| **Version** | 1.0 |
| **Status** | 📝 Draft |
| **Target Persona** | Terraform Developers, DevOps Engineers, Cloud Architects |

---

## 1. Problem Statement
Terraform Infrastructure-as-Code (IaC) files often grow into thousands of lines of HCL (HashiCorp Configuration Language) across multiple modules.
*   **Cognitive Load:** New developers struggle to build a mental map of how resources connect (e.g., which Security Group is attached to which EC2 instance) just by reading code.
*   **Dependency Hell:** Debugging circular dependencies or implicit `depends_on` relationships is difficult without a visual representation.
*   **Context Switching:** Developers currently rely on external tools (online diagramming) or static `terraform graph` outputs (which produce messy DOT files) to visualize their stack, breaking their coding flow.

## 2. Goals & Objectives
*   **Reduce Onboarding Time:** Allow new developers to understand the infrastructure topology in seconds rather than hours.
*   **Enhance Navigation:** Provide a "GPS" for the code—clicking a resource in the visualizer takes the user to the exact line of code.
*   **Real-time Feedback:** Visualize changes as they are typed, preventing architectural errors before `terraform plan` is even run.

## 3. User Persona
**Alex, the Terraform Developer.**
*   **Background:** Writes and maintains infrastructure for AWS/Azure/GCP.
*   **Pain Point:** Often inherits legacy codebases with poor documentation. Spends too much time `grep`-ing for resource names to find connections.
*   **Needs:** A way to see the "Big Picture" while editing specific resources.

## 4. Use Cases (User Stories)

### UC1: The "New Hire" Onboarding
*   **Scenario:** Alex joins a new team and pulls the `main` branch. The repository has 50+ files and 10 modules.
*   **Action:** Alex opens the root `main.tf` and clicks "Open Infrastructure Graph."
*   **Outcome:** A visual map appears, showing the hierarchy of modules (VPC -> Subnets -> Compute). Alex immediately understands the architecture without reading 5,000 lines of HCL.

### UC2: Debugging Dependencies
*   **Scenario:** Alex is getting a cycle error during `terraform plan` but can't find where the loop is in the code.
*   **Action:** Alex looks at the visualizer.
*   **Outcome:** The visualizer highlights dependency lines in red. Alex sees that `Resource A` references `Resource B`, which implicitly references `Resource A` via a variable.

### UC3: Navigating Large Monoliths
*   **Scenario:** Alex needs to change the instance size of a specific database in a single file containing 500 resources.
*   **Action:** Alex spots the Database icon in the visualizer and clicks it.
*   **Outcome:** The VS Code editor pane automatically scrolls to the specific resource block definition for that database.

### UC4: Impact Analysis (Refactoring)
*   **Scenario:** Alex plans to delete a Security Group.
*   **Action:** Alex selects the Security Group node in the graph.
*   **Outcome:** The graph highlights all incoming edges (resources using this SG). Alex realizes an RDS instance depends on it and aborts the deletion.

---

## 5. Functional Requirements

### 5.1 Visualization Engine
*   **FR-01:** The extension must render a Node-Link diagram within a VS Code WebView panel.
*   **FR-02:** Nodes must represent Terraform Resources (e.g., `aws_instance`), Modules, and Data Sources.
*   **FR-03:** Edges (lines) must represent dependencies (explicit `depends_on` and implicit attribute references).
*   **FR-04:** The graph must support grouping (e.g., resources inside a `module` block should be visually clustered).

### 5.2 Real-time Parsing
*   **FR-05:** The visualizer must parse local HCL files using the HCL Language Server. It should **not** require a valid `terraform init` or state file to render the initial graph (static analysis).
*   **FR-06:** The graph must update automatically when the file is saved (or debounced on typing).

### 5.3 Interactivity & Navigation
*   **FR-07 Bi-directional Sync (Graph to Code):** Clicking a node in the graph must scroll the text editor to the resource definition.
*   **FR-08 Bi-directional Sync (Code to Graph):** Placing the cursor inside a resource block in the code must highlight the corresponding node in the graph.
*   **FR-09:** Users must be able to Pan and Zoom the graph canvas.

### 5.4 Iconography & Aesthetics
*   **FR-10:** The visualizer should detect the provider (AWS, Azure, GCP, Kubernetes) and use official architecture icons for the nodes.
*   **FR-11:** If the provider is unknown, generic geometric shapes will be used.

### 5.5 Filtering
*   **FR-12:** Users must be able to filter the view (e.g., "Show only Resources," "Show only Modules," or "Hide Data Sources").

---

## 6. Non-Functional Requirements
*   **Performance:** Must be able to render a graph of 500+ nodes in under 2 seconds.
*   **Security:** Parsing and rendering must happen entirely locally. No code or topology data is sent to any external server.
*   **Compatibility:** Must support HCL 2.0 syntax.
*   **Offline Mode:** The feature must work without an internet connection (icons should be bundled or cached).

---

## 7. UI/UX Guidelines
*   **Location:** Access via the Editor Title Menu (icon: `graph-line`) or Command Palette (`Terraform: Open Visualizer`).
*   **Layout:** Opens by default to the side (Split Editor), allowing code and graph to be viewed simultaneously.
*   **Color Palette:**
    *   Background: Match VS Code Theme (Dark/Light mode aware).
    *   Dependencies: Grey lines.
    *   Selected Node: High contrast border (e.g., Bright Blue).

---

## 8. Success Metrics (KPIs)
*   **Adoption Rate:** % of users who open the visualizer at least once per session.
*   **Retention:** % of users who keep the visualizer open for >5 minutes.
*   **Navigation Usage:** Number of times users click a node to jump to code (validates the "navigation" use case).

---

## 9. Future Scope (v2.0)
*   **State Integration:** Overlay `terraform.tfstate` data to show which resources are actually deployed vs. just defined in code.
*   **Cost Estimation:** Overlay estimated costs (via Infracost integration) on the nodes.
*   **Drift Detection:** Visually flag resources that have drifted from the state.
*   **Export:** Export graph as PNG/SVG for documentation.