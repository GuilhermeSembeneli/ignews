# FaunaDB
1. Recomendado para função serveless.
- Todas as operações feitas por faunaDB como criar um usuário, são feitas através de **protocolos** que não precisam manter conexão aberta com o banco de dados.
2. Crie uma conta no FaunaDB.
- Acesse sua conta e crie uma nova "new Database".
- Em "Security" vamos configurar nossa "key".
- Crie uma key em que no **role** seja Admin e o **key name** que pode ser qualquer coisa, irei nomear como: "ignews-next-app".
- Após criar a chave vamos ao .env.local e adicionar:

~~~javascript
FAUNADB_KEY=KEY
~~~

- Vamos criar uma **collections** chamada users no FaunaDB.
- Crie também um "Index" para email:
<img src="https://i.imgur.com/Fzg1SD6.png">

## Instalando o FaunaDB
1. yarn add faunadb
- Dentro de services crie um **fauna.ts**

~~~javascript
import {Client} from 'faunadb'

export const fauna = new Client({
    secret: process.env.FAUNADB_KEY
})
~~~
