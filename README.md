# NextJs

- Melhora o mecanismo de busca do google/bing e etc (SEO);
- NextJS é server side rendering;
- Ele consegue renderizar conteudo html em vez de somente javascript igual ao react normal;
- Rotas como "backend" que podem acessar banco e fazer processos mais criticos, como transações de pagamentos.

# Serviços do Modulo

- Stripe api de pagamentos;
- Iremos usar o FaunaDB (banco de dados), vamos usar ela devido que é um banco de dados especifico principalmente para aplicações **serveless** atrvés de chamadas http;
- Prismic CMS (CMS) vamos usar o prismic para ela poder escrever os posts e tudo mais;

# serveless?

- Significa que cada rota é executada em um ambiente isolado, ou seja, quando alguém acessa uma rota da aplicação em vez dela estar sendo executada em um servidor node, na verdade somente quando a pessoa chamar a rota vai instanciar uma mini-maquina virtual, dando o resultado deleta a maquina virtual. **resumo**

# Fluxo da Aplicação

- https://whimsical.com/estrutura-do-projeto-nextjs-WHa3YzaU1eFvY28YjCFTKY

# Sobre o Next

- Framework criado em cima da **biblioteca** React, então lembrando que react é biblioteca e next uma framework para React

# Instalação do Next App

- **yarn create next-app [nome do projeto]**
- Após instalar apague a pasta styles, readme.md
- Crie uma pasta src e jogue a pasta pages

# Adicionado Typescript

- **yarn add typescript @types/react @types/node -D**
- Adicione a tipagem no \_app de **import { AppProps } from 'next/app'**

# Estilização com Sass

- yarn add sass

# Configuração fonte Externa

- Como é uma unica renderização precisamos criar um arquivo chamado \_document.tsx que será renderizado somente uma vez;
- O document tem que ser escrito em **classes**

```javascript
import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDcoument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/*todo o conteudo da aplicação será renderizado nesse main*/}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

# Stripe Api de pagamentos
- Vamos usar o stripe para realizar pagamentos "fakes".
- Crie um produto no stripe.
- Vá em develop e em api keys e copie a  "secrete keys".
- Crie um arquivo **.env.local**  e adicione o campo **STRIPE_API_KEY** e cole a chave.
- Instale o stripe **yarn add stripe**.
- Crie uma pasta em src/services e um arquivo **stripe.ts**.

~~~typescript
import Stripe from 'stripe'
import {version} from '../../package.json'

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY, {
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'Ignews',
            version
        }
    }
);
~~~


# Server side rendering
- Diego deu o exemplo do useEffect que ele registra a chamada a api somente ao browser, fazendo isso ocorre um efeito de layout left que se altera duas vezes, uma quando a api não foi carregada e a outra quando a api foi carregada com sucesso.
- Usando server-side-rendering quando ocorrer essa chamada toda a pagina vai esperar a resposta da api ser executada para a pagina ser servida.

## Como fazer isso usando NextJS?
**Observações: Lembrando que isso só funciona em paginas e não em componentes**
- Na pagina home (index) exporte uma função chamada **getServerSideProps** sendo assincrona.

~~~typescript
import {GetServerSideProps} from 'next'
export const getServerSideProps : GetServerSideProps = async () => {}
~~~

- Essa função serve para podermos acessar as propriedades criadas através do server-side na nossa Home;


# Static Site Generation (SSG)
- O static site generation vai criar um html estatico com o valor final do next com todas as informações de quando acessou as api. 
- Quando outro usuario acessar o next vai servir essa pagina, sendo assim não precisando fazer chamadas as api novamente.

- Para isso vamos alterar o seguinte:

~~~typescript
  import {GetStaticProps} from 'next'
  //import {GetServerSideProps} from 'next'
//export const getServerSideProps : GetServerSideProps =  async () => {
export const getStaticProps : GetStaticProps =  async () => {
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
~~~

# Api Routes Next
1. Todos nossos arquivos que estiverem dentro do **pages** serão paginas em nossa aplicação.
- Se eu criar um componente chamado **products** na pasta **pages** e ir no browser e acessar /products irá aparecer o nosso componente.
2. Criando uma pasta chamada api dentro do **pages** ela se transforma em rota do nosso **back-end**.
- Exemplo: Uma rota de listagem de usuários  que podem fazer uma busca numa tabela do banco de dados.
- Crie um arquivo **users.ts** dentro da pasta api onde iremos fazer nosso **"back-end"**

~~~typescript
import {NextApiRequest, NextApiResponse} from 'next'

//recebemos a request e response até aqui normal.
export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
      {id: 1, name: 'Diego'},
      {id: 2, name: 'Gui'},
      {id: 3, name: 'Edu'},
    ]

    return response.json(users)
}
~~~
- Podemos acessar essas informações "ficticias" na rota **/api/users**

## Estratégias de Autenticação
1. JWT (Storage)
- Um token que salva no localstorage/cookies e podemos ir trabalhando com uma data de expiração com refresh token.
2. Next Auth
- Quando queremos um sistema de auth simples geralmente usado com "login social" e conseguimos usa-ló quando não queremos armazenar credencias de usuario dentro de nosso back-end
- É uma autenticação que independe do back-end então ela não é recomendada para fazer auth com email senha.
- Existem varios outros como (Cognito, Auth0...).

## Criando rotas dinâmicas
1. Imagine que temos uma rota em que queremos buscar um usuario através de um parametro passado na rota (/users/1)
- Para isso podemos criar uma pasta chamada **users** e iremos mudar o nome do arquivo criado para index.tsx em vez de users.tsx,  jogue-o dentro da pasta **users**
- Para buscar através do id/parametro crie um arquivo dentro de [] e colocamos o nome que queremos ex: **[id].tsx**
- Para ter acesso ao id precisamos buscar dentro de request.
![Imagem dos arquivos](https://i.imgur.com/v0cNM6s.png)

~~~typescript
import {NextApiRequest, NextApiResponse} from 'next'
 
export default (request: NextApiRequest, response: NextApiResponse) => {
  //dentro de query vamos ter id que é o nome colocado dentro dos []
    const id = request.query.id
    const users = [
        {id: 1, name: 'Diego'},
        {id: 2, name: 'Gui'},
        {id: 3, name: 'Edu'},
    ]

    return response.json(users)
}
~~~

2. Mas vamos supor que quero ter acesso a qualquer valor que passar por parametro por exemplo em vez de 1 ser edit/create e por aí vai.

- Para isso colocamos um "spread operator" antes do nome do arquivo (nome do arquivo por convenção deve ser **[...params].ts**), claro dentro dos [].
- Com isso, estamos dizendo que tudo que for passado depois de users será acessada por uma variavel chamada params.

# Autenticação com Next Auth
- Crie uma pasta auth dentro de api e um arquivo chamado [...nextauth].ts.
- Instale o **next-auth** e a tipagem **@types/next-auth**.

~~~typescript
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            //permissões que iremos obter do usuario
            scope: 'read:user'
        })
    ],
    database: process.env.DATABASE_URL
})
~~~
- Agora precisamos ir ao github e criar um OAuth application, as configurações ficaram assim:
![Imagem da configuração](https://i.imgur.com/jXr9pSm.png)

2. Agora vamos configurar nosso auth do lado do client.
- No signInButton adicione esse codigo:

~~~typescript
import { FaGithub } from "react-icons/fa";
import {FiX} from 'react-icons/fi';

//useSession retorna se o usuario tem uma sessão ativa ou não
import {signIn, useSession} from 'next-auth/client'

import styles from "./styles.module.scss";

export function SignInButton() {
  const [session] = useSession();

  return session ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#04d361" />
      Guilherme Sembeneli
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
~~~

- Precisamos adicionar um **Provider** no nosso _app para ter acesso a informação se o usuario está logado ou não.

~~~typescript
//chamando uma tipagem dizendo que é nextComponentType
import { AppProps } from 'next/app'
import {Provider as NextAuthProvider } from 'next-auth/client'

import { Header } from '../components/Header';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header/>
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
~~~

# FaunaDB
- <a href="FaunaDB.md">FaunaDB</a>

# NextAuth Callbacks
1. Com o nextAuth podemos acessar as callbacks que seria quando executamos uma ação, podemos intercepitar por exemplo quando o usúario faz o login ou é redirecionado...
- Documentação NextAuth Callbacks: **https://next-auth.js.org/configuration/callbacks**

~~~javascript
//pages/api/auth/[...nextauth].js
  callbacks: {
    async signIn(user, account, profile) {
      return true
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    }
...
}
~~~

2. Vamos agora salvar as informações do usúario logado no banco de dados assim que logar.
- Importe no **[...nextauth].ts** o nosso arquivo **fauna.ts**, também importe dentro do módulo de fauna o **query as q**.

~~~typescript
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers'

import {fauna} from '../../../services/fauna';
import { query as q} from 'faunadb'

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
        async signIn(user, account, profile){
            const {email} = user;
            try {
                await fauna.query(
                    //criando uma inserção
                    q.Create(
                        q.Collection('users'), //pegando a collection users
                        {data: { email }}
                    ) 
                )
                return true;
            } catch {
                return false;
            }
        }
    }
})
~~~

- Se tudo der certo nas collections do Fauna iremos ver o email do usuário.

# Usando operadores logicos com faunaDB
~~~javascript
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
~~~

# Checkout Session com Strapi
1. Precisamos realizar um post na sdk do Strapi;
- Para isso temos que criar dentro da pasta api um novo arquivo chamado subscribe.ts;
- Dentro da rota subscribe vamos criar uma rota de post;

~~~typescript
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
~~~
2. Para consumir essa rota vamos usar o axios para fazer nossos fetchs.
- **yarn add axios**.
- Em **services** vamos criar um arquivo chamado api.ts .

~~~typescript
import axios from "axios";

export const api = axios.create({
    baseURL: '/api'
})
~~~

- Agora podemos usar o axios em nosso projeto .
- Em nosso **SubscribeButton**

~~~typescript

~~~

3. Também temos que configurar o **stripe-js** arquivo que deve ser criado na pasta services.
- Instale o pacote do stripe-js **yarn add @stripe/stripe-js**.
- Precisamos pegar nossa key publica no site do strapi em Developers/api_Keys.
- Depois setamos ela em nossa **env**

~~~javascript
# Stripe
STRIPE_API_KEY = sk_test_51IjmbfFuAxoHDiWyo80hBzSLR0DGbC5m3UGrcC65HY5YFPAJFoOxDkzKYicruQTXiWd66yXBrvYFsEFj7yMFJX5J00yUYKuPRx
STRIPE_SUCCESS_URL = 'http://localhost:3000/posts'
STRIPE_CANCEL_URL = 'http://localhost:3000'
NEXT_PUBLIC_STRIPE_PUBLIC_KEY = pk_test_51IjmbfFuAxoHDiWyySREZpxuh3YA0K6WM6ohZxDwSDhrXVQzEFSnL2oRTgs4PyX4ahEmIPkvFGcx19Ar68hHLZDi00M3aRiiGL
# Github
GITHUB_ID = e1a4cc2051c5a3f61f2d
GITHUB_SECRET = c94153b72ebee78e1e3502d5b3fce1e2fe313e8f

# FaunaDB

FAUNADB_KEY= fnAEJn0_LdACBj0BA13lxpHDZpqkcdAjUXbXwCKJ
~~~

- E a chamamos em nosso arquivo **strpe-js.ts**.

~~~typescript
import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

    return stripeJs;
}
~~~


- Agora no subscribe button vamos fazer o seguinte:

~~~typescript
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
~~~

- No nosso arquivo subscribe.ts vamos fazer as seguintes alterações:

~~~typescript
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
~~~

# Observações
- Por padrão o next ao inserirmos no source das imagens ele reconhece a pagina public.
- Biblioteca de icons **react-icons**.
- Chamadas a api pelo next pode ser feita em 3 formas : **client-side, server-side, server-side generation.**
- Cookies são semi-side ou seja, conseguimos acessar tanto em back-end quanto front-end já o localstorage somente no front.