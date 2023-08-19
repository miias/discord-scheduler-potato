const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.all(`/`, (req, res) => {
  res.send(`Result: [OK].`);
});

function keepAlive() {
  app.listen(port, () => {
    console.log(`Server is now ready! | ` + Date.now());
  });
}

module.exports = keepAlive;