import './App.css';
import Card from './components/Card.jsx';
import Column from './components/Column.jsx';
import { useState } from 'react';

function App() {
  const initialTasks = [
    { id: 1, title: "Design Database", description: "Create the PostgreSQL schema.", status: "To-Do", assignee: "Employee A", attachmentUrl: "", feedback: "" },
    { id: 2, title: "Setup Vite", description: "Initialize the React frontend.", status: "To-Do", assignee: "Employee B", attachmentUrl: "", feedback: "" },
    { id: 3, title: "Write CSS", description: "Style the board with high contrast.", status: "In Progress", assignee: "Employee C", attachmentUrl: "", feedback: "" },
    { id: 4, title: "Read Project Brief", description: "Understand the requirements.", status: "Approved", assignee: "Employee D", attachmentUrl: "", feedback: "" },
    { id: 5, title: "Meeting Client", description: "Meet with the latest client", status: "To-Do", assignee: "Employee A", attachmentUrl: "", feedback: "" },
    { id: 6, title: "Fix Backend", description: "Understand the Backend.", status: "Under Review", assignee: "Employee B", attachmentUrl: "", feedback: "" }
  ];

  const [adminMode, setAdminMode] = useState("Review");
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDescription] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("Employee");
  const [employeeIdentity, setEmployeeIdentity] = useState("Employee A");
  const [adminViewFilter, setAdminViewFilter] = useState("Employee A");

  const isReviewQueue = currentUserRole === 'Admin' && adminMode === 'Review';

  let displayedTasks = tasks;

  if (currentUserRole === 'Employee') {
    displayedTasks = tasks.filter((task) => task.assignee === employeeIdentity);
  } else {
    if (adminMode === "Review") {
      displayedTasks = tasks.filter((task) => task.status === "Under Review");
    } else if (adminMode === "EmployeeBoard") {
      displayedTasks = adminViewFilter === "All"
        ? tasks
        : tasks.filter((task) => task.assignee === adminViewFilter);
    }
  }

  function handleAddTask() {
    if (newTaskTitle === "") return;
    if (currentUserRole === 'Admin' && adminMode === 'EmployeeBoard' && adminViewFilter === 'All') return;

    const assignee = currentUserRole === 'Admin' ? adminViewFilter : employeeIdentity;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: "To-Do",
      assignee: assignee,
      attachmentUrl: "",
      feedback: ""
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
  }

  const deleteTask = (deletedTaskId) => {
    const taskFind = tasks.find((task) => task.id === deletedTaskId);
    if (!taskFind) return;

    if (taskFind.status === "Approved") {
      setTasks(tasks.filter((task) => task.id !== deletedTaskId));
    } else {
      alert('You can only delete tasks approved by an admin.');
    }
  };

  const handleAddAttachment = (taskId, newAttachmentText) => {
    setTasks(tasks.map((task) => {
      if (task.id !== taskId) return task;

      let newStatus = task.status;
      if (task.status === "To-Do") newStatus = "In Progress";
      else if (task.status === "In Progress") newStatus = "Under Review";

      return { ...task, attachmentUrl: newAttachmentText, status: newStatus, feedback: "" };
    }));
  };

  const approveTask = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, status: "Approved" } : task
    ));
  };

  const declineTask = (taskId, note) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, status: "In Progress", feedback: note } : task
    ));
  };

  const addContainerMarkup = (
    <div className="add-task-container">
      <input
        type="text"
        placeholder="Add Task Title"
        className="task-input"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Add Task Description"
        className="task-input"
        value={newTaskDesc}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button className="add-button" onClick={handleAddTask}>Add Task</button>
    </div>
  );

  let topDropdown = null;

  if (currentUserRole === 'Employee') {
    topDropdown = (
      <select className="employee-select" value={employeeIdentity} onChange={(e) => setEmployeeIdentity(e.target.value)}>
        <option value="Employee A">Employee A</option>
        <option value="Employee B">Employee B</option>
        <option value="Employee C">Employee C</option>
      </select>
    );
  } else if (currentUserRole === 'Admin' && adminMode === 'EmployeeBoard') {
    topDropdown = (
      <select className="employee-select" value={adminViewFilter} onChange={(e) => setAdminViewFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Employee A">Employee A</option>
        <option value="Employee B">Employee B</option>
        <option value="Employee C">Employee C</option>
      </select>
    );
  }

  let headerControlsMarkup = null;

  if (currentUserRole === 'Employee') {
    headerControlsMarkup = <h2>{`Welcome, ${employeeIdentity}!`}</h2>;
  } else if (currentUserRole === 'Admin') {
    headerControlsMarkup = (
      <div className="admin-controls">
        <div className="mode-row">
          <button className="btn btn-toggle" onClick={() => setAdminMode(adminMode === 'Review' ? 'EmployeeBoard' : 'Review')}>
            Toggle Mode
          </button>
          <h2 className="mode-heading">
            {adminMode === 'Review' ? 'Mode: Review Queue' : 'Mode: Employee Board'}
          </h2>
        </div>

        {adminMode === 'EmployeeBoard' && adminViewFilter !== 'All' && addContainerMarkup}
        {adminMode === 'EmployeeBoard' && adminViewFilter === 'All' && (
          <p className="select-employee-hint">Pick an employee from the dropdown above to add a task for them.</p>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">

      <header className="app-header">
        <h1>Kanban</h1>
        <button
          className={`btn header-btn btn-admin ${currentUserRole === 'Admin' ? 'btn-active' : ''}`}
          onClick={() => setCurrentUserRole("Admin")}
        >
          Login as Admin
        </button>
        <button
          className={`btn header-btn btn-employee ${currentUserRole === 'Employee' ? 'btn-active' : ''}`}
          onClick={() => setCurrentUserRole("Employee")}
        >
          Login as Employee
        </button>
        {topDropdown}
      </header>

      {headerControlsMarkup}

      <main className={isReviewQueue ? "board-layout review-layout" : "board-layout"}>

        {isReviewQueue ? (
          <Column title="For Review" variant="review" fullWidth>
            {displayedTasks.map((task) => (
              <Card key={task.id} title={task.title} description={task.description} id={task.id}
                status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
                onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                isAdmin={currentUserRole === 'Admin'} assignee={task.assignee} feedback={task.feedback} />
            ))}
          </Column>
        ) : (
          <>
            <Column title="To-Do" variant="todo">
              {displayedTasks.filter((task) => task.status === 'To-Do').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={task.assignee} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="In Progress" variant="progress">
              {displayedTasks.filter((task) => task.status === 'In Progress').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={task.assignee} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="Under Review" variant="review">
              {displayedTasks.filter((task) => task.status === 'Under Review').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={task.assignee} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="Approved" variant="approved">
              {displayedTasks.filter((task) => task.status === 'Approved').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={task.assignee} feedback={task.feedback} />
              ))}
            </Column>
          </>
        )}

      </main>

    </div>
  );
}

export default App;