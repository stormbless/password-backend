// test data for storage-service.test
const testUser = {id: "81146743", name: "Johnny Black"};
const account1Data = [
  {key: "account.27658948.index", value: { itemIds: ["4003520369", "4003329369", "6003329369"] } },
  {key: "account.27658948.item.4003520369.password", value: "1password" },
  {key: "account.27658948.item.4003329369.password", value: "2password" },
  {key: "account.27658948.item.6003329369.password", value: "3password" },
  {key: "account.27658948.item.4003520369.changeHistory", value: [ 
    { datetimeChanged: 1748342585186, user: {id: testUser.id, name: "Alexander Green"} },
    { datetimeChanged: 1728342585186, user: {id: testUser.id, name: "John Smith"} },
    { datetimeChanged: 1718342585186, user: {id: testUser.id, name: "Alexis Zora"} }
  ]},
  {key: "account.27658948.item.4003329369.changeHistory", value: [ 
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Tom Green"} },
    { datetimeChanged: 1717342585186, user: {id: testUser.id, name: "Jessica Smith"} },
    { datetimeChanged: 1716342585186, user: {id: testUser.id, name: "Samantha Zora"} }
  ]},
  {key: "account.27658948.item.6003329369.changeHistory", value: [ 
    { datetimeChanged: 1758342585186, user: {id: testUser.id, name: "Bron Green"} },
    { datetimeChanged: 1738342585186, user: {id: testUser.id, name: "Jaime Smith"} },
    { datetimeChanged: 1738242585186, user: {id: testUser.id, name: "Hannah Zora"} }
  ]},
];

account2Id = "47658948";
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
  account1Data,
  account2Data
};