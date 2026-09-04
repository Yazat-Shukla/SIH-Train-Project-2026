import { useState } from "react";
import "../App.css";

function Analytics() {
  /*
   * DEMO MAINTENANCE DATA
   *
   * Later this data will come from:
   * FastAPI -> Database -> XGBoost -> OR-Tools
   */

  const maintenanceData = [
    {
      id: "ENG-104",
      department: "Engineering",
      risk: "Critical",
      priority: 94,
      duration: 120,
      optimizedDuration: 90
    },
    {
      id: "ENG-105",
      department: "Engineering",
      risk: "Critical",
      priority: 91,
      duration: 100,
      optimizedDuration: 80
    },
    {
      id: "ENG-106",
      department: "Engineering",
      risk: "Critical",
      priority: 88,
      duration: 90,
      optimizedDuration: 70
    },
    {
      id: "ENG-107",
      department: "Engineering",
      risk: "Critical",
      priority: 86,
      duration: 80,
      optimizedDuration: 60
    },
    {
      id: "ENG-108",
      department: "Engineering",
      risk: "Critical",
      priority: 84,
      duration: 90,
      optimizedDuration: 70
    },
    {
      id: "ENG-109",
      department: "Engineering",
      risk: "High",
      priority: 82,
      duration: 90,
      optimizedDuration: 75
    },
    {
      id: "ENG-110",
      department: "Engineering",
      risk: "High",
      priority: 80,
      duration: 80,
      optimizedDuration: 65
    },
    {
      id: "ENG-111",
      department: "Engineering",
      risk: "High",
      priority: 78,
      duration: 70,
      optimizedDuration: 55
    },

    {
      id: "SNT-201",
      department: "S&T",
      risk: "High",
      priority: 76,
      duration: 90,
      optimizedDuration: 70
    },
    {
      id: "SNT-202",
      department: "S&T",
      risk: "High",
      priority: 74,
      duration: 80,
      optimizedDuration: 60
    },
    {
      id: "SNT-203",
      department: "S&T",
      risk: "High",
      priority: 72,
      duration: 75,
      optimizedDuration: 55
    },
    {
      id: "SNT-204",
      department: "S&T",
      risk: "High",
      priority: 70,
      duration: 70,
      optimizedDuration: 50
    },
    {
      id: "SNT-205",
      department: "S&T",
      risk: "High",
      priority: 68,
      duration: 60,
      optimizedDuration: 45
    },
    {
      id: "SNT-206",
      department: "S&T",
      risk: "High",
      priority: 66,
      duration: 60,
      optimizedDuration: 45
    },

    {
      id: "TRC-101",
      department: "Traction",
      risk: "Medium",
      priority: 64,
      duration: 80,
      optimizedDuration: 65
    },
    {
      id: "TRC-102",
      department: "Traction",
      risk: "Medium",
      priority: 62,
      duration: 70,
      optimizedDuration: 55
    },
    {
      id: "TRC-103",
      department: "Traction",
      risk: "Medium",
      priority: 60,
      duration: 60,
      optimizedDuration: 45
    },
    {
      id: "TRC-104",
      department: "Traction",
      risk: "Medium",
      priority: 58,
      duration: 60,
      optimizedDuration: 45
    },

    {
      id: "OTH-101",
      department: "Other",
      risk: "Medium",
      priority: 56,
      duration: 50,
      optimizedDuration: 40
    },
    {
      id: "OTH-102",
      department: "Other",
      risk: "Medium",
      priority: 49,
      duration: 45,
      optimizedDuration: 35
    }
  ];

  const [reportGenerated, setReportGenerated] =
    useState(false);

  const [showRecommendations, setShowRecommendations] =
    useState(false);

  /*
   * ============================
   * BASIC ANALYTICS
   * ============================
   */

  const totalTasks = maintenanceData.length;

  const criticalTasks = maintenanceData.filter(
    (task) => task.risk === "Critical"
  ).length;

  const highTasks = maintenanceData.filter(
    (task) => task.risk === "High"
  ).length;

  const mediumTasks = maintenanceData.filter(
    (task) => task.risk === "Medium"
  ).length;

  /*
   * Average priority
   */

  const averagePriority = Math.round(
    maintenanceData.reduce(
      (total, task) =>
        total + task.priority,
      0
    ) / totalTasks
  );

  /*
   * Hours saved after optimization
   */

  const totalMinutesSaved =
    maintenanceData.reduce(
      (total, task) =>
        total +
        (task.duration -
          task.optimizedDuration),
      0
    );

  const hoursSaved = Math.round(
    totalMinutesSaved / 60
  );

  /*
   * ============================
   * DEPARTMENT ANALYTICS
   * ============================
   */

  const departmentCounts = {
    Engineering:
      maintenanceData.filter(
        (task) =>
          task.department ===
          "Engineering"
      ).length,

    "S&T":
      maintenanceData.filter(
        (task) =>
          task.department === "S&T"
      ).length,

    Traction:
      maintenanceData.filter(
        (task) =>
          task.department ===
          "Traction"
      ).length,

    Other:
      maintenanceData.filter(
        (task) =>
          task.department ===
          "Other"
      ).length
  };

  const maxDepartmentTasks =
    Math.max(
      ...Object.values(
        departmentCounts
      )
    );

  const highestDepartment =
    Object.entries(
      departmentCounts
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

  /*
   * ============================
   * RISK ANALYTICS
   * ============================
   */

  const criticalPercent =
    (criticalTasks /
      totalTasks) *
    100;

  const highPercent =
    (highTasks /
      totalTasks) *
    100;

  const highStart =
    criticalPercent;

  const highEnd =
    criticalPercent +
    highPercent;

  /*
   * IMPORTANT:
   *
   * Outer circle = colored donut
   * Inner circle = WHITE
   */

  const riskChartStyle = {
    background: `conic-gradient(
      #ef4444 0% ${criticalPercent}%,
      #f59e0b ${highStart}% ${highEnd}%,
      #2f75ed ${highEnd}% 100%
    )`
  };

  /*
   * ============================
   * OPTIMIZATION ANALYTICS
   * ============================
   */

  const potentialConflicts =
    Math.max(
      1,
      Math.round(
        totalTasks * 0.8
      )
    );

  const conflictsAvoided =
    Math.round(
      potentialConflicts * 0.7
    );

  const availableBlocks = 10;

  const utilizedBlocks =
    Math.min(
      availableBlocks,
      Math.max(
        1,
        Math.ceil(
          totalTasks / 2.5
        )
      )
    );

  const blockUtilization =
    Math.round(
      (utilizedBlocks /
        availableBlocks) *
        100
    );

  const conflictScore =
    (conflictsAvoided /
      potentialConflicts) *
    60;

  const blockScore =
    blockUtilization *
    0.4;

  const scheduleEfficiency =
    Math.min(
      99,
      Math.round(
        conflictScore +
        blockScore
      )
    );

  /*
   * ============================
   * DYNAMIC AI RECOMMENDATIONS
   * ============================
   */

  const generateRecommendations =
    () => {
      const recommendations = [];

      /*
       * Highest priority task
       */

      const highestPriorityTask =
        [...maintenanceData].sort(
          (a, b) =>
            b.priority -
            a.priority
        )[0];

      if (highestPriorityTask) {
        recommendations.push({
          title: "Priority Action",
          text:
            `${highestPriorityTask.id} has the highest priority score of ${highestPriorityTask.priority}. Schedule this task before lower-priority maintenance.`
        });
      }

      /*
       * Critical department
       */

      const criticalDepartmentCounts =
        {};

      maintenanceData
        .filter(
          (task) =>
            task.risk ===
            "Critical"
        )
        .forEach((task) => {
          criticalDepartmentCounts[
            task.department
          ] =
            (criticalDepartmentCounts[
              task.department
            ] || 0) + 1;
        });

      const criticalDepartment =
        Object.entries(
          criticalDepartmentCounts
        ).sort(
          (a, b) =>
            b[1] - a[1]
        )[0];

      if (criticalDepartment) {
        recommendations.push({
          title:
            "Critical Workload",
          text:
            `${criticalDepartment[0]} contains ${criticalDepartment[1]} critical tasks. Allocate suitable protected maintenance windows to reduce operational risk.`
        });
      }

      /*
       * Highest workload
       */

      recommendations.push({
        title:
          "Workload Balancing",
        text:
          `${highestDepartment[0]} has the highest workload with ${highestDepartment[1]} of ${totalTasks} tasks. Consider grouping compatible work from this department into common maintenance blocks.`
      });

      /*
       * Risk-aware scheduling
       */

      const highAndCritical =
        highTasks +
        criticalTasks;

      const highRiskPercent =
        Math.round(
          (highAndCritical /
            totalTasks) *
            100
        );

      if (
        highAndCritical >
        mediumTasks
      ) {
        recommendations.push({
          title:
            "Risk-Aware Scheduling",
          text:
            `High and critical tasks represent ${highRiskPercent}% of the workload. Prefer lower-train-density maintenance windows for these activities.`
        });
      } else {
        recommendations.push({
          title:
            "Flexible Scheduling",
          text:
            `Most maintenance tasks are medium risk. Compatible activities can be grouped into common blocks where corridor and train constraints allow.`
        });
      }

      /*
       * Optimization
       */

      recommendations.push({
        title:
          "Optimization Opportunity",
        text:
          `The current plan avoids approximately ${conflictsAvoided} of ${potentialConflicts} potential conflicts with ${blockUtilization}% block utilization. Re-optimize when train timings or corridor availability change.`
      });

      return recommendations;
    };

  const recommendations =
    generateRecommendations();

  /*
   * ============================
   * GENERATE REPORT
   * ============================
   */

  const generateReport = () => {
    const headers = [
      "Metric",
      "Value"
    ];

    const rows = [
      [
        "Total Tasks",
        totalTasks
      ],
      [
        "Critical Tasks",
        criticalTasks
      ],
      [
        "High Risk Tasks",
        highTasks
      ],
      [
        "Medium Risk Tasks",
        mediumTasks
      ],
      [
        "Average Priority",
        averagePriority
      ],
      [
        "Hours Saved",
        hoursSaved
      ],
      [
        "Conflicts Avoided",
        conflictsAvoided
      ],
      [
        "Blocks Utilized",
        `${blockUtilization}%`
      ],
      [
        "Schedule Efficiency",
        `${scheduleEfficiency}%`
      ],
      [
        "Highest Workload Department",
        highestDepartment[0]
      ]
    ];

    const csv = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "railway_analytics_report.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );

    setReportGenerated(true);
  };

  return (
    <section className="content">

      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>

          <h1>
            Analytics
          </h1>

          <p>
            Railway maintenance performance
            and AI insights
          </p>

        </div>

        <button
          className="generate-btn"
          onClick={
            generateReport
          }
        >

          {reportGenerated
            ? "✓ Report Generated"
            : "📊 Generate Report"}

        </button>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="analytics-stats">

        {/* TOTAL TASKS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            📋
          </div>

          <div className="stat-info">

            <span>
              Total Tasks
            </span>

            <h3>
              {totalTasks}
            </h3>

            <small>
              ↑ 12% this month
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
              {criticalTasks}
            </h3>

            <small>
              {Math.round(
                (criticalTasks /
                  totalTasks) *
                  100
              )}
              % of total tasks
            </small>

          </div>

        </div>

        {/* AVERAGE PRIORITY */}

        <div className="stat-card">

          <div className="stat-icon purple">
            ⚡
          </div>

          <div className="stat-info">

            <span>
              Avg. Priority
            </span>

            <h3>
              {averagePriority}
            </h3>

            <small>

              {averagePriority >=
              75
                ? "High priority workload"
                : averagePriority >=
                  60
                ? "Moderate priority workload"
                : "Lower priority workload"}

            </small>

          </div>

        </div>

        {/* HOURS SAVED */}

        <div className="stat-card">

          <div className="stat-icon orange">
            ⏱
          </div>

          <div className="stat-info">

            <span>
              Hours Saved
            </span>

            <h3>
              {hoursSaved}
            </h3>

            <small>
              Through optimization
            </small>

          </div>

        </div>

      </div>

      {/* ================= DEPARTMENT + RISK ================= */}

      <div className="analytics-grid">

        {/* DEPARTMENT */}

        <div className="panel chart-panel">

          <div className="panel-header">

            <div>

              <h2>
                Tasks by Department
              </h2>

              <p>
                Maintenance workload
                distribution
              </p>

            </div>

          </div>

          <div className="bar-chart">

            {Object.entries(
              departmentCounts
            ).map(
              ([name, count]) => {

                const percentage =
                  (count /
                    maxDepartmentTasks) *
                  100;

                return (
                  <div
                    className="chart-row"
                    key={name}
                  >

                    <span>
                      {name}
                    </span>

                    <div className="chart-bar">

                      <div
                        style={{
                          width:
                            `${percentage}%`
                        }}
                      />

                    </div>

                    <strong>
                      {count}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* RISK DISTRIBUTION */}

        <div className="panel chart-panel">

          <div className="panel-header">

            <div>

              <h2>
                Risk Distribution
              </h2>

              <p>
                Current maintenance
                risk levels
              </p>

            </div>

          </div>

          <div className="risk-chart">

            {/* OUTER DONUT */}

            <div
  className="risk-circle"
  style={{
    background: "transparent",
    border: "none",
    boxShadow: "none"
  }}
>
  <div
    className="risk-donut"
    style={{
      background: riskChartStyle.background,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <div className="risk-circle-inner">
      <strong>{totalTasks}</strong>
      <span>Tasks</span>
    </div>
  </div>
</div>

            {/* LEGEND */}

            <div className="risk-legend">

              <div>

                <span className="legend-dot critical" />

                <span>
                  Critical
                </span>

                <strong>
                  {criticalTasks}
                </strong>

              </div>

              <div>

                <span className="legend-dot high" />

                <span>
                  High
                </span>

                <strong>
                  {highTasks}
                </strong>

              </div>

              <div>

                <span className="legend-dot medium" />

                <span>
                  Medium
                </span>

                <strong>
                  {mediumTasks}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= OPTIMIZATION + AI ================= */}

      <div className="analytics-grid">

        {/* OPTIMIZATION */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Optimization Performance
              </h2>

              <p>
                AI scheduling impact
              </p>

            </div>

          </div>

          <div className="performance-grid">

            <div>

              <span>
                Conflicts Avoided
              </span>

              <strong>
                {conflictsAvoided}
              </strong>

              <small>
                Dynamic calculation
              </small>

            </div>

            <div>

              <span>
                Blocks Utilized
              </span>

              <strong>
                {blockUtilization}%
              </strong>

              <small>
                {utilizedBlocks} of{" "}
                {availableBlocks} blocks
              </small>

            </div>

            <div>

              <span>
                Schedule Efficiency
              </span>

              <strong>
                {scheduleEfficiency}%
              </strong>

              <small>

                {scheduleEfficiency >=
                90
                  ? "Excellent"
                  : scheduleEfficiency >=
                    75
                  ? "Good"
                  : "Needs Improvement"}

              </small>

            </div>

          </div>

        </div>

        {/* AI INSIGHT */}

        <div className="panel ai-insight">

          <div className="optimization-icon">
            🤖
          </div>

          <div>

            <h2>
              AI Insight
            </h2>

            <p>

              {highestDepartment[0]}
              {" "}has the highest
              maintenance workload
              with{" "}
              {highestDepartment[1]}
              {" "}tasks.

              {" "}

              {criticalTasks > 0
                ? `${criticalTasks} critical tasks require priority scheduling.`
                : "No critical tasks currently require immediate prioritization."}

            </p>

            <button
              className="view-btn"
              onClick={() =>
                setShowRecommendations(
                  !showRecommendations
                )
              }
            >

              {showRecommendations
                ? "Hide Recommendations ↑"
                : "View Recommendations →"}

            </button>

          </div>

        </div>

      </div>

      {/* ================= AI RECOMMENDATIONS ================= */}

      {showRecommendations && (

        <div className="panel ai-recommendations">

          <div className="panel-header">

            <div>

              <h2>
                🤖 AI Recommendations
              </h2>

              <p>
                Generated from current
                maintenance data,
                risk and priority
              </p>

            </div>

          </div>

          <div className="recommendation-list">

            {recommendations.map(
              (
                recommendation,
                index
              ) => (

                <div
                  className="recommendation-item"
                  key={index}
                >

                  <div className="recommendation-number">
                    {index + 1}
                  </div>

                  <div>

                    <strong>
                      {
                        recommendation.title
                      }
                    </strong>

                    <p>
                      {
                        recommendation.text
                      }
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </section>
  );
}

export default Analytics;