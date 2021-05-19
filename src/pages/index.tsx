import Head from "next/head";
import {GetStaticProps} from 'next'


import { SubscribeButton } from "../components/SubscribeButton";

import styles from './home.module.scss';
import { stripe } from "../services/stripe";

interface homeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: homeProps) {
  return (
    <>
      <Head>
        <title> Home | ig.news </title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>Get access to all the publications <br/> 
              <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
          <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  );
}

export const getStaticProps : GetStaticProps =  async () => {
  //id do pricing do produto
    const price = await stripe.prices.retrieve("price_1Ijmr6FuAxoHDiWy4AHqKCMF");

    const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price.unit_amount / 100),
    }
    return {
      props: {
          product
      }, 
      //quanto tempo em segundos para essa pagina ser recarregada (refazer as chamadas)?
      revalidate: 60 * 60 * 24, //24h
    }
}
