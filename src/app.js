const { EnvironmentVariablesManager } = require('@mondaycom/apps-sdk');

let envManager = new EnvironmentVariablesManager();// const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const port = envManager.get("PORT");
const app = express();

// possibly restrict to https://gro3demo.monday.com
const corsOptions = {
  origin: [
    'https://vbd2f1a6673a77bd8.cdn2.monday.app', // item view 
    'https://23f4f27adb43e5ad.cdn2.monday.app', // account settings view
  ],
  method: 'GET, POST'
};
// if (process.env.NODE_ENV === "test") {
//   corsOptions.origin.push('http://localhost:8301');
// }

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
