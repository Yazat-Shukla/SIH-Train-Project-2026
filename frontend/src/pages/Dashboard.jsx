import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  /*
   * Demo maintenance data.
   * Later this will come from FastAPI /tasks API.
   */

  const tasks = [
    {
      id: "ENG-104",
      department: "Engineering",
      asset: "Track-12",
      priority: 94,
      risk: "CRITICAL",
      duration: "120 min",
      status: "Pending"
    },
    {
      id: "SNT-205",
      department: "S&T",
      asset: "Signal-21",
      priority: 87,
      risk: "HIGH",
      duration: "90 min",
      status: "Pending"
    },
    {
      id: "TRC-102",
      department: "Traction",
      asset: "OHE-45",
      priority: 73,
      risk: "HIGH",
      duration: "60 min",
      status: "In Progress"
    },
    {
      id: "ENG-118",
      department: "Engineering",
      asset: "Track-08",
      priority: 61,
      risk: "MEDIUM",
      duration: "45 min",
      status: "Pending"
    }
  ];

  /*
   * Only CRITICAL tasks should appear
   * under "Critical Maintenance Tasks".
   */

  const criticalTasks = tasks.filter(
    (task) => task.risk === "CRITICAL"
  );

  const criticalCount = criticalTasks.length;

  /*
   * Demo operational values.
   * Later these will come from backend.
   */

  const totalAssets = 94;

  const blocksUsed = 8;
  const availableBlocks = 10;

  const conflicts = 2;

  return (
    <section className="content">

      {/* ================= WELCOME ================= */}

      <div className="welcome">

        <div>

          <h2>
            Good evening, Planner 👋
          </h2>

          <p>
            Here's what's happening with today's
            railway maintenance.
          </p>

        </div>

        <button
          className="generate-btn"
          onClick={() =>
            navigate("/schedule")
          }
        >
          ⚡ Generate Schedule
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div className="stats-grid">

        {/* TOTAL ASSETS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            🚆
          </div>

          <div className="stat-info">

            <span>
              Total Assets
            </span>

            <h3>
              {totalAssets}
            </h3>

            <small>
              ↑ 4.2% from last week
            </small>

          </div>

        </div>

        {/* CRITICAL TASKS */}

        <div className="stat-card">

          <div className="stat-icon red">
            ⚠
          </div>

          <div className="stat-info">

            <span>
              Critical Tasks
            </span>

            <h3>
              {criticalCount}
            </h3>

            <small>
              {criticalCount > 0
                ? `${criticalCount} require immediate action`
                : "No critical tasks"}
            </small>

          </div>

        </div>

        {/* BLOCKS */}

        <div className="stat-card">

          <div className="stat-icon purple">
            🚧
          </div>

          <div className="stat-info">

            <span>
              Blocks Used
            </span>

            <h3>
              {blocksUsed}
            </h3>

            <small>
              {availableBlocks -
                blocksUsed}{" "}
              blocks available
            </small>

          </div>

        </div>

        {/* CONFLICTS */}

        <div className="stat-card">

          <div className="stat-icon orange">
            ⚡
          </div>

          <div className="stat-info">

            <span>
              Conflicts
            </span>

            <h3>
              {conflicts}
            </h3>

            <small>
              {conflicts > 0
                ? "Need planner review"
                : "No conflicts detected"}
            </small>

          </div>

        </div>

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-grid">

        {/* ================= CRITICAL TASKS ================= */}

        <div className="panel tasks-panel">

          <div className="panel-header">

            <div>

              <h2>
                Critical Maintenance Tasks
              </h2>

              <p>
                Highest priority work requiring
                attention
              </p>

            </div>

            <button
              className="view-btn"
              onClick={() =>
                navigate("/maintenance")
              }
            >
              View All →
            </button>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Task ID
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Asset
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Risk
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {criticalTasks.length > 0 ? (

                  criticalTasks.map(
                    (task) => (

                      <tr
                        key={task.id}
                      >

                        <td>
                          <strong>
                            {task.id}
                          </strong>
                        </td>

                        <td>
                          {task.department}
                        </td>

                        <td>
                          {task.asset}
                        </td>

                        <td>

                          <div className="priority">

                            <div className="priority-bar">

                              <div
                                className="priority-fill"
                                style={{
                                  width:
                                    `${task.priority}%`
                                }}
                              />

                            </div>

                            <span>
                              {task.priority}
                            </span>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`risk ${task.risk.toLowerCase()}`}
                          >
                            {task.risk}
                          </span>

                        </td>

                        <td>
                          {task.duration}
                        </td>

                        <td>

                          <span
                            className={`task-status ${
                              task.status ===
                              "In Progress"
                                ? "progress"
                                : ""
                            }`}
                          >
                            {task.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px"
                      }}
                    >
                      No critical maintenance
                      tasks found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ================= TODAY'S SCHEDULE ================= */}

        <div className="panel schedule-panel">

          <div className="panel-header">

            <div>

              <h2>
                Today's Schedule
              </h2>

              <p>
                Maintenance blocks
              </p>

            </div>

          </div>

          <div className="schedule">

            {/* ENGINEERING */}

            <div className="schedule-item">

              <div className="time">

                22:00

                <span>
                  23:30
                </span>

              </div>

              <div className="schedule-line blue-line" />

              <div className="schedule-info">

                <strong>
                  Engineering
                </strong>

                <span>
                  Track maintenance
                </span>

                <small>
                  Block B12 • C01
                </small>

              </div>

            </div>

            {/* S&T */}

            <div className="schedule-item">

              <div className="time">

                23:30

                <span>
                  01:00
                </span>

              </div>

              <div className="schedule-line purple-line" />

              <div className="schedule-info">

                <strong>
                  S&T
                </strong>

                <span>
                  Signal inspection
                </span>

                <small>
                  Block B13 • C01
                </small>

              </div>

            </div>

            {/* TRACTION */}

            <div className="schedule-item">

              <div className="time">

                01:00

                <span>
                  02:00
                </span>

              </div>

              <div className="schedule-line orange-line" />

              <div className="schedule-info">

                <strong>
                  Traction
                </strong>

                <span>
                  OHE maintenance
                </span>

                <small>
                  Block B14 • C02
                </small>

              </div>

            </div>

          </div>

          <button
            className="schedule-btn"
            onClick={() =>
              navigate("/block-planner")
            }
          >
            Open Block Planner →
          </button>

        </div>

      </div>

      {/* ================= BOTTOM GRID ================= */}

      <div className="bottom-grid">

        {/* ASSET AVAILABILITY */}

        <div className="panel availability-panel">

          <div className="panel-header">

            <div>

              <h2>
                Asset Availability
              </h2>

              <p>
                Current railway asset status
              </p>

            </div>

          </div>

          <div className="availability">

            <div>

              <span>
                Available
              </span>

              <strong>
                78
              </strong>

              <div className="availability-bar">

                <div
                  className="available-fill"
                />

              </div>

            </div>

            <div>

              <span>
                Under Maintenance
              </span>

              <strong>
                11
              </strong>

              <div className="availability-bar">

                <div
                  className="maintenance-fill"
                />

              </div>

            </div>

            <div>

              <span>
                Unavailable
              </span>

              <strong>
                5
              </strong>

              <div className="availability-bar">

                <div
                  className="unavailable-fill"
                />

              </div>

            </div>

          </div>

        </div>

        {/* AI OPTIMIZATION */}

        <div className="panel optimization-panel">

          <div className="optimization-icon">
            🤖
          </div>

          <div>

            <h2>
              AI Optimization
            </h2>

            <p>
              Schedule generated using priority
              scoring and constraint-based
              optimization.
            </p>

            <button
              onClick={() =>
                navigate("/analytics")
              }
            >
              View Optimization →
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Dashboard;