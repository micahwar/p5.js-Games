const express = require('express')
const cors = require('cors')
let app = express()

const fs = require('fs');

let scores = JSON.parse(fs.readFileSync('scores.json', 'utf8'))["list"];
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/', function(req, res, next) {

    let data = req.body;
    console.log(data);
    if (data.type.indexOf("score") == 0) {
        if (data.type == "scoresubmit") {
            scores.push([data.name, parseInt(data.value)]);
            console.log(scores);
            console.log(data.name + " has attained a score of " + data.value);
        }
        let userScores = scores.filter((elem) => elem[0] == data.name).sort((a, b) => b[1] - a[1]);
        if (userScores.length > 0) {
            res.status(200).json({ score: userScores[0][1] });
        } else {
            res.status(200).json({ score: 0 });
        }
    } else if (data.type == "leaderboard") {
        let topTen = scores.sort((a, b) => b[1] - a[1]).slice(0, 10);
        res.status(200).json(topTen);
        backup();
    }

})

app.get('/scores.json', function(req, res, next) {
    fs.readFile('scores.json', (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

function backup()
{
    console.log("backing up scores...");
    fs.writeFileSync('scores.json', JSON.stringify({"list": scores}));
    console.log("backing up done.");
}

app.listen((process.env.PORT || 3000), function() {
    console.log('CORS-enabled web server listening on port 3000')
})

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    backup();
    
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
