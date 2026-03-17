'use client' //this is new :o next.js specific


import { useState, useEffect } from "react";
import "../styles.css"
import { User } from "@/lib/db";
import { useRouter } from "next/navigation";

// type User = {id: number, name: string, email: string}


export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [currentUser, setCurrentUser] = ()

  const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token){
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
      body: JSON.stringify({name, email})
    });

    setName("");
    setEmail("");

   if(res.ok){
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-row items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {users.map(user => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        ))}
        <div>
          <input id="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
          <input id="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <button onClick={createUser}>Create User</button>
        </div>

        <button onClick={getProfile}>Profile?</button>
      </main>
    </div>
  );
}
