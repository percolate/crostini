import * as bodyParser from 'body-parser'
import * as express from 'express'
import { verify } from 'jsonwebtoken'
import { format } from 'prettier'

const app = express()
const port = process.env.PORT || 3000
const secret = process.env.APP_SECRET

app.use(express.static('public'))
app.use(bodyParser.json())

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

function lifecycleCallback(req: express.Request, res: express.Response) {
    // Express lowercases header names, the original casing is "X-Perc-App-Secret"
    const header_secret = req.headers['x-perc-app-secret']
    if (!secret) {
        console.log('Cannot validate request, no APP_SECRET environment variable defined')
    } else if (header_secret !== secret) {
        console.log(
            'WARNING! This request may not have come from Percolate, the ' +
                'X-Perc-App-Secret header value does not match the APP_SECRET environment ' +
                'variable!'
        )
    }

    let response = `"${req.path}" lifecycle callback endpoint called with data:
${format(JSON.stringify(req.body), { parser: 'json' })}`
    console.log(response)
    res.send(response)
}

function hello(req: express.Request, res: express.Response) {
    res.send('hi')
}

// UI extension endpoints
app.get('/campaign', echoJwt)
app.get('/content', echoJwt)
app.get('/asset', echoJwt)
app.get('/request', echoJwt)
app.get('/task', echoJwt)
app.get('/top_nav', echoJwt)
app.get('/settings', echoJwt)

// lifecycle callbacks
app.post('/install', lifecycleCallback)
app.post('/uninstall', lifecycleCallback)
app.post('/enable', lifecycleCallback)
app.post('/disable', lifecycleCallback)
app.post('/update', lifecycleCallback)
app.post('/upgrade', lifecycleCallback)

app.get('/', hello)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
