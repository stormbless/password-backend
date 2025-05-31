const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();

// ..............................PRIVATE METHODS................................


function getPasswordKey(accountId, itemId) {
  return `account.${accountId}.item.${itemId}.password`;
}

function getChangeHistoryKey(accountId, itemId) {
  return `account.${accountId}.item.${itemId}.changeHistory`;
}

async function deletePassword(accountId, itemId) {
  const key = getPasswordKey(accountId, itemId);

  deleteSuccessful = await secureStorage.delete(key);
  return deleteSuccessful;
}

async function deleteChangeHistory(accountId, itemId) {
  const key = getChangeHistoryKey(accountId, itemId);

  deleteSuccessful = await secureStorage.delete(key);

  return deleteSuccessful;
}



// ..............................PUBLIC METHODS................................

const storePassword = async (accountId, itemId, password) => {
  const key = getPasswordKey(accountId, itemId);
  
  const successful = await secureStorage.set(key, password);
  
  return successful;
}

const getPassword = async (accountId, itemId) => {
  const key = getPasswordKey(accountId, itemId);
  
  let password = await secureStorage.get(key);
  
  if (!password) {
    password = "";
  }
  console.log(password);
  return password;
}

const getChangeHistory = async (accountId, itemId) => {
  const key = getChangeHistoryKey(accountId, itemId);
  
  let changeHistory = await secureStorage.get(key);
  if (!changeHistory) {
    changeHistory = [];
  }
  
  return changeHistory;
}

const updateChangeHistory = async (accountId, itemId, user) => {
  const key = getChangeHistoryKey(accountId, itemId);
  
  const prevChangeHistory = await getChangeHistory(accountId, itemId);
  
  const datetimeChanged = Date.now();
  
  const newChangeHistory = [ {datetimeChanged, user}, ...prevChangeHistory ];
  
  const updateSuccessful = await secureStorage.set(key, newChangeHistory);
  
  return updateSuccessful;
}

const deleteItem = async (accountId, itemId) => {
  passSuccessful = await deletePassword(accountId, itemId);
  histSuccessful = await deleteChangeHistory(accountId, itemId);

  deleteSuccessful = (passSuccessful && histSuccessful);

  return deleteSuccessful;
}

module.exports = {
  storePassword,
  getPassword,
  getChangeHistory,
  updateChangeHistory,
  deleteItem,
};

// private functions only exported if in test environment (used for unit testing)

const exportedForTesting = {
  getPasswordKey,
  getChangeHistoryKey,
  deletePassword,
  deleteChangeHistory,
};

if (process.env.NODE_ENV === "test") {
  module.exports.exportedForTesting = exportedForTesting;
}
