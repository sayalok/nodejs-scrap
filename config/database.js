require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected');
    })
    .catch(error => {
        console.log(error);
    })