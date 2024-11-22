const mongoose = require('mongoose');

async function connectDB(){
    await mongoose.connect('mongodb://localhost:27017/UserLoginTest')
    console.log("Connected to MongoDB");
};

connectDB();

module.exports = mongoose.connection;