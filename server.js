const express = require('express');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const config = require('./config/keys');
const path = require('path');
const app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));


