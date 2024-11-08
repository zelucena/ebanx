# Ebanx Evaluation Test

This application is built with zero dependencies

You can run it by simply typing `node index.js`

There are two devDependencies `jest` and `supertest` both for testing.
```
npm i --devDependencies
npm run test
```

For production, please install pm2 globally
`npm install -g pm2` and run it by typing `npm run prod`

Note: this application currently does not support `.env` files.
You can change the port by passing it to node directly, eg: 
`PORT=4000 node index.js`