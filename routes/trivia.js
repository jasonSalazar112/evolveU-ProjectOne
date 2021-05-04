const express = require('express')
const { movies } = require('../database/movies')
const User = require('../database/connection')


let router = express.Router()
let agent = {}


function createUser() {
    const user = {
        title: '',
        username: '',
        score: '',
        agentScore: [],
        rank: ''
    }
    return user
}

function populateUser(title, username, score, agentScore) {
    const user = {
        title: title,
        username: username,
        score: score,
        agentScore: agentScore,
        rank: ''
    }
    if (user.score < 2) {
        user.rank = "George Lazenby"
    } else if (user.score < 4) {
        user.rank = "Sir Sean Connery"
    } else if (user.score < 6) {
        user.rank = "Sir Roger Moore"
    } else if (user.score < 8) {
        user.rank = "Timothy Dalton"
    } else if (user.score < 9) {
        user.rank = "Pierce Brosnan"
    } else if (user.score < 10) {
        user.rank = "Daniel Craig"
    } else if (user.score === 10) {
        user.rank = "00 Agent"
    }
    return user
}

async function createDbUser() {
    const dbUser = new User({
        title: agent.title,
        username: agent.username,
        score: agent.score,
        agentScore: agent.agentScore,
        rank: agent.rank
    })

    const result = await dbUser.save()
}


async function findUser() {
    const users = await User
    users.find({}, function (err, users) {
        if (err) {
            console.log(err)
        } else {
            return users
        }
    })
}

async function countUser() {
    const users = await User
    users.countDocuments({}, function (err, users) {
        if (err) {
            console.log(err)
        } else {
            return users
        }
    })
}


router.get('/:id', (req, res) => {
    let movie = movies.find(c => c.id === (req.params.id))
    if (!movie) {
        return res.status(404).send('The Bond movie with ID: "' + (req.params.id) + '" does not exist')
    } else if ((movie.id) === 'main') {
        res.render('main')
    } else if ((movie.id) === 'rank') {

        // let dbUserCollection = findUser()
        // let dbUserCount = countUser()

        res.render('rank')
    } else if ((movie.id) !== 'main' || (movie.id) !== 'leaderboard') {
        res.render('movie', {
            id: movie.id,
            title: movie.title,
            name: movie.name,
            img: movie.img,
            description: movie.description,
            question1: movie.question[0],
            question2: movie.question[1],
            question3: movie.question[2],
            question4: movie.question[3],
            question5: movie.question[4],
            question6: movie.question[5],
            question7: movie.question[6],
            question8: movie.question[7],
            question9: movie.question[8],
            question10: movie.question[9]
        })
    }
})

router.post('/:id', (req, res) => {
    let movie = movies.find(c => c.id === (req.params.id))
    if (!movie) {
        return res.status(404).send('The movie with ID: "' + (req.params.id) + '" does not exist')
    } else if (movie.id !== 'main') {
        agent = createUser()
        var agentScore = [
            req.body.question1,
            req.body.question2,
            req.body.question3,
            req.body.question4,
            req.body.question5,
            req.body.question6,
            req.body.question7,
            req.body.question8,
            req.body.question9,
            req.body.question10
        ]
        var title = req.params.id
        var username = req.body.username
        let score = 0
        let record = new Array
        let count = 0
        let answeredWrong = new Array
        for (let h = 0; h < 10; h++) {
            record[h] = 'W'
        }
        for (let i = 0; i < 10; i++) {
            if (agentScore[i] === movie.answerKey[i]) {
                record[i] = 'R'
                score++
            }
        }
        for (let j = 0; j < 10; j++) {
            if (record[j] === 'W') {
                answeredWrong[count] = movie.question[j]
                count++
            }
        }
        console.log("AgentScore: " + agentScore)
        console.log("Answer Key: " + movie.answerKey)
        agent = populateUser(title, username, score, agentScore)
        createDbUser()
        res.render('score', {
            id: movie.id,
            title: movie.title,
            name: movie.name,
            img: movie.img,
            description: movie.description,
            score: score,
            answeredWrong,
            agent
        })
    }
})


module.exports = router