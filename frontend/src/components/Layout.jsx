import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../App.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("blackfire_admin");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            🚆
          </div>

          <div>
            <h2>BLACKFIRE</h2>
            <span>Railway AI Planner</span>
          </div>

        </div>


        <nav className="sidebar-nav">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>▦</span>
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
            <span>◷</span>
            Schedule
          </NavLink>


          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>▥</span>
            Analytics
          </NavLink>


          <NavLink
            to="/railway-map"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>⌖</span>
            Railway Map
          </NavLink>

        </nav>


        {/* ================= SIDEBAR BOTTOM ================= */}

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


      {/* ================= MAIN AREA ================= */}

      <main className="main">

        {/* ================= TOPBAR ================= */}

        <header className="topbar">

          <div className="topbar-title">

            <h1>
              Maintenance Dashboard
            </h1>

            <p>
              AI-powered railway maintenance planning
            </p>

          </div>


          <div className="topbar-right">
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </button>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <Outlet />

      </main>

    </div>
  );
}

export default Layout;