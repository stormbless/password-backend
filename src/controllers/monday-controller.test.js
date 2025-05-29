const mondayController = require('./monday-controller');

const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();


// initialize controller functions
const { 
  storePassword,
  getPassword,
  getChangeHistory,
  deleteAccountValues
} = mondayController;

// test data
const testData = require('./monday-controller.test-data');

const { account1Data } = testData;
const { account2Data } = testData;

const { account1Id } = testData;
const { testUser } = testData;
const { testItemId } = testData;
const { testPassword } = testData;

const sessionUser = {accountId: account1Id, userId: testUser.id};

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

// stores test password using sessionUser, testItemId, testPassword and testUser.name
// tests whether password and change history correctly update
async function testStorePassword() {
  const req = {
      session: sessionUser,
      body: {
        itemId: testItemId,
        password: testPassword,
        changedBy: testUser.name
      }
    };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
  let changeHistoryBefore = await secureStorage.get(account1Data[4].key);
  if (!changeHistoryBefore) { changeHistoryBefore = []; }
  const timeBefore = Date.now();

  await storePassword(req, res);
  
  const timeAfter = Date.now();
  const passwordAfter = await secureStorage.get(account1Data[1].key);
  const changeHistoryAfter = await secureStorage.get(account1Data[4].key);
  
  expect(passwordAfter).toBe(testPassword);
  expectChangeHistoryUpdated(changeHistoryBefore, changeHistoryAfter, testUser, timeBefore, timeAfter);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalled();
}

// tests either get getPassword or getChangeHistory
async function testGet(callback, expectedValue) {
  const req = {
    session: sessionUser,
    query: {
      itemId: testItemId,
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };

  await callback(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(expectedValue);
}

// expect account2 values haven't changed after every test (all tests interact with account 1)
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
    await tearDownAccount1();
  })
  
  test('storePassword', async () => {
    await testStorePassword();
  })

  test('getPassword', async () => {
    expectedPassword = "";
    await testGet(getPassword, expectedPassword)
  });

  test('getChangeHistory', async () => {
    expectedChangeHistory = [];
    await testGet(getChangeHistory, expectedChangeHistory);
  });

  test('deleteAccountValues', async () => {
    const req = {
      session: sessionUser
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await deleteAccountValues(req, res);

    // nothing to delete, just test success status
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });
})


describe('Account 1 SETUP', () => {
  beforeAll(async () => {
    await tearDownAccount1();
  });
  
  beforeEach(() => {
    setUpAccount1();
  });
  afterEach(() => {
    tearDownAccount1();
  });

  test('storePassword', async () => {
    await testStorePassword();
  })

  test('getPassword', async () => {
    await testGet(getPassword, account1Data[1].value)
  });

  test('getChangeHistory', async () => {
    await testGet(getChangeHistory, account1Data[4].value)
  });

  
  test('deleteAccountValues', async () => {
    const req = {
      session: sessionUser
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    let accountValues = [];
  
    await expectUnchanged(account1Data);
  
    await deleteAccountValues(req, res);
    
    await expectEmpty(account1Data);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

})