import styles from './home.module.css';
import { authClient } from '../lib/auth-client';
import { useNavigate } from 'react-router';

export default function Home(){
    const navigate = useNavigate();


    async function signout(){
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigate('/login');
                }
            }
        });
        await authClient.revokeSession({
            token: "session-token"
        });
    }
    
    return(
        <div className={styles.pageContainer}>
            <h1 className={styles.homeHeader}>Home</h1>
            <button type='button' onClick={() => signout()}>sign out</button>
        </div>
    )
}
