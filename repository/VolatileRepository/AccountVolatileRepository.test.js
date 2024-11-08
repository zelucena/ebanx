const AccountVolatileRepository = require('./AccountVolatileRepository.js')

describe('test account volatile repository', () => {
  beforeEach(() => {
    // Reset state before starting tests
    AccountVolatileRepository._accounts = new Map()
  })

  it('should be empty on startup', () => {
    expect(AccountVolatileRepository._accounts.size).toEqual(0)
  })

  test('it should store to an account', () => {
    const accountNumber = 1
    const balance = 10

    AccountVolatileRepository.store(accountNumber, balance)

    expect(AccountVolatileRepository._accounts.size).toEqual(1)
    expect(AccountVolatileRepository._accounts.get(accountNumber)).toEqual(10)
  })
  test('should retrieve an account', () => {
    // create fixture
    const accountNumber = 1
    const balance = 10
    AccountVolatileRepository._accounts.set(accountNumber, balance)

    expect(
      AccountVolatileRepository.retrieve(accountNumber, balance),
    ).toEqual(10)
  })
  test('should fail to retrieve an non-existing account', () => {
    // create fixture
    const accountNumber = 1

    expect(
      AccountVolatileRepository.retrieve(accountNumber),
    ).toBeUndefined()
  })
})