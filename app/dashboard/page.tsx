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
  // const [currentUser, setCurrentUser] = ()

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }
  }, [])

  const getUsers = async () => {
    const res = await fetch('/api/users');
    const usersRes = await res.json();
    setUsers(usersRes);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const createUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email })
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
    console.log(data);
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

        <div className="buttons">
          <button onClick={getProfile}>Get my profle</button>
        </div>
      </div>
    </div>
  );
}
