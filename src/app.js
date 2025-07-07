const { EnvironmentVariablesManager } = require('@mondaycom/apps-sdk');

let envManager = new EnvironmentVariablesManager();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const port = envManager.get("PORT") || 8080;
const app = express();

const corsOptions = {
  origin: [
    'https://v5e69c38b63261f9a.cdn2.monday.app', // item view 
    'https://96360fdd98b1e756.cdn2.monday.app', // account settings view
  ],
  method: 'GET, POST'
};
// if (process.env.NODE_ENV === "test") {
//   corsOptions.origin.push('http://localhost:8301');
// }

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => {
  console.log(`Password backend listening on port ${port}`)
});

module.exports = app;
