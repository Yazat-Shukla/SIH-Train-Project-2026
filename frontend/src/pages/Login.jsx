import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Temporary frontend admin credentials
  // Later these will be verified by FastAPI backend.
  const ADMIN_USER_ID = "admin";
  const ADMIN_PASSWORD = "blackfire123";

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    // Small delay to make login feel realistic
    setTimeout(() => {
      if (
        userId.trim() === ADMIN_USER_ID &&
        password === ADMIN_PASSWORD
      ) {
        // Save login session
        localStorage.setItem(
          "blackfire_admin",
          JSON.stringify({
            userId: userId.trim(),
            name: "Planner",
            role: "Admin",
            loggedIn: true
          })
        );

        navigate("/", { replace: true });
      } else {
        setError("Invalid User ID or Password");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}

        <div className="login-logo">
          🚆
        </div>

        <h1>
          BLACKFIRE
        </h1>

        <p className="login-subtitle">
          Railway AI Planner
        </p>

        <div className="login-divider"></div>

        <h2>
          Admin
        </h2>

        <p className="login-description">
          Sign in to access the maintenance dashboard
        </p>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* USER ID */}

          <div className="login-field">

            <label htmlFor="userId">
              User ID
            </label>

            <input
              id="userId"
              type="text"
              placeholder="Enter admin user ID"
              value={userId}
              onChange={(event) =>
                setUserId(event.target.value)
              }
              autoComplete="username"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              ⚠ {error}
            </div>
          )}

          {/* SIGN IN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* FOOTER */}

        <p className="login-footer">
          Authorized personnel only
        </p>

      </div>

    </div>
  );
}

export default Login;