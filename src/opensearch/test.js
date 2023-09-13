const {constructOpenSearchPayload} = require('./constructOpenSearchPayload');

 constructOpenSearchPayload('/article/page33.md').then((payload) => {
     console.log(payload);
 })

