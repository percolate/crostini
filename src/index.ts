import * as express from 'express'
import { verify } from 'jsonwebtoken'
import { format } from 'prettier'

const app = express()
const port = process.env.PORT || 3000
const secret = process.env.APP_SECRET

app.use(express.static('public'))

function echoJwt(req: express.Request, res: express.Response) {
    const token: string = req.query.jwt

    if (!secret) {
        res.send('No APP_SECRET defined')
        return
    }

    try {
        const decoded = verify(token, secret)
        res.send(`
            <h1>jwt</h1>
            <pre>${token}</pre>
            <h1>decoded</h1>
            <pre>${format(JSON.stringify(decoded), { parser: 'json' })}</pre>
        `)
    } catch (e) {
        res.send(`
            <h1>invalid jwt</h1>
            <pre>${token}</pre>
        `)
    }
}

app.get('/campaign', echoJwt)
app.get('/content', echoJwt)
app.get('/asset', echoJwt)
app.get('/request', echoJwt)
app.get('/task', echoJwt)
app.get('/top_nav', echoJwt)
app.get('/settings', echoJwt)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
