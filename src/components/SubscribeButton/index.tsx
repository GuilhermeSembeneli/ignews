import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface subscribeButton {
    priceId: string;
}

export function SubscribeButton({priceId} : subscribeButton){
    const [session] = useSession(); //verificando a sessão do usuário; 

    async function handleSubscribe(){
        if (!session) {
            signIn('github'); // se não existir a sessão vamos redirecionar para o signIn do github
            return;
        };

        //criação da checkout session
        try {
            const response = await api.post('/subscribe') //nome do arquivo é o nome da rota

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

           await  stripe.redirectToCheckout({ sessionId })
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}