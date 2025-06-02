

const accountManagement = require('../services/account-management');

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
  deleteAccountValues
};
