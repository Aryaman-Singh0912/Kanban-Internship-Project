import './App.css';
import Card from './components/Card.jsx';
import Column from './components/Column.jsx';
import { useState } from 'react';

function App() {
  const initialTasks = [
    { id: 1, title: "Design Database", description: "Create the PostgreSQL schema.", status: "To-Do", assignee: "Employee A", attachmentUrl: "" },
    { id: 2, title: "Setup Vite", description: "Initialize the React frontend.", status: "To-Do", assignee: "Employee B", attachmentUrl: "" },
    { id: 3, title: "Write CSS", description: "Style the board with high contrast.", status: "In Progress", assignee: "Employee C", attachmentUrl: "" },
    { id: 4, title: "Read Project Brief", description: "Understand the requirements.", status: "Approved", assignee: "Employee D", attachmentUrl: "" },
    { id: 5, title: "Meeting Client", description: "Meet with the latest client", status: "To-Do", assignee: "Employee A", attachmentUrl: "" },
    { id: 6, title: "Fix Backend", description: "Understand the Backend.", status: "Under Review", assignee: "Employee B", attachmentUrl: "" }
  ];

  const [adminMode, setAdminMode] = useState("Review");
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDescription] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("Employee");
  const [viewingEmployee, setViewingEmployee] = useState("Employee A");

  let displayedTasks = tasks;

  if (currentUserRole === 'Employee') {
    displayedTasks = tasks.filter((task) => task.assignee === viewingEmployee);
  } else {
    if (adminMode === "Review") {
      displayedTasks = tasks.filter((task) => task.status === "Under Review");
    } else if (adminMode === "EmployeeBoard") {
      displayedTasks = tasks.filter((task) => task.assignee === viewingEmployee);
    }
  }

  function handleAddTask() {
    if (newTaskTitle === "") return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      status: "To-Do",
      assignee: viewingEmployee,
      attachmentUrl: ""
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

      return { ...task, attachmentUrl: newAttachmentText, status: newStatus };
    }));
  };

  const approveTask = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, status: "Approved" } : task
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

  let dropDown = null;
  if (currentUserRole === 'Admin' && adminMode === 'EmployeeBoard') {
    dropDown = (
      <select className="employee-select" value={viewingEmployee} onChange={(event) => setViewingEmployee(event.target.value)}>
        <option value="Employee A">Employee A</option>
        <option value="Employee B">Employee B</option>
        <option value="Employee C">Employee C</option>
      </select>
    );
  }

  let headerControlsMarkup = null;

  if (currentUserRole === 'Employee') {
    headerControlsMarkup = <h2>{`Welcome, ${viewingEmployee}!`}</h2>;
  } else if (currentUserRole === 'Admin') {
    let adminExtraControls = null;
    if (adminMode === "EmployeeBoard") {
      adminExtraControls = addContainerMarkup;
    }
    headerControlsMarkup = (
      <div>
        <button className="btn btn-toggle" onClick={() => setAdminMode(adminMode === 'Review' ? 'EmployeeBoard' : 'Review')}>
          Toggle Mode
        </button>
        {adminExtraControls}
      </div>
    );
  }

  return (
    <div className="app-container">

      <header className="app-header">
        <h1>Kanban</h1>
        <button className="btn header-btn btn-admin" onClick={() => setCurrentUserRole("Admin")}>Login as Admin</button>
        <button className="btn header-btn btn-employee" onClick={() => setCurrentUserRole("Employee")}>Login as Employee</button>
        {dropDown}
      </header>

      {headerControlsMarkup}

      <main className="board-layout">

        <Column title="To-Do">
          {displayedTasks.filter((task) => task.status === 'To-Do').map((task) => (
            <Card key={task.id} title={task.title} description={task.description} id={task.id}
              status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
              onAddAttachment={handleAddAttachment} onApprove={approveTask} />
          ))}
        </Column>

        <Column title="In Progress">
          {displayedTasks.filter((task) => task.status === 'In Progress').map((task) => (
            <Card key={task.id} title={task.title} description={task.description} id={task.id}
              status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
              onAddAttachment={handleAddAttachment} onApprove={approveTask} />
          ))}
        </Column>

        <Column title="Under Review">
          {displayedTasks.filter((task) => task.status === 'Under Review').map((task) => (
            <Card key={task.id} title={task.title} description={task.description} id={task.id}
              status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
              onAddAttachment={handleAddAttachment} onApprove={approveTask} />
          ))}
        </Column>

        <Column title="Approved">
          {displayedTasks.filter((task) => task.status === 'Approved').map((task) => (
            <Card key={task.id} title={task.title} description={task.description} id={task.id}
              status={task.status} onDelete={deleteTask} attachment={task.attachmentUrl}
              onAddAttachment={handleAddAttachment} onApprove={approveTask} />
          ))}
        </Column>

      </main>

    </div>
  );
}

export default App;