const { SecureStorage } = require('@mondaycom/apps-sdk');
const accountManagement = require('./account-management');
const itemManagement = require('./item-management');

const secureStorage = new SecureStorage();

const { exportedForTesting } = accountManagement;

// initialize testing functions
const { 
  getIndexKey,
  getIndex,
  deleteIndex,
} = exportedForTesting;

const {
  deleteAccountValues,
  updateIndex
} = accountManagement;

// test data
const testData = require('./management.test-data');
const { account1Data } = testData;
const { account2Data } = testData;

const testAccountId = "27658948";
const testUser = {id: "81146743", name: "Johnny Black"};
const testItemId = "4003520369";

const indexKey = account1Data[0].key;
const indexValue = account1Data[0].value;

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

  test('getIndexKey', () => {
    expect(getIndexKey(testAccountId)).toBe("account.27658948.index");
  });

  test('getIndex', async () => {
    const index = await getIndex(testAccountId);
    expect(index).toEqual({ itemIds: [] });
  });

  test('updateIndex', async () => {
    const indexBefore = await secureStorage.get(indexKey);

    expect(indexBefore).toBeNull();
    
    const successful = await updateIndex(testAccountId, testItemId);
    const indexAfter = await secureStorage.get(indexKey);

    expect(successful).toBe(true);
    expect(indexAfter).toEqual({itemIds: [testItemId]});
  });

  test('deleteAccountValues', async () => {
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

  test('getIndex', async () => {
    const index = await getIndex(testAccountId);
    expect(index).toEqual(indexValue);
  });

  test('deleteIndex', async () => {
    const indexBefore = await secureStorage.get(indexKey);

    expect(indexBefore).toEqual(indexValue);
    
    const successful = await deleteIndex(testAccountId);
    const indexAfter = await secureStorage.get(indexKey);

    expect(successful).toBe(true);
    expect(indexAfter).toBeNull();
  });

  test('deleteAccountValues', async () => {  
    await expectUnchanged(account1Data);
  
    const successful = await deleteAccountValues(testAccountId);
    
    expect(successful).toBe(true);
    await expectEmpty(account1Data);
  });

});