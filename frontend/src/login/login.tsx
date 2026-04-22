import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import styles from './login.module.css';

export default function Login(){
    const authHook = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    function handleEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    return(
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <label htmlFor='email'>Email: </label>
                <input id='email' className='emailInput' type='email' value={email} onChange={handleEmail}></input>
                <label htmlFor='password'>Password: </label>
                <input id='password' type='password' className='passwordInput' value={password} onChange={handlePassword}></input>
                <button type='button' onClick={() => authHook.authActions.email.signin(email, password)}>Login</button>
                {authHook.isLoading ? <div className={styles.spinner}></div> : null}
            </div>
        </div>
    )
}
