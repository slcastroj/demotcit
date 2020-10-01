const express = require('express');
const cors = require('cors');
const { configureRoutes } = require('./routing.js');

const app = express();
app.use(express.json());
app.use(cors());

configureRoutes(app);

exports.app = app;