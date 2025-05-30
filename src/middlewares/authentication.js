const jwt = require('jsonwebtoken');

async function authenticationMiddleware(req, res, next) {
  console.log("received request");
  console.log(JSON.stringify(req.body));
  try {
    const sessionToken = req.headers.authorization;


    const { dat } = jwt.verify(
      sessionToken,
      process.env.CLIENT_SECRET
    );

    // console.log(`dat: ${JSON.stringify(dat)}`);

    const accountId = dat.account_id;
    const userId = dat.user_id;

    // console.log(`accountId: ${accountId} userId: ${userId}`);
    // console.log(`accountId type: ${typeof accountId} userId type: ${typeof userId}`);

    req.session = { accountId, userId };
    next();    
    console.log("received valid token");
  } catch (err) {
    console.error(err);
    return res.status(500).send('not authenticated' );
  }
}

module.exports = {
  authenticationMiddleware,
};
