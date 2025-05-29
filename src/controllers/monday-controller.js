const storageService = require('../services/storage-service');

async function storePassword(req, res) {
  try {
    // console.log(`req: ${req}`);
    const { accountId, userId } = req.session;
    const { itemId, password, changedBy } = req.body;
    // console.log(`req.session: ${JSON.stringify(req.session)}`);
    // console.log(`req.body: ${JSON.stringify(req.body)}`);


    const user = {id: userId, name: changedBy};

    // console.log(`storepassword: ${password}`);

    passSuccess = await storageService.storePassword(accountId, itemId, password);
    histSuccess = await storageService.updateChangeHistory(accountId, itemId, user);

    // console.log(`password stored?: ${passSuccess}`);
    // console.log(`change history updated?: ${histSuccess}`);

    if (passSuccess && histSuccess) {
      return res.status(200).send();
    } else {
      return res.status(500).send('internal server error');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

async function getPassword(req, res) {
  try {
    const { accountId } = req.session;
    const { itemId } = req.query;

    // console.log(`req.session: ${JSON.stringify(req.session)}`);
    // console.log(`req.query: ${JSON.stringify(req.body)}`);

    password = await storageService.getPassword(accountId, itemId);
    // console.log(`getpassword: ${password}`);

    return res.status(200).send(password);
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

async function getChangeHistory(req, res) {
  try {
    const { accountId } = req.session;
    const { itemId } = req.query;

    changeHistory = await storageService.getChangeHistory(accountId, itemId);

    return res.status(200).send(changeHistory);
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

async function deleteAccountValues(req, res) {
  try {
    const { accountId } = req.session;

    // might have to verify user is an admin or something like that
    // might do another auth middleware that verifies admin that goes after first auth before this
    // might automate to work automatically on uninstall

    deleteSuccessful = await storageService.deleteAccountValues(accountId);

    if (deleteSuccessful) {
      return res.status(200).send();
    } else {
      return res.status(500).send('internal server error');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

module.exports = {
  storePassword,
  getPassword,
  getChangeHistory,
  deleteAccountValues
};
