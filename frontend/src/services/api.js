const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API Error ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

export async function getTasks() {
  return request("/tasks");
}

export async function getAssets() {
  return request("/assets");
}

export async function getBlocks() {
  return request("/blocks");
}

export async function getTrains() {
  return request("/trains");
}

export async function getSchedule() {
  return request("/schedule");
}

export async function generateSchedule(payload = {}) {
  return request("/schedule/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function reOptimizeSchedule(payload = {}) {
  return request("/schedule/reoptimize", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function createTask(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });
}

export async function updateTask(taskId, task) {
  return request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task)
  });
}

export async function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, {
    method: "DELETE"
  });
}