"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import './styles.css'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {
    const res = await fetch("https://9t9772b858.execute-api.eu-west-2.amazonaws.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      // alert("Logged in");
      router.push("/dashboard")
    }
  };

  // const login = async () => {
  //   try{

  //   }
  // }

  const register = () => {
    router.push("/register")
  }

  return (
    <div className="container">
    <div className="container_form">
      <h1>Login</h1>

      <div className="inputs">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="buttons">
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    </div>
    </div>
  )
}