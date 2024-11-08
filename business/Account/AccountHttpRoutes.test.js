const { runServer } = require('../../infrastructure/httpServer')
const request = require('supertest')

/**
 * tests the account module as if calling the API endpoints
 * Ensures that payload is parsed in and out correctly
 * Should respond with proper encoding and status codes
 */
describe('Test account module', () => {
  const supertest = request.agent(runServer())

  afterAll(() => {
    supertest.app.close()
  })

  test('post /reset', () => {
    return supertest
    .post('/reset')
    .expect(200)
    .expect('OK')
  })

  test('GET /balance non-existing account', () => {
    return supertest
    .get('/balance?account_id=1234')
    .expect(404, '0')
  })

  test('POST /event Create account with initial balance', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'deposit', 'destination': '100', 'amount': 10 })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => {
      expect(response.body).toMatchObject({ 'destination': { 'id': '100', 'balance': 10 } })
    })
  })

  test('POST /event Deposit into existing account', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'deposit', 'destination': '100', 'amount': 10 })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => {
      expect(response.body).toMatchObject({ 'destination': { 'id': '100', 'balance': 20 } })
    })
  })

  test('GET /balance existing account', () => {
    return supertest
    .get('/balance?account_id=100')
    .expect(200, '20')
  })

  test('POST /event Withdraw from non-existing account', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'withdraw', 'origin': '200', 'amount': 10 })
    .expect(404, '0')
  })

  test('POST /event Withdraw from existing account', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'withdraw', 'origin': '100', 'amount': 5 })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => {
      expect(response.body).toMatchObject({ 'origin': { 'id': '100', 'balance': 15 } })
    })
  })

  test('POST /event Transfer from existing account', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'transfer', 'origin': '100', 'amount': 15, 'destination': '300' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then(response => {
      expect(response.body).toMatchObject({
          'origin': { 'id': '100', 'balance': 0 },
          'destination': { 'id': '300', 'balance': 15 },
        },
      )
    })
  })

  test('POST /event Transfer from non-existing account', () => {
    return supertest
    .post('/event')
    .send({ 'type': 'transfer', 'origin': '200', 'amount': 15, 'destination': '300' })
    .set('Accept', 'application/json')
    .expect(404, "0")
  })
})