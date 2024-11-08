const AccountVolatileRepository = require('./VolatileRepository/AccountVolatileRepository.js')
exports.getRepository = () => ({
  'Account': AccountVolatileRepository,
})