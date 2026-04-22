import styles from './home.module.css';
import { useAuth } from '../hooks/useAuth';

export default function Home(){
    const authHook = useAuth();
    
    return(
        <div className={styles.pageContainer}>
            <h1 className={styles.homeHeader}>Home</h1>
            <button type='button' onClick={() => authHook.authActions.signout()}>sign out</button>
        </div>
    )
}
