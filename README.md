# Kanban Enterprise - Task and Workflow Manager

A high-contrast, production-ready Kanban Board engineered for software development teams. Built with a strict focus on Role-Based Access Control (RBAC), State Machine automation, and Data Integrity. 

Unlike standard drag-and-drop sticky note apps, this application enforces real-world workplace hierarchies, code-review pipelines, and strict approval checkpoints.

![UI Theme](https://img.shields.io/badge/UI_System-Neo--Brutalism-ffde59?style=flat-square&logo=css3&logoColor=black)
![State](https://img.shields.io/badge/Architecture-Controlled_State-4facfe?style=flat-square)
![Stack](https://img.shields.io/badge/Frontend-React_%2B_Vite-90ee90?style=flat-square&logo=react&logoColor=black)

## The Design System: Neo-Brutalism

This project actively rejects the soft, rounded, low-contrast corporate aesthetic in favor of Neo-Brutalism. 
* **High Legibility**: Pure pitch-black `#000000` hard borders (`4px solid black`).
* **Intentional Hierarchy**: High-saturation, color-coded status columns.
* **Tactile UX**: Sharp, non-blurred drop shadows (`6px 6px 0px #9d9d9d`) that make UI cards feel like physical, heavy index cards sitting on a desk.

## Key Features and Business Logic

### 1. Role-Based Access Control (RBAC)
The application dynamically re-routes the Document Object Model (DOM) and limits data access depending on the active user profile:

* **Employee Portal**:
  * **Scoped Identity**: Employees only view tasks explicitly assigned to their unique user stamp.
  * **Restricted Permissions**: Employees cannot self-assign tasks, cannot view peer boards, and the "Add New Task" controller is fully hidden from their view.
  * **Feedback Loop**: Kicked-back tasks automatically display the Administrator's rejection notes directly inside the task card.

* **Administrator Portal**:
  * **Dual-Mode Engine**: Admins can instantly toggle between Review Mode (a global filter catching all tasks awaiting approval across the company) and Employee View (inspecting a specific worker's desk).
  * **Master Dispatcher**: Full clearance to draft, assign, and distribute tasks to any employee sub-profile.
  * **The Gatekeeper**: Admins possess the sole authority to Approve code submissions or Decline them back to the employee with mandatory constructive feedback.

### 2. Automated State Machine (Task Pipeline)
Tasks are forbidden from jumping randomly; they follow a strict, controlled lifecycle:
1. **To-Do**: Created by Admin.
2. **In Progress**: Auto-triggered the exact keystroke an employee pastes a code or attachment link into the card.
3. **Under Review**: Triggered when the employee clicks "Submit for Admin Review". The draft link is locked into the master database.
4. **Approved**: Granted strictly via the Admin verification dashboard.

### 3. Safe Deletion Guardrails
To prevent accidental data loss or unauthorized scrubbing:
* **The Rule**: A task cannot be deleted while To-Do, In Progress, or Under Review. 
* **The Enforcement**: The DOM physically strips the Delete button from the UI entirely until the card arrives safely inside the Approved column.

## Technical Architecture

* **Strict Controlled Components**: Every HTML `<input>` is stripped of its native DOM storage and bound strictly to React's rendering cycle to prevent data loss during column-to-column re-renders.
* **Derived View State**: Master state (`tasks`) is decoupled from the view state (`displayedTasks`), allowing heavy multi-layered array filtering (`.filter()`, `.find()`, `.map()`) without mutating the master database.
* **Declarative Branching**: Built adhering to strict declarative if/else branching logic for clean code maintainability.

   
