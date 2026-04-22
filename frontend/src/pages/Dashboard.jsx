import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  console.log("USER:", user);
  console.log("ROLE:", user?.role);
  const isAdmin = user?.role === "admin";

  const API = axios.create({
    baseURL: "http://localhost:4000/api/v1",
    withCredentials: true
  });

  console.log("RENDER DASHBOARD");

  const createTask = async () => {
    console.log("CREATE CLICKED");

    if (!title.trim()) {
      console.log("EMPTY TITLE");
      return;
    }

    try {
      const res = await API.post("/tasks", { title });
      console.log("CREATE RESPONSE:", res.data);

      setTasks(prev => [...prev, res.data.data]);
      setTitle("");
    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data || err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    let mounted = true;

    const loadTasks = async () => {
      console.log("FETCH CALLED");
      try {
        const res = await API.get("/tasks");
        if (mounted) {
          setTasks(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();

    return () => {
      mounted = false;
    };
  }, []);

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="header">
        <h2>Task Dashboard</h2>
        <span className={`role ${isAdmin ? "admin" : "user"}`}>
          {isAdmin ? "Admin" : "User"}
        </span>
      </div>

      {isAdmin && (
        <div className="task-input">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task"
          />
          <button onClick={createTask}>Add Task</button>
        </div>
      )}

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <span>{task.title}</span>

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
