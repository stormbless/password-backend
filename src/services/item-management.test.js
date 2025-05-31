const { SecureStorage } = require('@mondaycom/apps-sdk');
const itemManagement = require('./item-management');

const secureStorage = new SecureStorage();

const { exportedForTesting } = itemManagement;

// initialize functions being tested
const { 
  getPasswordKey,
  getChangeHistoryKey,
  deletePassword,
  deleteChangeHistory,
} = exportedForTesting;

const {
  storePassword,
  getPassword,
  getChangeHistory,
  updateChangeHistory,
  deleteItem
} = itemManagement;

// test data
const testData = require('./management.test-data');
const { account1Data } = testData;
const { account2Data } = testData;

const testAccountId = "27658948";
const testUser = {id: "81146743", name: "Johnny Black"};
const testItemId = "4003520369";

const passwordKey = account1Data[1].key;
const setUpPasswordValue = account1Data[1].value;

const changeHistory = account1Data[4];

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
  let changeHistoryBefore = await secureStorage.get(changeHistory.key);
  if (!changeHistoryBefore) {changeHistoryBefore = [];}
  const timeBefore = Date.now();
  
  const successful = await updateChangeHistory(testAccountId, testItemId, testUser);
  
  const timeAfter = Date.now();
  const changeHistoryAfter = await secureStorage.get(changeHistory.key);

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

  test('getPassword', async () => {    
    const password = await getPassword(testAccountId, testItemId);

    expect(password).toBe("");
  });

  test('storePassword', async () => {    
    const passwordBefore = await secureStorage.get(passwordKey);
    expect(passwordBefore).toBeNull();
    
    const successful = await storePassword(testAccountId, testItemId, setUpPasswordValue);
    const passwordAfter = await secureStorage.get(passwordKey);

    expect(successful).toBe(true);
    expect(passwordAfter).toEqual(setUpPasswordValue);
  });

  test('getChangeHistory', async () => {    
    const changeHistory = await getChangeHistory(testAccountId, testItemId);

    expect(changeHistory).toEqual([]);
  });

  test('updateChangeHistory', async () => {    
    await testUpdateChangeHistory();
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
  
  test('deletePassword', async () => {
    const passwordBefore = await secureStorage.get(passwordKey);

    expect(passwordBefore).toEqual(setUpPasswordValue);
    
    const successful = await deletePassword(testAccountId, testItemId);
    
    expect(successful).toBe(true);
    expectEmpty([{key: passwordKey}])
  });

  test('deleteChangeHistory', async () => {
    const changeHistoryBefore = await secureStorage.get(changeHistory.key);

    expect(changeHistoryBefore).toEqual(changeHistory.value);
    
    const successful = await deleteChangeHistory(testAccountId, testItemId);
    const changeHistoryAfter = await secureStorage.get(changeHistory.key);

    expect(successful).toBe(true);
    expect(changeHistoryAfter).toBeNull();
  });

  test('deleteItem', async () => {
    const passwordBefore = await secureStorage.get(passwordKey);
    const changeHistoryBefore = await secureStorage.get(changeHistory.key);

    expect(passwordBefore).toEqual(setUpPasswordValue);
    expect(changeHistoryBefore).toEqual(changeHistory.value);

    const successful = await deleteItem(testAccountId, testItemId);
    const passwordAfter = await secureStorage.get(passwordKey);
    const changeHistoryAfter = await secureStorage.get(changeHistory.key);

    expect(successful).toBe(true);
    expect(passwordAfter).toBeNull();
    expect(changeHistoryAfter).toBeNull();
  });

  test('getPassword', async () => {    
    const password = await getPassword(testAccountId, testItemId);

    expect(password).toBe(setUpPasswordValue);
  });

  test('getChangeHistory', async () => {    
    const gottenChangeHistory = await getChangeHistory(testAccountId, testItemId);

    expect(gottenChangeHistory).toEqual(changeHistory.value);
  });

  test('updateChangeHistory', async () => {    
    await testUpdateChangeHistory();
  });

});