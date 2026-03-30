import { authClient } from "../lib/auth-client";
import { useState } from "react";
import { useNavigate } from "react-router";
import styles from './login.module.css';

export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    
    function handleEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    async function attemptLogin(email: string, password: string){
        await authClient.signIn.email({
            email,
            password,
            rememberMe: false
        },
        {
            onRequest: () => { 
                setIsLoading(true);
            },
            onSuccess: () => {
                setIsLoading(false);
                navigate('/home');
            },
            onError: (ctx) => {
                setIsLoading(false);
                alert(ctx.error.message);
            },
        });
    }

    return(
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <label htmlFor='email'>Email: </label>
                <input id='email' className='emailInput' type='email' value={email} onChange={handleEmail}></input>
                <label htmlFor='password'>Password: </label>
                <input id='password' type='password' className='passwordInput' value={password} onChange={handlePassword}></input>
                <button type='button' onClick={() => attemptLogin(email, password)}>Login</button>
                {isLoading ? <div className={styles.spinner}></div> : null}
            </div>
        </div>
    )
}
