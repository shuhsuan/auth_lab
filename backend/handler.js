const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dynamo } = require("./db");
const { GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const JWT_SECRET = process.env.JWT_SECRET;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

module.exports.getUsers = async () => {
  try {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: "Users"
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items)
    };
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch users" })
    };
  }
};

module.exports.login = async (event) => {
  console.log("JWT_SECRET_PROCESS:", process.env.JWT_SECRET);
   console.log("JWT_SECRET:", JWT_SECRET);
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    const result = await dynamo.send(
      new GetCommand({
        TableName: "Users",
        Key: { email }
      })
    );

    const user = result.Item;

    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" })
      };
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ token })
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};

////// turns out this one is unnecessary

module.exports.createUser = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name, email, and password are required" })
      };
    }

    const existingUser = await dynamo.send({
      TableName: "Users",
      Key: { email }
    });

    if (existingUser.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User already exists" })
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash
    };

    await dynamo.send(
      new PutCommand({
        TableName: "Users",
        Item: user
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "User created", user })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};

//////

module.exports.registerUser = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name, email, and/or password required" }),
      };
    }

    const existingUser = await dynamo.send(
      new GetCommand({
        TableName: "Users",
        Key: { email },
      })
    );

    if (existingUser.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User already exists" }),
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash,
    };

    await dynamo.send(
      new PutCommand({
        TableName: "Users",
        Item: newUser,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "User created", user: { id: newUser.id, name, email } }),
    };
  } catch (err) {
    console.error("CREATE USER ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};

