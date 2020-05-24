const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const errorhandler = require('errorhandler');

const apiRouter = require('./api/api');

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', apiRouter);
app.use(errorhandler());


app.listen(PORT, function(){
    console.log(`app listening on port ${PORT}`);
});

module.exports = app;