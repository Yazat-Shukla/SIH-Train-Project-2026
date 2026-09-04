import "../App.css";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">🚆</div>

          <div>
            <h2>BLACKFIRE</h2>
            <span>Railway AI Planner</span>
          </div>
        </div>

        <nav className="navigation">

          <div className="nav-section">
            <p>MAIN</p>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>⌂</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/maintenance"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>🔧</span>
              Maintenance
            </NavLink>

            <NavLink
              to="/block-planner"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>🚧</span>
              Block Planner
            </NavLink>

            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>📅</span>
              Schedule
            </NavLink>

          </div>

          <div className="nav-section">
            <p>ANALYTICS</p>

            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>📊</span>
              Analytics
            </NavLink>

            <NavLink
              to="/railway-map"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>🚆</span>
              Railway Map
            </NavLink>

          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>All services operational</small>
            </div>
          </div>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>
            <h1>Maintenance Dashboard</h1>
            <p>AI-powered railway maintenance planning</p>
          </div>

          <div className="topbar-right">

            <button className="notification">
              🔔
            </button>

            <div className="user">

              <div className="avatar">
                P
              </div>

              <div>
                <strong>Planner</strong>
                <span>Operations</span>
              </div>

            </div>

          </div>

        </header>

        <Outlet />

      </main>

    </div>
  );
}

export default Layout;