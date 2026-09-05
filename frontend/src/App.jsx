import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import BlockPlanner from "./pages/BlockPlanner";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import RailwayMap from "./pages/RailwayMap";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================= PROTECTED PAGES ================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/maintenance"
              element={<Maintenance />}
            />

            <Route
              path="/block-planner"
              element={<BlockPlanner />}
            />

            <Route
              path="/schedule"
              element={<Schedule />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/railway-map"
              element={<RailwayMap />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;