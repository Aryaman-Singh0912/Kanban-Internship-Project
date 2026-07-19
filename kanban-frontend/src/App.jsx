import './App.css';
import Card from './components/Card.jsx';
import Column from './components/Column.jsx';
import Login from './components/Login.jsx';
import { useState, useEffect } from 'react';
import api from './api/axiosInstance';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [adminMode, setAdminMode] = useState("Review");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDescription] = useState("");
  const [adminViewFilter, setAdminViewFilter] = useState("All");

  const currentUserRole = currentUser?.role === 'admin' ? 'Admin' : 'Employee';

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }
    api.get('/me')
      .then((response) => setCurrentUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
  }, [token]);

  useEffect(() => {
    if (!currentUser) return;
    api.get('/tasks/')
      .then((response) => setTasks(response.data))
      .catch((err) => console.error('Failed to load tasks', err));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setUsers([]);
      return;
    }
    api.get('/users')
      .then((response) => setUsers(response.data))
      .catch((err) => console.error('Failed to load users', err));
  }, [currentUser]);

  const getAssigneeEmail = (assigneeId) => {
    if (currentUser?.role !== 'admin') return currentUser?.email || '';
    const match = users.find((u) => u.id === assigneeId);
    return match ? match.email : `User #${assigneeId}`;
  };

  const handleLogin = async (email, password) => {
    setAuthError(null);
    setAuthLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);
    } catch (err) {
      setAuthError('Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setTasks([]);
    setUsers([]);
  };

  const isReviewQueue = currentUserRole === 'Admin' && adminMode === 'Review';

  let displayedTasks = tasks;

  if (currentUserRole === 'Admin') {
    if (adminMode === "Review") {
      displayedTasks = tasks.filter((task) => task.status === "Under Review");
    } else if (adminMode === "EmployeeBoard") {
      displayedTasks = adminViewFilter === "All"
        ? tasks
        : tasks.filter((task) => task.assignee_id === adminViewFilter);
    }
  }

  const handleAddTask = async () => {
    if (newTaskTitle === "") return;
    if (adminViewFilter === "All") return;

    try {
      const response = await api.post('/tasks/', {
        title: newTaskTitle,
        description: newTaskDesc,
        assignee_id: adminViewFilter,
        status: "To-Do"
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (err) {
      alert('Could not create task.');
    }
  };

  const deleteTask = async (deletedTaskId) => {
    const taskFind = tasks.find((task) => task.id === deletedTaskId);
    if (!taskFind) return;

    if (taskFind.status !== "Approved") {
      alert('You can only delete tasks approved by an admin.');
      return;
    }

    try {
      await api.delete(`/tasks/${deletedTaskId}`);
      setTasks(tasks.filter((task) => task.id !== deletedTaskId));
    } catch (err) {
      alert('Could not delete task.');
    }
  };

  const handleAddAttachment = async (taskId, newAttachmentText) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus = task.status;
    if (task.status === "To-Do") newStatus = "In Progress";
    else if (task.status === "In Progress") newStatus = "Under Review";

    try {
      const response = await api.patch(`/tasks/${taskId}`, {
        attachment_url: newAttachmentText,
        status: newStatus
      });
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (err) {
      alert('Could not save attachment.');
    }
  };

  const approveTask = async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/approve`);
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (err) {
      alert('Could not approve task.');
    }
  };

  const declineTask = async (taskId, note) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/decline`, { feedback: note });
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (err) {
      alert('Could not decline task.');
    }
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

  if (currentUserRole === 'Admin' && adminMode === 'EmployeeBoard') {
    topDropdown = (
      <select
        className="employee-select"
        value={adminViewFilter}
        onChange={(e) => setAdminViewFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
      >
        <option value="All">All</option>
        {users.filter((u) => u.role === 'employee').map((u) => (
          <option key={u.id} value={u.id}>{u.email}</option>
        ))}
      </select>
    );
  }

  let headerControlsMarkup = null;

  if (currentUserRole === 'Employee') {
    headerControlsMarkup = <h2>{`Welcome, ${currentUser?.email}!`}</h2>;
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

  if (!token) {
    return <Login onLogin={handleLogin} error={authError} loading={authLoading} />;
  }

  return (
    <div className="app-container">

      <header className="app-header">
        <h1>Kanban</h1>
        <span className="assignee-badge">{currentUser?.email}</span>
        <button className="btn header-btn btn-employee" onClick={handleLogout}>Logout</button>
        {topDropdown}
      </header>

      {headerControlsMarkup}

      <main className={isReviewQueue ? "board-layout review-layout" : "board-layout"}>

        {isReviewQueue ? (
          <Column title="For Review" variant="review" fullWidth>
            {displayedTasks.map((task) => (
              <Card key={task.id} title={task.title} description={task.description} id={task.id}
                status={task.status} onDelete={deleteTask} attachment={task.attachment_url}
                onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                isAdmin={currentUserRole === 'Admin'} assignee={getAssigneeEmail(task.assignee_id)} feedback={task.feedback} />
            ))}
          </Column>
        ) : (
          <>
            <Column title="To-Do" variant="todo">
              {displayedTasks.filter((task) => task.status === 'To-Do').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachment_url}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={getAssigneeEmail(task.assignee_id)} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="In Progress" variant="progress">
              {displayedTasks.filter((task) => task.status === 'In Progress').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachment_url}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={getAssigneeEmail(task.assignee_id)} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="Under Review" variant="review">
              {displayedTasks.filter((task) => task.status === 'Under Review').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachment_url}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={getAssigneeEmail(task.assignee_id)} feedback={task.feedback} />
              ))}
            </Column>

            <Column title="Approved" variant="approved">
              {displayedTasks.filter((task) => task.status === 'Approved').map((task) => (
                <Card key={task.id} title={task.title} description={task.description} id={task.id}
                  status={task.status} onDelete={deleteTask} attachment={task.attachment_url}
                  onAddAttachment={handleAddAttachment} onApprove={approveTask} onDecline={declineTask}
                  isAdmin={currentUserRole === 'Admin'} assignee={getAssigneeEmail(task.assignee_id)} feedback={task.feedback} />
              ))}
            </Column>
          </>
        )}

      </main>

    </div>
  );
}

export default App;