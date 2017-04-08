const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../')));

// Routes
require('./routes.js')(app);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port: ${port}`);
