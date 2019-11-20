import { agent as request } from 'supertest'
import { assert } from 'chai'
import { sign as signJwt } from 'jsonwebtoken'
import 'mocha'
import * as sinon from 'sinon'

import * as index from '../src/index'

const testSecret = 'a'.repeat(64)

describe('endpoints', () => {
    beforeEach('', () => {
        this.sandbox = sinon.createSandbox()
        this.sandbox.stub(process, 'env').value({ APP_SECRET: testSecret })
        this.app = index.makeApp()
    })

    describe('UI extensions endpoints', () => {
        it('should decode JWT', () => {
            const jwt = signJwt({ banana: 42 }, testSecret)
            request(this.app)
                .get('/campaign?jwt=' + jwt)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    assert(res.text.indexOf('banana') !== -1)
                })
        })

        it('should send invalid JWT response if invalid', () => {
            request(this.app)
                .get('/campaign?jwt=asdf')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    assert(res.text.indexOf('invalid jwt') !== -1)
                })
        })
        it('should report unset APP_SECRET', () => {
            this.sandbox.stub(process, 'env').value({ APP_SECRET: undefined })
            const app = index.makeApp()
            request(app)
                .get('/campaign')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    console.log(res.text)
                    assert(res.text.indexOf('No APP_SECRET defined') !== -1)
                })
        })
    })

    describe('lifecycle callback endpoints', () => {
        it('should respond with request json payload', () => {
            console.log = () => {
                // mute to declutter test output
            }
            request(this.app)
                .post('/install')
                .send({ banana: 42 })
                .set('X-Perc-App-Secret', testSecret)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    assert(res.text.indexOf('banana') !== -1)
                })
        })
        it('should not warn if correct secret', () => {
            let log_calls: any[] = []
            console.log = (_arg: any) => {
                log_calls.push(_arg.toString())
            }
            request(this.app)
                .post('/install')
                .send({ banana: 42 })
                .set('X-Perc-App-Secret', testSecret)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    let warning = log_calls.filter(arg => {
                        return arg.indexOf('WARNING') !== -1
                    })
                    assert(warning.length === 0)
                })
        })
        it('should warn if secret in header does not match', () => {
            let log_calls: any[] = []
            console.log = (_arg: any) => {
                log_calls.push(_arg.toString())
            }
            request(this.app)
                .post('/install')
                .send({ banana: 42 })
                .set('X-Perc-App-Secret', 'wrong secret')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err
                    let warning = log_calls.filter(arg => {
                        return arg.indexOf('WARNING') !== -1
                    })
                    assert(warning.length > 0)
                })
        })
    })
})
