'use client' //this is new :o next.js specific


import { useState, useEffect } from "react";
import "../styles.css"
import { User } from "@/lib/db";
import { useRouter } from "next/navigation";
import UserCard from "../components/UserCard";

// type User = {id: number, name: string, email: string}


export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<User>()
  const [password, setPassword] = useState("temporary")

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }
  }, [])

  const getUsers = async () => {
    const res = await fetch("https://9t9772b858.execute-api.eu-west-2.amazonaws.com/users");
    const usersRes = await res.json();
    setUsers(usersRes);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const createUser = async () => {
    const res = await fetch("https://9t9772b858.execute-api.eu-west-2.amazonaws.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password })
    });

    setName("");
    setEmail("");

    if (res.ok) {
      await getUsers()
    }

  }

  const getProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCurrentUser(data.user)

    console.log(data.user)
  }



  return (
    <div className="container">
      <div className="dashboard_container">
        <div className="card_container">
          {users.map(user => (
            <UserCard key={user.id} id={user.id} name={user.name} email={user.email} />
          ))}
        </div>

        <div className="container_form">
          <h1>New Profile</h1>
          <div className="inputs">
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="buttons">
            <button onClick={createUser}>Create User</button>
          </div>
        </div>

        <div className="single_button_container">
          <button onClick={getProfile}>Get my profile</button>
        </div>

        {currentUser? (
          <div className="card_container">
          <UserCard key={currentUser.id} id={currentUser.id} name={currentUser.name} email={currentUser.email}/> 
          </div>
        ) : null}
      </div>
    </div>
  );
}
