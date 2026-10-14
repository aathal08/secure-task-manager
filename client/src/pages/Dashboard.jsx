import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try { const { data } = await api.get('/tasks'); setTasks(data.tasks); }
    catch (err) { setError('Could not load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async (payload) => {
    const { data } = await api.post('/tasks', payload);
    setTasks((prev) => [data.task, ...prev]);
  };
  const handleToggle = async (task, status) => {
    const { data } = await api.put(`/tasks/${task._id}`, { status });
    setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
  };
  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  if (loading) return <p className="loading">Loading tasks…</p>;
  return (
    <div className="dashboard">
      <h1>Your tasks</h1>
      <TaskForm onCreate={handleCreate} />
      {error && <p className="error">{error}</p>}
      <ul className="task-list">
        {tasks.length === 0 && <p className="empty">No tasks yet — add your first one above.</p>}
        {tasks.map((task) => <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />)}
      </ul>
    </div>
  );
}