import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {query as q} from 'faunadb'

import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string
    }
}

//criando nossa requisição
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST"){
        const session = await getSession({req}); //pegando a sessão do usuário;
        
        const user = await fauna.query<User>(
            q.Get( //fazendo uma busca no usuário por email
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,   
            });

            await fauna.query(
                q.Update( //vamos fazer o update em uma query
                    q.Ref(q.Collection('users'), user.ref.id),
                    { //objeto em que vamos atualizar
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        };

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1Ijmr6FuAxoHDiWy4AHqKCMF', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url:  process.env.STRIPE_CANCEL_URL
        });

        return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    }

    res.setHeader('Allow', 'POST') //explicando ao front-end que essa requisição é post
    res.status(405).end('Method not allowed') // setando o status da requisição para 405
}