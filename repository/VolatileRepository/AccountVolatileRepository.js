// exported for test purposes ONLY
exports._accounts = new Map();

exports.reset = () => {
  exports._accounts = new Map();
}

exports.store = (account, amount) => {
  return exports._accounts.set(account, amount)
}

exports.retrieve = (account) => {
  return exports._accounts.get(account);
}