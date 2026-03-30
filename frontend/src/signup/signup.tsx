import styles from './signup.module.css';
import { authClient } from '../lib/auth-client';
import { useNavigate } from 'react-router';
import { useState } from 'react';


export default function Signup(){
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    
    function handleEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    function handleUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value);
    }

    async function attemptSignUp(email: string, name: string, password: string){
        await authClient.signUp.email({
            email, // user email address
            password, // user password -> min 8 characters by default
            name, // user display name
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
                // display the error message
                setIsLoading(false);
                alert(ctx.error.message);
            },
        });
    }

    return(
        <div className={styles.pageContainer}>
            <div className={styles.signupContainer}>
                <label htmlFor='email'>Email: </label>
                <input id='email' className='emailInput' type='email' value={email} onChange={handleEmail}></input>
                <label htmlFor='username'>Username: </label>
                <input id='username' className='usernameInput' type='text' value={username} onChange={handleUsername}></input>
                <label htmlFor='password'>Password: </label>
                <input id='password' type='password' className='passwordInput' value={password} onChange={handlePassword}></input>
                <button type='button' onClick={() => attemptSignUp(email, username, password)}>Sign Up</button>
                {isLoading ? <div className={styles.spinner}></div> : null}
            </div>
        </div>
    )
}
