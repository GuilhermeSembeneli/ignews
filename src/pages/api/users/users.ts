import {NextApiRequest, NextApiResponse} from 'next'
 
export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        {id: 1, name: 'Diego'},
        {id: 2, name: 'Gui'},
        {id: 3, name: 'Edu'},
    ]

    return response.json(users)
}