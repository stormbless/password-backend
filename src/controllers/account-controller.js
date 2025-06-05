

const accountManagement = require('../services/account-management');

async function storeCode(req, res) {
  try {
    const { accountId } = req.session;
    const { code } = req.body;

    const storeSuccess = await accountManagement.storeCode(accountId, code);

    if (storeSuccess) {
      return res.status(200).send();
    } else {
      return res.status(500).send('internal server error');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

async function verifyCode(req, res) {
  try {
    const { accountId } = req.session;
    const { code } = req.body;

    const verified = await accountManagement.verifyCode(accountId, code);

    if (verified) {
      return res.status(200).send();
    } else {
      return res.status(500).send('internal server error');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('internal server error');
  }
}

async function deleteAccountValues(req, res) {
  try {
    const { accountId } = req.session;

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
  storeCode,
  verifyCode,
  deleteAccountValues
};
