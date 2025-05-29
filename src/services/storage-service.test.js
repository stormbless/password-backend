const { SecureStorage } = require('@mondaycom/apps-sdk');
const storageService = require('./storage-service');

const secureStorage = new SecureStorage();

const { exportedForTesting } = storageService;

// initialize testing functions
const { 
  getPasswordKey,
  getChangeHistoryKey,
  getIndexKey,
  getIndex,
  deletePassword,
  deleteChangeHistory,
  deleteItem,
  deleteIndex,
  updateIndex 
} = exportedForTesting;

const {
  deleteAccountValues,
  storePassword,
  getPassword,
  getChangeHistory,
  updateChangeHistory,
} = storageService;

// test data
const testData = require('./storage-service.test-data');
const { account1Data } = testData;
const { account2Data } = testData;

const testAccountId = "27658948";
const testUser = {id: "81146743", name: "Johnny Black"};
const testItemId = "4003520369";

// setup and teardown functions

async function setUpAccount1() {
  for (let instance of account1Data) {
    await secureStorage.set(instance.key, instance.value);
  }
}

async function tearDownAccount1() {
  for (let instance of account1Data) {
    await secureStorage.delete(instance.key);
  }
}

async function setUpAccount2() {
  for (let instance of account2Data) {
    await secureStorage.set(instance.key, instance.value);
  }
}

async function tearDownAccount2() {
  for (let instance of account2Data) {
    await secureStorage.delete(instance.key);
  }
}

// testing functions

// verifies dataset unchanged in secureStorage
async function expectUnchanged(dataSet) {
  let accountValues = [];
  for (let i = 0; i < dataSet.length; i++) {
    accountValues[i] = await secureStorage.get(dataSet[i].key);
    expect(accountValues[i]).toEqual(dataSet[i].value);
  }
}

// verifies dataset empty in secureStorage
async function expectEmpty(dataSet) {
  let accountValues = [];
  for (let i = 0; i < dataSet.length; i++) {
    accountValues[i] = await secureStorage.get(dataSet[i].key);
    expect(accountValues[i]).toBeNull();
  }
}

function expectChangeInRange(newChange, before, after) {
  const newChangeinTimeRange = (
    newChange.datetimeChanged >= before && 
    newChange.datetimeChanged <= after
  );
  expect(newChangeinTimeRange).toBe(true);
}

function expectChangeHistoryUpdated(oldChangeHistory, newChangeHistory, 
  expectedUser, timeBefore, timeAfter) {
  const newChange = newChangeHistory[0];
  const restOfChangeHistory = newChangeHistory.slice(1);
  
  expect(newChange.user).toEqual(expectedUser);
  expectChangeInRange(newChange, timeBefore, timeAfter);
  expect(restOfChangeHistory).toEqual(oldChangeHistory);
}

async function testUpdateChangeHistory() {
  let changeHistoryBefore = await secureStorage.get(account1Data[4].key);
  if (!changeHistoryBefore) {changeHistoryBefore = [];}
  const timeBefore = Date.now();
  
  const successful = await updateChangeHistory(testAccountId, testItemId, testUser);
  
  const timeAfter = Date.now();
  const changeHistoryAfter = await secureStorage.get(account1Data[4].key);

  expectChangeHistoryUpdated(changeHistoryBefore, changeHistoryAfter, testUser, timeBefore, timeAfter);
  expect(successful).toBe(true);
}

// verify account2 values haven't changed after every test (all tests interact with account 1)
beforeEach(async () => {
  await setUpAccount2();
});
  
afterEach(async () => {
  await expectUnchanged(account2Data);
  await tearDownAccount2();
});


// TESTS

describe('Account 1 NOT SETUP', () => {
  beforeEach(async () => {
    await tearDownAccount1;
  })

  test('getPasswordKey', () => {
    expect(getPasswordKey(testAccountId, testItemId)).toBe("account.27658948.item.4003520369.password");
  });

  test('getChangeHistoryKey', () => {
    expect(getChangeHistoryKey(testAccountId, testItemId)).toBe("account.27658948.item.4003520369.changeHistory");
  });

  test('getIndexKey', () => {
    expect(getIndexKey(testAccountId)).toBe("account.27658948.index");
  });

  test('getIndex when index not set', async () => {
    const index = await getIndex(testAccountId);
    expect(index).toEqual({ itemIds: [] });
  });

  test('updateIndex when index value not set', async () => {
    const indexBefore = await secureStorage.get(account1Data[0].key);

    expect(indexBefore).toBeNull();
    
    const successful = await updateIndex(testAccountId, testItemId);
    const indexAfter = await secureStorage.get(account1Data[0].key);

    expect(successful).toBe(true);
    expect(indexAfter).toEqual({itemIds: [testItemId]});
  });

  test('getPassword when password value not set', async () => {    
    const password = await getPassword(testAccountId, testItemId);

    expect(password).toBe("");
  });

  test('storePassword when password value not set', async () => {    
    const passwordBefore = await secureStorage.get(account1Data[1].key);
    expect(passwordBefore).toBeNull();
    
    const successful = await storePassword(testAccountId, testItemId, account1Data[1].value);
    const passwordAfter = await secureStorage.get(account1Data[1].key);

    expect(successful).toBe(true);
    expect(passwordAfter).toEqual(account1Data[1].value);
  });

  test('getChangeHistory when changeHistory value not set', async () => {    
    const changeHistory = await getChangeHistory(testAccountId, testItemId);

    expect(changeHistory).toEqual([]);
  });

  test('updateChangeHistory when changeHistory value not set', async () => {    
    await testUpdateChangeHistory();
  });

  test('deleteAccountValues when account values not set', async () => {
    const successful = await deleteAccountValues(testAccountId);
    expect(successful).toBe(true);
  });
})


//Tests for when account 1 data is set

describe('Account 1 SETUP', () => {
  beforeAll(async () => {
    await tearDownAccount1();
  });
  
  beforeEach(async () => {
    await setUpAccount1();
  });
  afterEach(async() => {
    await tearDownAccount1();
  });

  test('getIndex when index set', async () => {
    const index = await getIndex(testAccountId);
    expect(index).toEqual(account1Data[0].value);
  });

  
  test('deletePassword when password value set', async () => {
    const passwordBefore = await secureStorage.get(account1Data[1].key);

    expect(passwordBefore).toEqual(account1Data[1].value);
    
    const successful = await deletePassword(testAccountId, testItemId);
    const passwordAfter = await secureStorage.get(account1Data[1].key);

    expect(successful).toBe(true);
    expect(passwordAfter).toBeNull();
  });

  test('deleteChangeHistory when changeHistory value set', async () => {
    const changeHistoryBefore = await secureStorage.get(account1Data[4].key);

    expect(changeHistoryBefore).toEqual(account1Data[4].value);
    
    const successful = await deleteChangeHistory(testAccountId, testItemId);
    const changeHistoryAfter = await secureStorage.get(account1Data[4].key);

    expect(successful).toBe(true);
    expect(changeHistoryAfter).toBeNull();
  });

  test('deleteItem when password and changeHistory value set', async () => {
    const passwordBefore = await secureStorage.get(account1Data[1].key);
    const changeHistoryBefore = await secureStorage.get(account1Data[4].key);

    expect(passwordBefore).toEqual(account1Data[1].value);
    expect(changeHistoryBefore).toEqual(account1Data[4].value);

    const successful = await deleteItem(testAccountId, testItemId);
    const passwordAfter = await secureStorage.get(account1Data[1].key);
    const changeHistoryAfter = await secureStorage.get(account1Data[4].key);

    expect(successful).toBe(true);
    expect(passwordAfter).toBeNull();
    expect(changeHistoryAfter).toBeNull();
  });

  test('deleteIndex when index value set', async () => {
    const indexBefore = await secureStorage.get(account1Data[0].key);

    expect(indexBefore).toEqual(account1Data[0].value);
    
    const successful = await deleteIndex(testAccountId);
    const indexAfter = await secureStorage.get(account1Data[0].key);

    expect(successful).toBe(true);
    expect(indexAfter).toBeNull();
  });

  test('getPassword when password value set', async () => {    
    const password = await getPassword(testAccountId, testItemId);

    expect(password).toBe(account1Data[1].value);
  });

  test('getChangeHistory when changeHistory value set', async () => {    
    const changeHistory = await getChangeHistory(testAccountId, testItemId);

    expect(changeHistory).toEqual(account1Data[4].value);
  });

  test('updateChangeHistory when changeHistory value set', async () => {    
    await testUpdateChangeHistory();
  });
  
  test('deleteAccountValues when account values set', async () => {  
    await expectUnchanged(account1Data);
  
    const successful = await deleteAccountValues(testAccountId);
    
    expect(successful).toBe(true);
    await expectEmpty(account1Data);
  });

});