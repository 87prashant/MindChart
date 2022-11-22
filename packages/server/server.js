const express = require('express')
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/api', function (req, res) {
  res.json({"data": ["it is working..", "yes"]});
});

app.listen(process.env.PORT || 8000);