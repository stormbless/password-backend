const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();

const itemManagement = require('./item-management.js');

const bcrypt = require('bcrypt');


// ..............................PRIVATE METHODS................................

function getIndexKey(accountId) {
  return `account.${accountId}.index`;
}

function getCodeKey(accountId) {
  return `account.${accountId}.code`;
}

// returns account index of itemIds
async function getIndex(accountId) {
  const key = getIndexKey(accountId);
  let index = await secureStorage.get(key);

  if (!index) {
    index = { itemIds: [] };
  }

  return index;
}

async function deleteItems(accountId, itemIds) {
  let deleteSuccessful = true;

  for (let itemId of itemIds) {
    let itemSuccessful = await itemManagement.deleteItem(accountId, itemId);

    if (!itemSuccessful) {
      deleteSuccessful = false;
    }
  };

  return deleteSuccessful;
}

async function deleteCode(accountId) {
  const key = getCodeKey(accountId);

  const deleteSuccessful = await secureStorage.delete(key);

  return deleteSuccessful;
}

async function deleteIndex(accountId) {
  const key = getIndexKey(accountId);

  const deleteSuccessful = await secureStorage.delete(key);

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

const storeCode = async (accountId, code) => {
  const key = getCodeKey(accountId);

  const salt = await bcrypt.genSalt();
  const codeHash = await bcrypt.hash(code, salt);

  const successful = await secureStorage.set(key, codeHash);

  return successful;
}

const verifyCode = async (accountId, code) => {
  const key = getCodeKey(accountId);

  const codeHash = await secureStorage.get(key);

  // return early if account's password access code not yet set
  if (!codeHash) {return false;}

  verified = await bcrypt.compare(code, codeHash); 

  return verified;
}

// deletes all account values using account index, should do on app uninstall
const deleteAccountValues = async (accountId) => {
  const index = await getIndex(accountId);
  
  const itemsSuccessful = await deleteItems(accountId, index.itemIds);
  const codeSuccessful = await deleteCode(accountId);
  const indexSuccessful = await deleteIndex(accountId);

  const deleteSuccessful = (itemsSuccessful && codeSuccessful && indexSuccessful);

  return deleteSuccessful;
}

module.exports = {
  updateIndex,
  storeCode,
  verifyCode,
  deleteAccountValues
}

// private functions only exported if in test environment (used for unit testing)

const exportedForTesting = {
  getIndexKey,
  getIndex,
  deleteIndex,
};

// if (process.env.NODE_ENV === "test") {
//   module.exports.exportedForTesting = exportedForTesting;
// }
