const AccountVolatileRepository = require('./AccountVolatileRepository.js')
const { AccountNotFound } = require('../../Exceptions')

const AccountService = require('./AccountService')
describe('test AccountService', () => {
  beforeEach(() => {
    AccountVolatileRepository.accounts = new Map()
  })
  test('should reset', () => {
    expect(AccountService.reset()).toBeUndefined()
  })

  test('should fail to get balance for non-existing account', () => {
    expect(() => AccountService.getBalance(200)).toThrowError(AccountNotFound)
  })

  test('should get balance for existing account', () => {
    AccountVolatileRepository.accounts.set('100', 10)
    expect(AccountService.getBalance('100')).toEqual(10)
  })

  test('should create account with initial balance', () => {
    const event = { 'type': 'deposit', 'destination': '100', 'amount': 10 }
    const expectedOutput = { 'destination': { 'id': '100', 'balance': 10 } }
    expect(AccountService.processEvent(event)).toMatchObject(expectedOutput)
  })

  test('should deposit into exising account', () => {
    AccountVolatileRepository.accounts.set('100', 10)
    const event = { 'type': 'deposit', 'destination': '100', 'amount': 10 }
    const expectedOutput = { 'destination': { 'id': '100', 'balance': 20 } }

    expect(AccountService.processEvent(event)).toMatchObject(expectedOutput)
  })

  test('should fail to retrieve from non-existing account', () => {
    // AccountVolatileRepository.accounts.set('100', 20)
    const event = { 'type': 'withdraw', 'origin': '200', 'amount': 5 }
    expect(() => AccountService.processEvent(event)).toThrow(AccountNotFound)
  })

  test('should withdraw from existing account', () => {
    AccountVolatileRepository.accounts.set('100', 20)
    const event = { 'type': 'withdraw', 'origin': '100', 'amount': 5 }
    const expectedOutput = { 'origin': { 'id': '100', 'balance': 15 } }
    expect(AccountService.processEvent(event)).toMatchObject(expectedOutput)
  })

  test('should fail to transfer from non-existing account', () => {
    const event = { 'type': 'transfer', 'origin': '200', 'amount': 15, 'destination': '300' }
    expect(() => AccountService.processEvent(event)).toThrow(AccountNotFound)
  })

  test('should transfer from existing account', () => {
    AccountVolatileRepository.accounts.set('100', 15)
    const event = { 'type': 'transfer', 'origin': '100', 'amount': 15, 'destination': '300' }
    const expectedOutput = { 'origin': { 'id': '100', 'balance': 0 }, 'destination': { 'id': '300', 'balance': 15 } }

    expect(AccountService.processEvent(event)).toMatchObject(expectedOutput)
  })
})