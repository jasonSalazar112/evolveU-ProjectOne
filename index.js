const express = require('express')
const app = express()
const trivia = require('./routes/trivia')


app.set('view engine', 'pug')
app.set('views', './views')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('images'))
app.use('/', trivia)


const port = process.env.PORT || 3000
const url = `http://localhost:${port}`
app.listen(port, () => console.log(`Listening on port ${port}...`)) // NOTE: Used a backtick