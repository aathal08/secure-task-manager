export default function TaskItem({ task, onToggle, onDelete }) {
  const nextStatus = { pending: 'in-progress', 'in-progress': 'done', done: 'pending' };

  return (
    <li className={`task-item status-${task.status}`}>
      <div>
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      <div className="task-actions">
        <button onClick={() => onToggle(task, nextStatus[task.status])}>{task.status.replace('-', ' ')}</button>
        <button className="btn-danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </li>
  );
}