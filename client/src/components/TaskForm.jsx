import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title, description });
      setTitle('');
      setDescription('');
    } finally { setSubmitting(false); }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="New task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding…' : 'Add task'}</button>
    </form>
  );
}