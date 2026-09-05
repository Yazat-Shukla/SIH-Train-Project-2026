import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  /*
   * =========================================================
   * DYNAMIC TIME-BASED GREETING
   * =========================================================
   */

  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }


  /*
   * =========================================================
   * MAINTENANCE TASK DATA
   * =========================================================
   *
   * Current frontend demo data.
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
   * =========================================================
   * TODAY'S MAINTENANCE BLOCKS
   * =========================================================
   *
   * Same four blocks shown in the Schedule page.
   */

  const scheduleBlocks = [
    {
      blockId: "B12",
      taskId: "ENG-104",
      department: "Engineering",
      asset: "Track-12",
      corridor: "C01",
      start: "22:00",
      end: "23:30"
    },
    {
      blockId: "B13",
      taskId: "SNT-205",
      department: "S&T",
      asset: "Signal-21",
      corridor: "C01",
      start: "23:30",
      end: "01:00"
    },
    {
      blockId: "B14",
      taskId: "TRC-102",
      department: "Traction",
      asset: "OHE-45",
      corridor: "C02",
      start: "01:00",
      end: "02:00"
    },
    {
      blockId: "B15",
      taskId: "ENG-118",
      department: "Engineering",
      asset: "Track-08",
      corridor: "C03",
      start: "02:00",
      end: "02:45"
    }
  ];


  /*
   * =========================================================
   * CRITICAL TASKS
   * =========================================================
   */

  const criticalTasks = tasks.filter(
    (task) => task.risk === "CRITICAL"
  );

  const criticalCount = criticalTasks.length;


  /*
   * =========================================================
   * DYNAMIC ASSET AVAILABILITY
   * =========================================================
   *
   * In Progress -> Under Maintenance
   * Unavailable -> Unavailable
   * Remaining -> Available
   */

  const uniqueAssets = [
    ...new Set(
      tasks.map((task) => task.asset)
    )
  ];

  const totalAssets = uniqueAssets.length;


  const underMaintenanceAssets = [
    ...new Set(
      tasks
        .filter(
          (task) =>
            task.status === "In Progress"
        )
        .map((task) => task.asset)
    )
  ];


  const unavailableAssets = [
    ...new Set(
      tasks
        .filter(
          (task) =>
            task.status === "Unavailable"
        )
        .map((task) => task.asset)
    )
  ];


  const underMaintenance =
    underMaintenanceAssets.length;


  const unavailable =
    unavailableAssets.length;


  const available = Math.max(
    0,
    totalAssets -
      underMaintenance -
      unavailable
  );


  /*
   * =========================================================
   * AVAILABILITY BAR PERCENTAGES
   * =========================================================
   */

  const availablePercent =
    totalAssets > 0
      ? (available / totalAssets) * 100
      : 0;


  const maintenancePercent =
    totalAssets > 0
      ? (underMaintenance / totalAssets) * 100
      : 0;


  const unavailablePercent =
    totalAssets > 0
      ? (unavailable / totalAssets) * 100
      : 0;


  /*
   * =========================================================
   * DYNAMIC BLOCK COUNT
   * =========================================================
   */

  const blocksUsed = new Set(
    scheduleBlocks.map(
      (block) => block.blockId
    )
  ).size;


  /*
   * Demo total block capacity.
   * Later this will come from backend.
   */

  const totalBlockCapacity = 10;


  const availableBlocks = Math.max(
    0,
    totalBlockCapacity - blocksUsed
  );


  /*
   * =========================================================
   * CURRENT SCHEDULE CONFLICTS
   * =========================================================
   *
   * B12 -> 22:00 - 23:30
   * B13 -> 23:30 - 01:00
   * B14 -> 01:00 - 02:00
   * B15 -> 02:00 - 02:45
   *
   * No maintenance blocks overlap.
   */

  const conflicts = 0;


  return (
    <section className="content">

      {/* ================= WELCOME ================= */}

      <div className="welcome">

        <div>

          <h2>
            {greeting}, Planner 👋
          </h2>

          <p>
            Here&apos;s what&apos;s happening with today&apos;s
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
              Current task dataset
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


        {/* BLOCKS USED */}

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
              {availableBlocks} blocks available
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
                Today&apos;s Schedule
              </h2>

              <p>
                Maintenance blocks
              </p>

            </div>

          </div>


          <div className="schedule">


            {/* B12 - ENGINEERING */}

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


            {/* B13 - S&T */}

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
                  S&amp;T
                </strong>

                <span>
                  Signal inspection
                </span>

                <small>
                  Block B13 • C01
                </small>

              </div>

            </div>


            {/* B14 - TRACTION */}

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


            {/* B15 - ENGINEERING */}

            <div className="schedule-item">

              <div className="time">

                02:00

                <span>
                  02:45
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
                  Block B15 • C03
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


        {/* ================= ASSET AVAILABILITY ================= */}

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


            {/* AVAILABLE */}

            <div>

              <span>
                Available
              </span>

              <strong>
                {available}
              </strong>

              <div className="availability-bar">

                <div
                  className="available-fill"
                  style={{
                    width:
                      `${availablePercent}%`
                  }}
                />

              </div>

            </div>


            {/* UNDER MAINTENANCE */}

            <div>

              <span>
                Under Maintenance
              </span>

              <strong>
                {underMaintenance}
              </strong>

              <div className="availability-bar">

                <div
                  className="maintenance-fill"
                  style={{
                    width:
                      `${maintenancePercent}%`
                  }}
                />

              </div>

            </div>


            {/* UNAVAILABLE */}

            <div>

              <span>
                Unavailable
              </span>

              <strong>
                {unavailable}
              </strong>

              <div className="availability-bar">

                <div
                  className="unavailable-fill"
                  style={{
                    width:
                      `${unavailablePercent}%`
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= AI OPTIMIZATION ================= */}

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