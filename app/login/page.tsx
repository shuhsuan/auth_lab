"use clinet";

import { useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if(data.token){
            localStorage.setItem("token", data.token);
            alert("Logged in");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input placeholder = "Email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type = "password" placeholder = "Password" value = {password} onChange={(e) => {e.target.value}} />

            <button onClick={login}>Login</button>
        </div>
    )
}