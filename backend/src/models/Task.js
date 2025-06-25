// Modelo de tarefa
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  status: {
    type: String,
    enum: ['a fazer', 'em execução', 'feito'], // Os três status
    required: true,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
