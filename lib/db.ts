//temporary db to test backend functions locally, not exposing passwords or logic like this in a real project

export type User = {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

export const users = [
    { id: 1, name: "Bob", email: "bob@gmail.com", passwordHash: "" },
    { id: 2, name: "Harvey", email: "harv@gmail.com", passwordHash: ""}
];