
import { useEffect, useState } from "react";
import styles from "./Users.module.css";
import { getUsers } from "../../../services/users.services";



export const Users = () => {
    const[users,setUsers]=useState([])
    async function obtenerUsers(){
        const response= await getUsers()
        console.log(response)
        setUsers(response)
        
    }
    useEffect(()=>{
        obtenerUsers()

    },[])
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Usuarios</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Alta</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span
                    className={
                      user.role === "admin" ? styles.roleAdmin : styles.roleUser
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td>{user.createdAt}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn}>Editar</button>
                  <button className={styles.actionBtnDanger}>Bloquear</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
