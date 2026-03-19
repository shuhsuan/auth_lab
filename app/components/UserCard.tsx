import '../styles.css'

type Props = {
    id: number,
    name: string,
    email: string
    onClick: (email: string) => void;
}

export default function UserCard({id, name, email, onClick}: Props){
    return(
        <div className="card" onClick={() => onClick(email)}>
            <p>User Id: {id}</p>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
        </div>
    )
}