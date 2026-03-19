const { dynamo } = require("./db");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");

const users = [
  { id: "1", name: "Bob", email: "bob@gmail.com", passwordHash: await bcrypt.hash("123456", 10) },
  { id: "2", name: "HarV", email: "harv@gmail.com", passwordHash: await bcrypt.hash("678910", 10) }
];

const seedUsers = async () => {
  for (const user of users) {
    await dynamo.send(
      new PutCommand({
        TableName: "Users",
        Item: user
      })
    );
    console.log(`Inserted ${user.email}`);
  }
};

seedUsers();