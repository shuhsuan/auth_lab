"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import '../styles.css'

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const register = async () => {
        const res = await fetch("https://9t9772b858.execute-api.eu-west-2.amazonaws.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (data) {
            router.push("/")
        }
    }

    return (
        <div className="container">
            <div className="container_form">
                <h1>Register</h1>

                <div className="inputs">
                    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="buttons">
                    <button onClick={register}>Register</button>
                </div>
            </div>
        </div>
    )
}