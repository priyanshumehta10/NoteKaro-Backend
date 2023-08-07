const mongoose = require('mongoose');

// Database connection URL
const mongoURL = 'mongodb+srv://priyanshu:diya1028@cluster0.ztwwqop.mongodb.net/NoteKaroDB?retryWrites=true&w=majority';

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