import styles from './signup.module.css';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Signup(){
    const authHook = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    
    function handleEmail(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    function handleUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value);
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
                <button type='button' className='signupButton' onClick={() => authHook.authActions.email.signup(username, email, password)}>Sign Up</button>
                {authHook.isLoading ? <div className={styles.spinner}></div> : null}
            </div>
        </div>
    )
}
