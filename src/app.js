require('dotenv').config();
// const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const { PORT: port } = process.env;
const app = express();

// possibly restrict to https://gro3demo.monday.com
const corsOptions = {
  origin: ['http://monday.com', 'https://v9c32bc575630bb9f.cdn2.monday.app'],
  method: 'GET, POST'
};
if (process.env.NODE_ENV === "test") {
  corsOptions.origin.push('http://localhost:8301');
}

// const token = jwt.sign({
//   dat: {
//     account_id: "1",
//     user_id: "1"
//   }
// }, process.env.CLIENT_SECRET, {expiresIn: 48 * 60 * 60 });
// console.log(`start of token: ${token} end of token`);

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  console.log(`Password backend listening on port ${port}`)
});

module.exports = app;
