const Task = require('../models/Task');

//  Criar tarefa
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//  Listar todas as tarefas
const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

//  Deletar tarefa
const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deletada com sucesso.' });
};

//  Editar tarefa
const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
};

module.exports = { createTask, getTasks, deleteTask, updateTask };
