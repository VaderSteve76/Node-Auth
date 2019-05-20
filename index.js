const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true }, () => 
  console.log('Connected to DB')
);

//Middleware
app.use(express.json());

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log('Server Running'));