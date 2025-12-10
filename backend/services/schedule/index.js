require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes/sessions.route');
const { notFound, onError } = require('../shared/http');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'schedule',
    time: new Date().toISOString()
  });
});

app.use('/sessions', router);

app.use(notFound);
app.use(onError);

const port = process.env.PORT_SCHEDULE || 3009;
app.listen(port, () => {
  console.log(`📅 Schedule service running on port ${port}`);
});

module.exports = app;
