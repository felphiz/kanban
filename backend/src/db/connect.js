// Conecta ao MongoDB
const mongoose = require('mongoose');

const connect = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connect;
