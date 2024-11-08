const { getRepository } = require('../../repository')
const { AccountNotFound, InvalidEvent } = require('../../exceptions')

exports.reset = () => {
  getRepository().Account.reset()
}

exports.getBalance = (accountNumber) => {
  const balance = getRepository().Account.retrieve(accountNumber)

  if (balance === undefined) {
    throw new AccountNotFound()
  }

  return balance
}

exports.processEvent = (payload) => {
  const origin = payload.origin ? payload.origin.toString() : undefined
  const destination = payload.destination ? payload.destination.toString() : undefined
  const amount = payload.amount ? parseFloat(payload.amount) : undefined

  switch (payload.type) {
    case 'withdraw':
      if (origin === undefined || amount === undefined) {
        throw new InvalidEvent()
      }
      return withdraw(origin, amount)
    case 'deposit':
      if (destination === undefined || amount === undefined) {
        throw new InvalidEvent()
      }
      return deposit(destination, payload.amount)
    case 'transfer':
      if (origin === undefined || amount === undefined || destination === undefined) {
        throw new InvalidEvent()
      }
      return transfer(origin, amount, destination)
    default:
      throw new InvalidEvent()
  }
}

const withdraw = (origin, amount) => {
  const currentBalance = getRepository().Account.retrieve(origin)
  if (currentBalance === undefined) {
    throw new AccountNotFound()
  }
  const newBalance = currentBalance - amount
  getRepository().Account.store(origin, newBalance)

  return { 'origin': { 'id': origin, 'balance': newBalance } }
}

const deposit = (destination, amount) => {
  const currentBalance = getRepository().Account.retrieve(destination)
  if (currentBalance === undefined) {
    getRepository().Account.store(destination, amount)
    return { 'destination': { id: destination, balance: amount } }
  }
  const newBalance = currentBalance + amount
  getRepository().Account.store(destination, newBalance)
  return {
    'destination': { id: destination, balance: newBalance },
  }
}

const transfer = (origin, amount, destination) => {
  const originBalance = getRepository().Account.retrieve(origin)
  if (originBalance === undefined) {
    throw new AccountNotFound()
  }

  const originWithdrawal = withdraw(origin, amount)
  const destinationDeposit = deposit(destination, amount)

  return { ...originWithdrawal, ...destinationDeposit }
}