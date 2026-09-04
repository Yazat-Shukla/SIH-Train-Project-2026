import { useState } from "react";
import "../App.css";

function Maintenance() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [risk, setRisk] = useState("All Risk Levels");
  const [status, setStatus] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: "ENG-104",
      department: "Engineering",
      asset: "Track-12",
      location: "Delhi - C01",
      priority: 94,
      risk: "CRITICAL",
      duration: "120 min",
      status: "Pending"
    },
    {
      id: "SNT-205",
      department: "S&T",
      asset: "Signal-21",
      location: "Delhi - C01",
      priority: 87,
      risk: "HIGH",
      duration: "90 min",
      status: "Pending"
    },
    {
      id: "TRC-102",
      department: "Traction",
      asset: "OHE-45",
      location: "Delhi - C02",
      priority: 73,
      risk: "HIGH",
      duration: "60 min",
      status: "In Progress"
    },
    {
      id: "ENG-118",
      department: "Engineering",
      asset: "Track-08",
      location: "Delhi - C03",
      priority: 61,
      risk: "MEDIUM",
      duration: "45 min",
      status: "Pending"
    },
    {
      id: "SNT-214",
      department: "S&T",
      asset: "Signal-18",
      location: "Delhi - C02",
      priority: 48,
      risk: "MEDIUM",
      duration: "60 min",
      status: "Scheduled"
    }
  ]);

  const [newTask, setNewTask] = useState({
    id: "",
    department: "Engineering",
    asset: "",
    location: "",
    priority: "",
    risk: "Medium",
    duration: "",
    status: "Pending"
  });

  const filteredTasks = tasks.filter((task) => {
    const text = search.toLowerCase();

    const matchesSearch =
      task.id.toLowerCase().includes(text) ||
      task.asset.toLowerCase().includes(text) ||
      task.department.toLowerCase().includes(text);

    const matchesDepartment =
      department === "All Departments" ||
      task.department === department;

    const matchesRisk =
      risk === "All Risk Levels" ||
      task.risk === risk.toUpperCase();

    const matchesStatus =
      status === "All Status" ||
      task.status === status;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesRisk &&
      matchesStatus
    );
  });

  const handleInputChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingTask(null);

    setNewTask({
      id: "",
      department: "Engineering",
      asset: "",
      location: "",
      priority: "",
      risk: "Medium",
      duration: "",
      status: "Pending"
    });

    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);

    setNewTask({
      id: task.id,
      department: task.department,
      asset: task.asset,
      location: task.location,
      priority: task.priority,
      risk: task.risk,
      duration: task.duration,
      status: task.status
    });

    setShowModal(true);
  };

  const saveTask = (e) => {
    e.preventDefault();

    if (
      !newTask.id ||
      !newTask.asset ||
      !newTask.location ||
      !newTask.priority ||
      !newTask.duration
    ) {
      alert("Please fill all fields");
      return;
    }

    const task = {
      ...newTask,
      priority: Number(newTask.priority),
      risk: newTask.risk.toUpperCase()
    };

    if (editingTask) {
      setTasks(
        tasks.map((item) =>
          item.id === editingTask.id ? task : item
        )
      );
    } else {
      setTasks([...tasks, task]);
    }

    setShowModal(false);
    setEditingTask(null);

    setNewTask({
      id: "",
      department: "Engineering",
      asset: "",
      location: "",
      priority: "",
      risk: "Medium",
      duration: "",
      status: "Pending"
    });
  };

  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };
  const exportData = () => {
  const headers = [
    "Task ID",
    "Department",
    "Asset",
    "Location",
    "Priority",
    "Risk",
    "Duration",
    "Status"
  ];

  const rows = filteredTasks.map((task) => [
    task.id,
    task.department,
    task.asset,
    task.location,
    task.priority,
    task.risk,
    task.duration,
    task.status
  ]);

  const csv = [
    headers,
    ...rows
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "maintenance_tasks.csv";

  link.click();

  URL.revokeObjectURL(url);
};

  const totalTasks = filteredTasks.length;

  const criticalTasks = filteredTasks.filter(
    (task) => task.risk === "CRITICAL"
  ).length;

  const highRiskTasks = filteredTasks.filter(
    (task) => task.risk === "HIGH"
  ).length;

  const pendingTasks = filteredTasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (
    <div className="page">

      <div className="page-heading">

        <div>
          <h1>Maintenance Tasks</h1>
          <p>
            Monitor and manage railway maintenance activities
          </p>
        </div>

        <button
          className="generate-btn"
          onClick={openAddModal}
        >
          + Add Maintenance Task
        </button>

      </div>

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search task, asset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option>All Departments</option>
          <option>Engineering</option>
          <option>S&T</option>
          <option>Traction</option>
        </select>

        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          <option>All Risk Levels</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Scheduled</option>
        </select>

      </div>

      <div className="maintenance-stats">

        <div>
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
        </div>

        <div>
          <span>Critical</span>
          <strong>{criticalTasks}</strong>
        </div>

        <div>
          <span>High Risk</span>
          <strong>{highRiskTasks}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>{pendingTasks}</strong>
        </div>

      </div>

      <div className="panel maintenance-panel">

        <div className="panel-header">

          <div>
            <h2>All Maintenance Tasks</h2>
            <p>
              Maintenance work requiring planning or action
            </p>
          </div>

          <button className="view-btn" onClick={exportData}>
            Export Data ↓
            </button>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Task ID</th>
                <th>Department</th>
                <th>Asset</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Risk</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTasks.length > 0 ? (

                filteredTasks.map((task) => (

                  <tr key={task.id}>

                    <td>
                      <strong>{task.id}</strong>
                    </td>

                    <td>{task.department}</td>

                    <td>{task.asset}</td>

                    <td>{task.location}</td>

                    <td>

                      <div className="priority">

                        <div className="priority-bar">

                          <div
                            className="priority-fill"
                            style={{
                              width: `${task.priority}%`
                            }}
                          ></div>

                        </div>

                        <span>{task.priority}</span>

                      </div>

                    </td>

                    <td>
                      <span
                        className={`risk ${task.risk.toLowerCase()}`}
                      >
                        {task.risk}
                      </span>
                    </td>

                    <td>{task.duration}</td>

                    <td>
                      <span className="task-status">
                        {task.status}
                      </span>
                    </td>

                    <td>

                      <div className="task-actions">

                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(task)}
                        >
                          ✏ Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="9" className="no-results">
                    No maintenance tasks found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>
                  {editingTask
                    ? "Edit Maintenance Task"
                    : "Add Maintenance Task"}
                </h2>

                <p>
                  {editingTask
                    ? "Update maintenance task details"
                    : "Create a new railway maintenance task"}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={saveTask}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Task ID</label>

                  <input
                    name="id"
                    value={newTask.id}
                    onChange={handleInputChange}
                    placeholder="ENG-120"
                    disabled={editingTask !== null}
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <select
                    name="department"
                    value={newTask.department}
                    onChange={handleInputChange}
                  >
                    <option>Engineering</option>
                    <option>S&T</option>
                    <option>Traction</option>
                  </select>

                </div>

                <div className="form-group">
                  <label>Asset</label>

                  <input
                    name="asset"
                    value={newTask.asset}
                    onChange={handleInputChange}
                    placeholder="Track-15"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>

                  <input
                    name="location"
                    value={newTask.location}
                    onChange={handleInputChange}
                    placeholder="Delhi - C01"
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    placeholder="80"
                  />
                </div>

                <div className="form-group">
                  <label>Risk</label>

                  <select
                    name="risk"
                    value={newTask.risk}
                    onChange={handleInputChange}
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration</label>

                  <input
                    name="duration"
                    value={newTask.duration}
                    onChange={handleInputChange}
                    placeholder="60 min"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Scheduled</option>
                  </select>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="generate-btn"
                >
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Maintenance;