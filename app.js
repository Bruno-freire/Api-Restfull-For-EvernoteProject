const express = require('express');
const path = require('path');
const logger = require('morgan');
require("./config/database")
let cors = require('cors')

const swaggerUI = require('swagger-ui-express')
const swaggerDocs = require('./swagger_output.json')

const usersRouter = require('./app/routes/users');
const notesRouter = require('./app/routes/notes')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/', (req, res) => {
  res.status(200).json({message: "Server online"})
})


module.exports = app;
