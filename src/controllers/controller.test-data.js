
// test data for monday-controller.test
const account1Id = "37658948";
const testUser = {id: "81146743", name: "Johnny Black"};
const testPassword = "password";
const testItemId = "4003520369";
const testValidCode = "123456789";
const testInvalidCode = "987654321";
const account1Data = [
  {key: `account.${account1Id}.index`, value: { itemIds: [testItemId, "4003329369", "6003329369"] } },
  {key: `account.${account1Id}.item.${testItemId}.password`, value: "1password" },
  {key: `account.${account1Id}.item.4003329369.password`, value: "2password" },
  {key: `account.${account1Id}.item.6003329369.password`, value: "3password" },
  {key: `account.${account1Id}.item.${testItemId}.changeHistory`, value: [ 
    { datetimeChanged: 1748342585186, user: {id: testUser.id, name: "Alexander Green"} },
    { datetimeChanged: 1728342585186, user: {id: testUser.id, name: "John Smith"} },
    { datetimeChanged: 1718342585186, user: {id: testUser.id, name: "Alexis Zora"} }
  ]},
  {key: `account.${account1Id}.item.4003329369.changeHistory`, value: [ 
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Tom Green"} },
    { datetimeChanged: 1717342585186, user: {id: testUser.id, name: "Jessica Smith"} },
    { datetimeChanged: 1716342585186, user: {id: testUser.id, name: "Samantha Zora"} }
  ]},
  {key: `account.${account1Id}.item.6003329369.changeHistory`, value: [ 
    { datetimeChanged: 1758342585186, user: {id: testUser.id, name: "Bron Green"} },
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Jaime Smith"} },
    { datetimeChanged: 1738242585186, user: {id: testUser.id, name: "Hannah Zora"} }
  ]},
  {key: `account.${account1Id}.code`, value: testValidCode},
];

const account2Id = "57658948";
const account2Data = [
  {key: `account.${account2Id}.index`, value: { itemIds: ["4003520369", "4003329369", "6003329369"] } },
  {key: `account.${account2Id}.item.4003520369.password`, value: "1password" },
  {key: `account.${account2Id}.item.4003329369.password`, value: "2password" },
  {key: `account.${account2Id}.item.6003329369.password`, value: "3password" },
  {key: `account.${account2Id}.item.4003520369.changeHistory`, value: [ 
    { datetimeChanged: 1748342585186, user: {id: testUser.id, name: "Alexander Green"} },
    { datetimeChanged: 1728342585186, user: {id: testUser.id, name: "John Smith"} },
    { datetimeChanged: 1718342585186, user: {id: testUser.id, name: "Alexis Zora"} }
  ]},
  {key: `account.${account2Id}.item.4003329369.changeHistory`, value: [ 
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Tom Green"} },
    { datetimeChanged: 1717342585186, user: {id: testUser.id, name: "Jessica Smith"} },
    { datetimeChanged: 1716342585186, user: {id: testUser.id, name: "Samantha Zora"} }
  ]},
  {key: `account.${account2Id}.item.6003329369.changeHistory`, value: [ 
    { datetimeChanged: 1758342585186, user: {id: testUser.id, name: "Bron Green"} },
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Jaime Smith"} },
    { datetimeChanged: 1738242585186, user: {id: testUser.id, name: "Hannah Zora"} }
  ]},
];

module.exports = {
  account1Id,
  testItemId,
  testPassword,
  testUser,
  account1Data,
  account2Data,
  testValidCode,
  testInvalidCode,
};