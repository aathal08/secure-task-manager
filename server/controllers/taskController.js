const mongoose = require('mongoose');
const Task = require('../models/Task');
const { validateTaskInput } = require('../utils/validators');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({
      user: req.userId,
      title: title.trim(),
      description: description === undefined ? '' : description.trim(),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
    });
    res.status(201).json({ task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
    const validationError = validateTaskInput(req.body, { partial: true });
    if (validationError) return res.status(400).json({ message: validationError });
    if (!Object.keys(req.body || {}).length) return res.status(400).json({ message: 'At least one task field is required' });
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.body.title !== undefined) task.title = req.body.title.trim();
    if (req.body.description !== undefined) task.description = req.body.description.trim();
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : undefined;
    await task.save();
    res.json({ task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };