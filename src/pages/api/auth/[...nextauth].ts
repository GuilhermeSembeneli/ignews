import NextAuth from 'next-auth';
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            //permissões que iremos obter do usuario
            scope: 'read:user'
        })
    ],
    callbacks: {
        async signIn(user, account, profile) {
            const { email } = user;
            try {
                await fauna.query(
                    //usando operadores logicos do Fauna
                    q.If( //se 
                        q.Not( //não
                            q.Exists(  //existe um usuario por email que
                                q.Match( //em que realiza um match com
                                    q.Index('user_by_email'), //index que a gente criou lá no faunadb
                                    q.Casefold(user.email) //que é igual ao email 
                                )
                            )
                        ),
                        //execute (if):
                        //criando uma inserção
                        q.Create(
                            q.Collection('users'), //pegando a collection users
                            { data: { email } }
                        ),
                        //se não (else):
                        //seleciona um usuario que faz um match com o email
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        ) //como se fosse um select
                    )
                )
                return true;
            } catch {
                return false;
            }
        }
    }
})