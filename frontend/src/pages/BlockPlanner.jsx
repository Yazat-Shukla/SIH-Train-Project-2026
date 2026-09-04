import { useState } from "react";
import "../App.css";

function BlockPlanner() {
  const allTasks = [
    {
      id: "ENG-104",
      department: "Engineering",
      start: "22:00",
      end: "23:30",
      block: "B12",
      corridor: "C01",
      priority: 94,
      color: "blue"
    },
    {
      id: "SNT-205",
      department: "S&T",
      start: "23:30",
      end: "01:00",
      block: "B13",
      corridor: "C01",
      priority: 87,
      color: "purple"
    },
    {
      id: "TRC-102",
      department: "Traction",
      start: "01:00",
      end: "02:00",
      block: "B14",
      corridor: "C02",
      priority: 73,
      color: "orange"
    },
    {
      id: "ENG-118",
      department: "Engineering",
      start: "02:00",
      end: "02:45",
      block: "B15",
      corridor: "C03",
      priority: 61,
      color: "blue"
    },
    {
      id: "SNT-214",
      department: "S&T",
      start: "02:45",
      end: "03:45",
      block: "B16",
      corridor: "C02",
      priority: 48,
      color: "purple"
    }
  ];

  const optimizedTasks = [
    {
      id: "ENG-104",
      department: "Engineering",
      start: "22:45",
      end: "00:15",
      block: "B21",
      corridor: "C01",
      priority: 94,
      color: "blue"
    },
    {
      id: "SNT-205",
      department: "S&T",
      start: "00:30",
      end: "02:00",
      block: "B22",
      corridor: "C01",
      priority: 87,
      color: "purple"
    },
    {
      id: "TRC-102",
      department: "Traction",
      start: "02:15",
      end: "03:15",
      block: "B23",
      corridor: "C02",
      priority: 73,
      color: "orange"
    },
    {
      id: "ENG-118",
      department: "Engineering",
      start: "03:20",
      end: "04:05",
      block: "B24",
      corridor: "C03",
      priority: 61,
      color: "blue"
    },
    {
      id: "SNT-214",
      department: "S&T",
      start: "04:10",
      end: "05:10",
      block: "B25",
      corridor: "C02",
      priority: 48,
      color: "purple"
    }
  ];

  const reOptimizedTasks = [
    {
      id: "ENG-104",
      department: "Engineering",
      start: "23:00",
      end: "00:30",
      block: "B31",
      corridor: "C01",
      priority: 94,
      color: "blue"
    },
    {
      id: "SNT-205",
      department: "S&T",
      start: "00:45",
      end: "02:15",
      block: "B32",
      corridor: "C01",
      priority: 87,
      color: "purple"
    },
    {
      id: "TRC-102",
      department: "Traction",
      start: "02:30",
      end: "03:30",
      block: "B33",
      corridor: "C02",
      priority: 73,
      color: "orange"
    },
    {
      id: "ENG-118",
      department: "Engineering",
      start: "03:30",
      end: "04:15",
      block: "B34",
      corridor: "C03",
      priority: 61,
      color: "blue"
    },
    {
      id: "SNT-214",
      department: "S&T",
      start: "04:20",
      end: "05:20",
      block: "B35",
      corridor: "C02",
      priority: 48,
      color: "purple"
    }
  ];

  const [tasks, setTasks] = useState(allTasks);

  const [date, setDate] = useState("2026-09-02");

  const [corridor, setCorridor] =
    useState("All Corridors");

  const [department, setDepartment] =
    useState("All Departments");

  const [planningWindow, setPlanningWindow] =
    useState("All Available Windows");

  const [generating, setGenerating] =
    useState(false);

  const [optimized, setOptimized] =
    useState(false);

  /*
   * Planning Window
   *
   * All Available Windows
   * 22:00 - 05:00
   *
   * Low Traffic Window
   * 23:00 - 04:00
   *
   * Night Maintenance
   * 22:00 - 06:00
   */

  const getWindow = () => {
    if (
      planningWindow === "Low Traffic Window"
    ) {
      return {
        start: 23,
        end: 28,
        label: "Low Traffic Window"
      };
    }

    if (
      planningWindow === "Night Maintenance"
    ) {
      return {
        start: 22,
        end: 30,
        label: "Night Maintenance"
      };
    }

    return {
      start: 22,
      end: 29,
      label: "All Available Windows"
    };
  };

  const normalizeTime = (time) => {
    const [hourText, minuteText] =
      time.split(":");

    let hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour < 6) {
      hour += 24;
    }

    return hour + minute / 60;
  };

  const getTaskStart = (time) => {
    return normalizeTime(time);
  };

  const getTaskEnd = (start, end) => {
    let startValue = normalizeTime(start);
    let endValue = normalizeTime(end);

    if (endValue <= startValue) {
      endValue += 24;
    }

    return endValue;
  };

  const isTaskInsideWindow = (task) => {
    const window = getWindow();

    const start = getTaskStart(task.start);
    const end = getTaskEnd(
      task.start,
      task.end
    );

    return (
      start >= window.start &&
      end <= window.end
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const corridorMatch =
      corridor === "All Corridors" ||
      task.corridor === corridor;

    const departmentMatch =
      department === "All Departments" ||
      task.department === department;

    const windowMatch =
      isTaskInsideWindow(task);

    return (
      corridorMatch &&
      departmentMatch &&
      windowMatch
    );
  });

  const generateSchedule = () => {
    setGenerating(true);

    setTimeout(() => {
      setTasks(optimizedTasks);
      setOptimized(true);
      setGenerating(false);
    }, 1500);
  };

  const reOptimize = () => {
    setGenerating(true);

    setTimeout(() => {
      setTasks(reOptimizedTasks);
      setOptimized(true);
      setGenerating(false);
    }, 1500);
  };

  const getTimelineHours = () => {
    if (
      planningWindow ===
      "Low Traffic Window"
    ) {
      return [
        "23:00",
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00"
      ];
    }

    if (
      planningWindow ===
      "Night Maintenance"
    ) {
      return [
        "22:00",
        "23:00",
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00"
      ];
    }

    return [
      "22:00",
      "23:00",
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00"
    ];
  };

  const getTimelineStart = () => {
    if (
      planningWindow ===
      "Low Traffic Window"
    ) {
      return 23;
    }

    return 22;
  };

  const getTimelineDuration = () => {
    if (
      planningWindow ===
      "Low Traffic Window"
    ) {
      return 5;
    }

    if (
      planningWindow ===
      "Night Maintenance"
    ) {
      return 8;
    }

    return 7;
  };

  const getTimeInHours = (time) => {
    const [hourText, minuteText] =
      time.split(":");

    let hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour < 6) {
      hour += 24;
    }

    return hour + minute / 60;
  };

  const getPosition = (time) => {
    const timeValue =
      getTimeInHours(time);

    const timelineStart =
      getTimelineStart();

    const duration =
      getTimelineDuration();

    const position =
      ((timeValue - timelineStart) /
        duration) *
      100;

    return Math.max(
      0,
      Math.min(position, 95)
    );
  };

  const getWidth = (start, end) => {
    let startValue =
      getTimeInHours(start);

    let endValue =
      getTimeInHours(end);

    if (endValue <= startValue) {
      endValue += 24;
    }

    const duration =
      getTimelineDuration();

    const width =
      ((endValue - startValue) /
        duration) *
      100;

    return `${Math.max(
      6,
      Math.min(width, 100)
    )}%`;
  };

  const timelineHours =
    getTimelineHours();

  return (
    <section className="content">

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>
          <h1>Block Planner</h1>

          <p>
            Plan maintenance blocks around
            train operations
          </p>
        </div>

        <button
          className="generate-btn"
          onClick={generateSchedule}
          disabled={generating}
        >
          {generating
            ? "⏳ Generating..."
            : optimized
            ? "✓ Schedule Generated"
            : "⚡ Generate Schedule"}
        </button>

      </div>

      {/* FILTERS */}

      <div className="planner-controls">

        <div>
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setOptimized(false);
            }}
          />
        </div>

        <div>
          <label>Corridor</label>

          <select
            value={corridor}
            onChange={(e) => {
              setCorridor(e.target.value);
              setOptimized(false);
            }}
          >
            <option>
              All Corridors
            </option>

            <option>C01</option>
            <option>C02</option>
            <option>C03</option>
          </select>
        </div>

        <div>
          <label>Department</label>

          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setOptimized(false);
            }}
          >
            <option>
              All Departments
            </option>

            <option>
              Engineering
            </option>

            <option>
              S&T
            </option>

            <option>
              Traction
            </option>
          </select>
        </div>

        <div>
          <label>Planning Window</label>

          <select
            value={planningWindow}
            onChange={(e) => {
              setPlanningWindow(
                e.target.value
              );

              setOptimized(false);
            }}
          >
            <option>
              All Available Windows
            </option>

            <option>
              Low Traffic Window
            </option>

            <option>
              Night Maintenance
            </option>
          </select>
        </div>

      </div>

      {/* SUMMARY */}

      <div className="planner-summary">

        <div>
          <span>
            Available Blocks
          </span>

          <strong>10</strong>
        </div>

        <div>
          <span>
            Planned Blocks
          </span>

          <strong>
            {filteredTasks.length}
          </strong>
        </div>

        <div>
          <span>
            Train Conflicts
          </span>

          <strong>
            {optimized ? "0" : "2"}
          </strong>
        </div>

        <div>
          <span>
            Tasks Planned
          </span>

          <strong>
            {filteredTasks.length}
          </strong>
        </div>

      </div>

      {/* TIMELINE */}

      <div className="panel planner-panel">

        <div className="panel-header">

          <div>
            <h2>
              Maintenance Block Timeline
            </h2>

            <p>
              {optimized
                ? `AI optimized schedule • ${date} • ${planningWindow}`
                : `Maintenance schedule • ${date} • ${planningWindow}`}
            </p>
          </div>

          <button
            className="view-btn"
            onClick={reOptimize}
            disabled={generating}
          >
            {generating
              ? "⏳ Optimizing..."
              : "Re-optimize ↻"}
          </button>

        </div>

        <div className="timeline">

          {/* TIME HEADER */}

          <div className="timeline-header">

            <div className="timeline-label">
              Task / Department
            </div>

            <div className="timeline-hours">

              {timelineHours.map(
                (hour) => (
                  <span key={hour}>
                    {hour}
                  </span>
                )
              )}

            </div>

          </div>

          {/* TASKS */}

          {filteredTasks.length === 0 ? (

            <div className="no-tasks">

              No maintenance tasks found
              for the selected planning
              window and filters.

            </div>

          ) : (

            filteredTasks.map(
              (task) => (

                <div
                  className="timeline-row"
                  key={task.id}
                >

                  <div className="timeline-label">

                    <strong>
                      {task.id}
                    </strong>

                    <span>
                      {task.department}
                      {" • "}
                      {task.corridor}
                    </span>

                  </div>

                  <div className="timeline-track">

                    <div
                      className={`timeline-task ${task.color}`}
                      style={{
                        width:
                          getWidth(
                            task.start,
                            task.end
                          ),

                        marginLeft:
                          `${getPosition(
                            task.start
                          )}%`
                      }}
                    >

                      <strong>
                        {task.block}
                      </strong>

                      <span>
                        {task.start}
                        {" - "}
                        {task.end}
                      </span>

                    </div>

                  </div>

                </div>

              )
            )

          )}

          {/* TRAIN OPERATIONS */}

          <div className="train-timeline">

            <div className="timeline-label">

              <strong>
                🚆 Train Operations
              </strong>

            </div>

            <div className="train-timeline-track">

              <div className="train-event train-one">
                🚆 12951
              </div>

              <div className="train-event train-two">
                🚆 12002
              </div>

              <div className="train-event train-three">
                🚆 12401
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CONFLICT BOX */}

      <div
        className={`conflict-box ${
          optimized
            ? "conflict-resolved"
            : ""
        }`}
      >

        <div>

          <strong>

            {optimized
              ? "✓ Schedule Conflicts Resolved"
              : "⚠ Schedule Conflicts"}

          </strong>

          <p>

            {optimized
              ? "Maintenance blocks have been shifted to safer windows around train operations."
              : "2 potential train conflicts detected. Review before finalizing the schedule."}

          </p>

        </div>

        <button
          className="view-btn"
          onClick={reOptimize}
          disabled={generating}
        >

          {optimized
            ? "Re-optimize Again ↻"
            : "Review Conflicts →"}

        </button>

      </div>

    </section>
  );
}

export default BlockPlanner;