const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();

const itemManagement = require('./item-management.js');

// ..............................PRIVATE METHODS................................

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

async function deleteIndex(accountId) {
  const key = getIndexKey(accountId);

  deleteSuccessful = await secureStorage.delete(key);

  return deleteSuccessful;
}

// ..............................PUBLIC METHODS................................

// updates an account's index with a new item (if not already in)
// index required for deleting account values
const updateIndex = async (accountId, itemId) => {
  const key = getIndexKey(accountId);
  const prevIndex = await getIndex(accountId);

  // return early if item already in index
  if (prevIndex.itemIds.includes(itemId)) {return true;}

  // otherwise add to index
  const newIndex = { itemIds: [...prevIndex.itemIds, itemId] };

  const updateSuccessful = await secureStorage.set(key, newIndex);

  return updateSuccessful;
}

// deletes all account values using account index, should do on app uninstall
const deleteAccountValues = async (accountId) => {
  const index = await getIndex(accountId);

  let itemsSuccessful = true;

  for (let itemId of index.itemIds) {
    let itemSuccessful = await itemManagement.deleteItem(accountId, itemId);
    if (!itemSuccessful) {
      itemsSuccessful = false;
    }
  };

  const indexSuccessful = deleteIndex(accountId);

  return (indexSuccessful && itemsSuccessful);
}

module.exports = {
  updateIndex,
  deleteAccountValues
}

// private functions only exported if in test environment (used for unit testing)

const exportedForTesting = {
  getIndexKey,
  getIndex,
  deleteIndex,
};

if (process.env.NODE_ENV === "test") {
  module.exports.exportedForTesting = exportedForTesting;
}
