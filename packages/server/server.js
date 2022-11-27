const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.post('/register', function (req, res) {
  res.json({"data": ["it is working...", "yes"]});
});

async function connection() {
  mongoose.connect('mongodb://localhost:27017/userCredentials')
}

app.listen(process.env.PORT || 8000);