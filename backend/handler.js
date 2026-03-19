const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dynamo } = require("./db");
const { GetCommand, PutCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
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

////

module.exports.getProfile = async (event) => {
  try{
    const authHeader = event.headers.authorization || event.headers.Authorization;

    console.log(authHeader)

    if(!authHeader){
      return{
        statusCode: 401,
        headers,
        body: JSON.stringify({error: "No token provided"}),
      };
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await dynamo.send(
      new GetCommand({
        TableName: "Users",
        Key: { email: decoded.email },
      })
    );

    const user = result.Item;

    if(!user){
      return{
        statusCode: 404,
        headers,
        body: JSON.stringify({error: "User not found"}),
      };
    }

    return{
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);

    return{
      statusCode: 401,
      headers,
      body: JSON.stringify({error: "Invalid token"})
    }
  }
}

/////

module.exports.deleteProfile = async (event) => {
  try{
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if(!authHeader){
      return{
        statusCode: 401,
        headers,
        body: JSON.stringify({error: "No token provided"}),
      };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const body = JSON.parse(event.body);
    const {email} = body;

        console.log("deleting: " + email)

    if(!email){
      return{
        statusCode: 400,
        headers,
        body: JSON.stringify({error: "Email required"})
      }
    }

    await dynamo.send(
      new DeleteCommand({
        TableName: "Users",
        Key: {email},
      })
    );

    return{
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "User deleted" }),
    };
  } catch (err) {
    console.error("Delete profile erorr: ", err);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({error: "Server error"})
    }
  }
}

