import '../styles.css'

type Props = {
    id: number,
    name: string,
    email: string
}

export default function UserCard({id, name, email}: Props){
    return(
        <div className="card">
            <p>User Id: {id}</p>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
        </div>
    )
}