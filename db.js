const mongoose = require('mongoose');
const DATABASE = process.env.DATABASE
require('dotenv').config();
// Database connection URL
const mongoURL = `${process.env.REACT_APP_DATABASE}`;

const connectToMongo = () => {
  mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');

    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);

    });
}
module.exports = connectToMongo;