const express = require('express');
const cors = require('cors');
const connect = require('./db/connect');
const taskRoutes = require('./routes/taskRoutes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

//  Middlewares básicos
app.use(cors({ origin: '*' })); // Libera todas as origens para o frontend
app.use(express.json());

//  Rotas
app.use('/api/tasks', taskRoutes);

//  Inicia o servidor e conecta ao MongoDB
connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`)
  );
});
