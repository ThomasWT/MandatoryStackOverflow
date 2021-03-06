const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

/****** Configuration *****/
const port = (process.env.PORT || 8080);

// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});
/****** Data *****/
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/recipes');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});
let questionSchema = new mongoose.Schema ({
    title: String,
    description: String,
    topic: String,
    answers: [{
        header: String,
        text: String,
        ranking: Number,}]
});

let Questions = new mongoose.model('Questions', questionSchema);

const questions =[
    {
        title: "Starting with GitHub",
        description: "Hey guys, I'm very new in the internet, how do I start with github?",
        topic: "Github"

    },
    {
        title: "Making Pacman in android",
        description: "Hey guys, I'm new in android, do you know any helpful tutorial?",
        topic:"Java"
    },
    {
        title: "How to set up Umbraco",
        description: "Does any of you have idea how to set up Umbraco CMS?",
        topic: "Umbraco"
    }
];
questions.forEach((r)=>{
    let questions = new Questions({
        title: r.title,
        description: r.description,
        topic: r.topic,
        answers: r.answers
    })
    questions.save((err, questions)=>{
        if (err) return console.error(err);
    })
});


/****** Helper functions *****/
function getQuestionFromId(id) {
    return questions.find((elm) => elm.id === Number(id));
}

function filterByTopic(topic) {
    return questions.filter((elm) => elm.topic.includes(topic))
}
function findNextId() {
    const reducer = (acc, curr) => Math.max(acc, curr);
    let nextId = data.map(el => el.id).reduce(reducer) + 1;
    return nextId;
}

app.get('/questions2', (req, res) => {
    Questions.find((err, questions)=>{
        res.json(questions);
    });
});


app.get('/questions/:id', (req, res) => {
    Questions.find({id: req.params.id}, (err, questions) =>{
        res.json(questions)
    });
});

app.post('/questions', (req, res) => {
    let newQuestion = req.body;
    newQuestion.id = findNextId();
    let question = new newQuestion ({
        title: newQuestion.title,
        description: newQuestion.description,
        topic:newQuestion.topic,
        answers:newQuestion.answers

    });
    question.save();
    res.json({ msg: `You have posted new question`, question: newQuestion});
});

app.put('/questions/:id', (req, res)=>{
    res.json(getQuestionFromId(req.params.id));
});

app.get('/questions/with/:topic', (req, res) =>{
    console.log("hi");
    Questions.find({topic: req.params.topic}, (err, questions) =>{
        res.json(questions);
        filterByTopic(req.params.topic);
    });
});
app.listen(port, () => console.log(`Cooking API running on port ${port}!`));
