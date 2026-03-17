"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password})
        });

        const data = await res.json();
    }

    return(
        <div>
            <h1>Register</h1>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button onClick={register}>Register</button>
        </div>
    )
}