const express = require('express');
const { mongooseConnect } = require('@/lib/mongoose');
const data = require('@/lib/mongocon');
const User = require('@/models/User');

const app = express();
function seed(){
app.get('/', async (req, res) => {
  // return res.send({ message: 'already seeded' });
  await mongooseConnect();
  await User.insertMany(data.users);

  res.send({ message: 'seeded successfully' });
});
}
module.exports = seed;