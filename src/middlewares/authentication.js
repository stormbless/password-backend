const { SecretsManager } = require('@mondaycom/apps-sdk');
const secretsManager = new SecretsManager();

const jwt = require('jsonwebtoken');

async function authenticationMiddleware(req, res, next) {
  console.log("received request");
  try {
    const sessionToken = req.headers.authorization;

    const { dat } = jwt.verify(
      sessionToken,
      secretsManager.get("CLIENT_SECRET")
    );

    // are numbers (not strings)
    const accountId = dat.account_id;
    const userId = dat.user_id;

    req.session = { accountId, userId };
    next();    
    console.log("received valid token");
  } catch (err) {
    console.log('received invalid or expired token');
    console.error(err);
    return res.status(500).send('not authenticated' );
  }
}

module.exports = {
  authenticationMiddleware,
};
