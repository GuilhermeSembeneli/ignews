import styles from './styles.module.scss'

interface subscribeButton {
    priceId: string;
}

export function SubscribeButton({priceId} : subscribeButton){
    return (
        <button type="button" className={styles.subscribeButton}>
            Subscribe now
        </button>
    )
}