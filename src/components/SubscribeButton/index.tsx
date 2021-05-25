import { signIn, useSession } from 'next-auth/client'
import styles from './styles.module.scss'

interface subscribeButton {
    priceId: string;
}

export function SubscribeButton({priceId} : subscribeButton){
    const [session] = useSession(); //verificando a sessão do usuário; 
    function handleSubscribe(){
        if (!session) {
            signIn('github'); // se não existir a sessão vamos redirecionar para o signIn do github
            return;
        };

        //criação da checkout session
        
    };
    return (
        <button type="button" className={styles.subscribeButton}>
            Subscribe now
        </button>
    )
}