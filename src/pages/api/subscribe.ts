import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

//criando nossa requisição
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST"){
        const session = await getSession({req}); //pegando a sessão do usuário;

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,   
        });

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
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