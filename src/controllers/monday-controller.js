

const itemManagement = require('../services/item-management');
const accountManagement = require('../services/account-management');

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// await sleep(msec)

async function storePassword(req, res) {
  try {
    const { accountId, userId } = req.session;
    const { itemId, password, changedBy } = req.body;

    const user = {id: userId, name: changedBy};

    const passSuccess = await itemManagement.storePassword(accountId, itemId, password);
    const histSuccess = await itemManagement.updateChangeHistory(accountId, itemId, user);
    const indexSuccess = await accountManagement.updateIndex(itemId);

    if (passSuccess && histSuccess && indexSuccess) {
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

    const password = await itemManagement.getPassword(accountId, itemId);

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

    const changeHistory = await itemManagement.getChangeHistory(accountId, itemId);

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

    const deleteSuccessful = await accountManagement.deleteAccountValues(accountId);

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
