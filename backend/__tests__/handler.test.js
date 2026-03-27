const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");


jest.mock("@aws-sdk/lib-dynamodb", () => ({
    DynamoDBDocumentClient: {
        from: jest.fn().mockReturnValue({ send: jest.fn() }),
    },
    GetCommand: jest.fn(),
    PutCommand: jest.fn(),
    DeleteCommand: jest.fn()
}));

jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn().mockReturnValue({})
}));

jest.mock("bcryptjs", () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

const handler = require("../handler");

const bcrypt = require("bcryptjs");

const JWT_SECRET = "test-secret"

describe("JWT Authentication", () => {
    let mockSend;

    beforeEach(() => {
        mockSend = DynamoDBDocumentClient.from().send;
        jest.clearAllMocks();
    })


it("login() returns a JWT token when credentials are valid", async() => {
    
    const fakeUser = {
        id: "12345",
        name: "Bob",
        email: "bob@me.com",
        passwordHash: "hashed-password"
    };

    mockSend.mockResolvedValueOnce({ Item: fakeUser });

    bcrypt.compare.mockResolvedValueOnce(true);

    const event = {
        body: JSON.stringify({ email: "bob@me.com", password: "secret" })
    };

    const response = await handler.login(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.token).toBeDefined();

    const decoded = jwt.verify(body.token, JWT_SECRET);
    expect(decoded.email).toBe("bob@me.com");
    expect(decoded.name).toBe("Bob");
});

it("getProfie() returns user data when given a valid JWT", async() => {
    
    const token = jwt.sign(
        {
            userId: "12345", name: "Bob", email: "bob@me.com"
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    const fakeUser = {
        id: "12345",
        name: "Bob",
        email: "bob@me.com"
    };

    mockSend.mockResolvedValueOnce({ Item: fakeUser });

    const event = {
        headers: {authorization: `Bearer ${token}`}
    };

    const response = await handler.getProfile(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.email).toBe("bob@me.com");
    expect(body.name).toBe("Bob");
});

it("getProfile() returns 401 when JWT is invalid", async() => {

    const event = {
        headers: {authorization: "Bearer this.is.just.a.dummy.token"}
    }

    const response = await handler.getProfile(event);

    expect(response.statusCode).toBe(401);
});

it("getProfile returns 401 when no Authorization header is provided", async () => {

    const event = {
        headers: {}
    };

    const response = await handler.getProfile(event);
    
    expect(response.statusCode).toBe(401);
});

})