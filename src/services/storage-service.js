const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();

// ..............................PRIVATE METHODS................................


function getPasswordKey(accountId, itemId) {
  return `account.${accountId}.item.${itemId}.password`;
}

function getChangeHistoryKey(accountId, itemId) {
  return `account.${accountId}.item.${itemId}.changeHistory`;
}

function getIndexKey(accountId) {
  return `account.${accountId}.index`;
}

// returns account index of itemIds
async function getIndex(accountId) {
  const key = getIndexKey(accountId);
  index = await secureStorage.get(key);

  if (!index) {
    index = { itemIds: [] };
  }

  return index;
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

async function deleteItem(accountId, itemId) {
  passSuccessful = await deletePassword(accountId, itemId);
  histSuccessful = await deleteChangeHistory(accountId, itemId);

  deleteSuccessful = (passSuccessful && histSuccessful);

  return deleteSuccessful;
}

async function deleteIndex(accountId) {
  const key = getIndexKey(accountId);

  deleteSuccessful = await secureStorage.delete(key);

  return deleteSuccessful;
}

// updates an account's index with a new item (if not already in)
// index required for deleting account values
const updateIndex = async (accountId, itemId) => {
  const key = getIndexKey(accountId);
  const prevIndex = await getIndex(accountId);

  // return early if item already in index
  if (prevIndex.itemIds.includes(itemId)) {return true;}

  // otherwise add to index
  const newIndex = { itemIds: [...prevIndex.itemIds, itemId] };

  const indexSuccessful = await secureStorage.set(key, newIndex);

  return indexSuccessful;
}



// ..............................PUBLIC METHODS................................


// deletes all account values using account index, should do on app uninstall
const deleteAccountValues = async (accountId) => {
  const index = await getIndex(accountId);

  let itemsSuccessful = true;

  for (let itemId of index.itemIds) {
    let itemSuccessful = await deleteItem(accountId, itemId);
    if (!itemSuccessful) {
      itemsSuccessful = false;
    }
  };

  const indexSuccessful = deleteIndex(accountId);

  return (indexSuccessful && itemsSuccessful);
}

const storePassword = async (accountId, itemId, password) => {
  const key = getPasswordKey(accountId, itemId);
    
  const passSuccessful = await secureStorage.set(key, password);
  const indexSuccessful = await updateIndex(accountId, itemId);

  return (passSuccessful && indexSuccessful);
}

const getPassword = async (accountId, itemId) => {
  const key = getPasswordKey(accountId, itemId);
  
  let password = await secureStorage.get(key);

  console.log('storageservice getpassword passwords:')
  console.log(password);
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
  
  const histSuccessful = await secureStorage.set(key, newChangeHistory);
  const indexSuccessful = await updateIndex(accountId, itemId);

  return (histSuccessful && indexSuccessful);
}

module.exports = {
  deleteAccountValues,
  storePassword,
  getPassword,
  getChangeHistory,
  updateChangeHistory,
};

// private functions only exported if in test environment (used for unit testing)

const exportedForTesting = {
  getPasswordKey,
  getChangeHistoryKey,
  getIndexKey,
  getIndex,
  deletePassword,
  deleteChangeHistory,
  deleteItem,
  deleteIndex,
  updateIndex
};

if (process.env.NODE_ENV === "test") {
  module.exports.exportedForTesting = exportedForTesting;
}
