const mongoose = require('mongoose')
const uri = 'mongodb+srv://c6dbUser:c6dbUser@cluster0.2a4sh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas...'))
    .catch(err => console.error('Could not connect to MongoDB Atlas...', err))

module.exports = mongoose

const userSchema = new mongoose.Schema({
    title: String,
    username: String,
    score: String,
    agentScore: [String],
    rank: String
})

const User = module.exports = mongoose.model('User', userSchema)
