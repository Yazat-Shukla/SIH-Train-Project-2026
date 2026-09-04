import { useState } from "react";
import "../App.css";

function Schedule() {
  const initialSchedule = [
    {
      time: "22:00 - 23:30",
      task: "ENG-104",
      department: "Engineering",
      asset: "Track-12",
      block: "B12",
      corridor: "C01",
      priority: 94,
      status: "Confirmed"
    },
    {
      time: "23:30 - 01:00",
      task: "SNT-205",
      department: "S&T",
      asset: "Signal-21",
      block: "B13",
      corridor: "C01",
      priority: 87,
      status: "Confirmed"
    },
    {
      time: "01:00 - 02:00",
      task: "TRC-102",
      department: "Traction",
      asset: "OHE-45",
      block: "B14",
      corridor: "C02",
      priority: 73,
      status: "In Progress"
    },
    {
      time: "02:00 - 02:45",
      task: "ENG-118",
      department: "Engineering",
      asset: "Track-08",
      block: "B15",
      corridor: "C03",
      priority: 61,
      status: "Scheduled"
    }
  ];

  const optimizedSchedule = [
    {
      time: "21:30 - 22:30",
      task: "TRC-102",
      department: "Traction",
      asset: "OHE-45",
      block: "B21",
      corridor: "C02",
      priority: 73,
      status: "Confirmed"
    },
    {
      time: "22:40 - 23:25",
      task: "ENG-118",
      department: "Engineering",
      asset: "Track-08",
      block: "B22",
      corridor: "C03",
      priority: 61,
      status: "Confirmed"
    },
    {
      time: "23:35 - 00:50",
      task: "ENG-104",
      department: "Engineering",
      asset: "Track-12",
      block: "B23",
      corridor: "C01",
      priority: 94,
      status: "Scheduled"
    },
    {
      time: "01:00 - 02:00",
      task: "SNT-205",
      department: "S&T",
      asset: "Signal-21",
      block: "B24",
      corridor: "C01",
      priority: 87,
      status: "Scheduled"
    },
    {
      time: "02:15 - 03:00",
      task: "ENG-125",
      department: "Engineering",
      asset: "Track-19",
      block: "B25",
      corridor: "C02",
      priority: 55,
      status: "Scheduled"
    }
  ];

  const [schedule, setSchedule] = useState(initialSchedule);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateSchedule = () => {
    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setSchedule(optimizedSchedule);
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const exportSchedule = () => {
    const headers = [
      "Time",
      "Task ID",
      "Department",
      "Asset",
      "Block",
      "Corridor",
      "Priority",
      "Status"
    ];

    const rows = schedule.map((item) => [
      item.time,
      item.task,
      item.department,
      item.asset,
      item.block,
      item.corridor,
      item.priority,
      item.status
    ]);

    const csv = [
      headers,
      ...rows
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance_schedule.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const totalScheduled = schedule.length;

  const confirmed = schedule.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const inProgress = schedule.filter(
    (item) => item.status === "In Progress"
  ).length;

  const conflicts = generated ? 0 : 2;

  return (
    <section className="content">

      <div className="page-heading">

        <div>
          <h1>Maintenance Schedule</h1>

          <p>
            View and manage the optimized railway maintenance schedule
          </p>
        </div>

        <div className="schedule-actions">

          <button
            className="view-btn"
            onClick={exportSchedule}
          >
            Export ↓
          </button>

          <button
            className="generate-btn"
            onClick={generateSchedule}
            disabled={generating}
          >
            {generating
              ? "⏳ Generating..."
              : generated
              ? "✓ Schedule Generated"
              : "⚡ Generate Schedule"}
          </button>

        </div>

      </div>

      <div className="schedule-filters">

        <div>
          <label>Date</label>

          <input
            type="date"
            defaultValue="2026-09-02"
          />
        </div>

        <div>
          <label>View</label>

          <select>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div>
          <label>Department</label>

          <select>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>S&T</option>
            <option>Traction</option>
          </select>
        </div>

        <div>
          <label>Corridor</label>

          <select>
            <option>All Corridors</option>
            <option>C01</option>
            <option>C02</option>
            <option>C03</option>
          </select>
        </div>

      </div>

      <div className="schedule-stats">

        <div>
          <span>Total Scheduled</span>
          <strong>{totalScheduled}</strong>
        </div>

        <div>
          <span>Confirmed</span>
          <strong>{confirmed}</strong>
        </div>

        <div>
          <span>In Progress</span>
          <strong>{inProgress}</strong>
        </div>

        <div>
          <span>Conflicts</span>
          <strong>{conflicts}</strong>
        </div>

      </div>

      <div className="panel schedule-table-panel">

        <div className="panel-header">

          <div>
            <h2>Today's Maintenance Schedule</h2>

            <p>
              Optimized schedule generated from maintenance priorities
              and railway constraints
            </p>
          </div>

          <span className="schedule-status">
            {generated
              ? "AI Optimized"
              : "Draft Schedule"}
          </span>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>TIME</th>
                <th>TASK ID</th>
                <th>DEPARTMENT</th>
                <th>ASSET</th>
                <th>BLOCK</th>
                <th>CORRIDOR</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>

              {schedule.map((item) => (

                <tr key={item.task}>

                  <td>
                    <strong>{item.time}</strong>
                  </td>

                  <td>
                    <strong>{item.task}</strong>
                  </td>

                  <td>{item.department}</td>

                  <td>{item.asset}</td>

                  <td>
                    <span className="block-badge">
                      {item.block}
                    </span>
                  </td>

                  <td>{item.corridor}</td>

                  <td>

                    <div className="priority">

                      <div className="priority-bar">

                        <div
                          className="priority-fill"
                          style={{
                            width: `${item.priority}%`
                          }}
                        ></div>

                      </div>

                      <span>{item.priority}</span>

                    </div>

                  </td>

                  <td>

                    <span
                      className={`schedule-badge ${
                        item.status
                          .toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <div className="schedule-info-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <h2>Optimization Summary</h2>

              <p>
                AI scheduling results
              </p>
            </div>

          </div>

          <div className="optimization-summary">

            <div>
              <span>Tasks Optimized</span>

              <strong>
                {generated ? "18" : "0"}
              </strong>
            </div>

            <div>
              <span>Blocks Used</span>

              <strong>
                {generated ? "8" : "0"}
              </strong>
            </div>

            <div>
              <span>Conflicts Avoided</span>

              <strong>
                {generated ? "14" : "0"}
              </strong>
            </div>

          </div>

        </div>

        <div className="panel schedule-warning">

          <h2>
            {generated
              ? "✓ Schedule Ready"
              : "⚠ Planner Attention"}
          </h2>

          <p>
            {generated
              ? "AI optimized the maintenance windows and removed the detected train conflicts."
              : "2 potential train conflicts require planner review before final schedule approval."}
          </p>

          <button className="view-btn">
            {generated
              ? "Review Schedule →"
              : "Review Conflicts →"}
          </button>

        </div>

      </div>

    </section>
  );
}

export default Schedule;