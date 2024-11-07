// exported for testing purposes ONLY
exports.accounts = new Map();

exports.reset = () => {
  exports.accounts = new Map();
}

exports.store = (account, amount) => {
  return exports.accounts.set(account, amount)
}

exports.retrieve = (account) => {
  return exports.accounts.get(account);
}