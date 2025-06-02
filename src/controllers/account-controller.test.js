const accountController = require('./account-controller');

const { SecureStorage } = require('@mondaycom/apps-sdk');

const secureStorage = new SecureStorage();

const bcrypt = require('bcrypt');


// initialize controller functions
const { 
  storeCode,
  verifyCode,
  deleteAccountValues
} = accountController;

// test data
const testData = require('./controller.test-data');

const { account1Data } = testData;
const { account2Data } = testData;

const { account1Id } = testData;
const { testUser } = testData;
const { testValidCode } = testData;
const { testInvalidCode } = testData;


const sessionUser = {accountId: account1Id, userId: testUser.id};

const setUpCode = account1Data[7];

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

  test('storeCode', async () => {
    const req = {
      session: sessionUser,
      body: {
        code: testValidCode,
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await storeCode(req, res);

    const codeHashAfter = await secureStorage.get(setUpCode.key);
    const codeStored = await bcrypt.compare(testValidCode, codeHashAfter);

    expect(codeStored).toBe(true);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

  test('verifyCode when code not set', async () => {
    const req = {
      session: sessionUser,
      body: {
        code: testValidCode
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await verifyCode(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
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

  test('verifyCode when correct code sent', async () => {
    // testCode is plaintext, convert to hash
    const salt = await bcrypt.genSalt();
    const codeHashValue = await bcrypt.hash(setUpCode.value, salt);
    await secureStorage.set(setUpCode.key, codeHashValue);
    
    const req = {
      session: sessionUser,
      body: {
        code: testValidCode
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await verifyCode(req, res);

    // nothing to delete, just test success status
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

  test('verifyCode when incorrect code sent', async () => {
    // testCode is plaintext, convert to hash
    const salt = await bcrypt.genSalt();
    const codeHashValue = await bcrypt.hash(setUpCode.value, salt);
    await secureStorage.set(setUpCode.key, codeHashValue);
    
    const req = {
      session: sessionUser,
      body: {
        code: testInvalidCode
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await verifyCode(req, res);

    // nothing to delete, just test success status
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
  });

})