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