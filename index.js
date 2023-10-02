// SET UP
const express = require('express');
const app = express();
const PORT = 8000;
const convertTime = require('moment')

// middleware that parses requests as JSON
app.use(express.json())

app.listen(
    PORT,
    () => console.log(`server listening on http://localhost:${PORT}`)
)

var balances = {}; // key: a payer/user; value: their points balance
var timestamps = {}; // key: a payer/user; value: the earliest timestamp of points that were added to them
var totalPoints = 0; // the total points among all payers

// ADDING POINTS
app.post('/add', (req, res) => {
    var payer = req.body;

    // adding the points
    if (balances[payer.payer]) {
        balances[payer.payer] += payer.points;
    } else {
        balances[payer.payer] = payer.points;
    }
    totalPoints += payer.points;

    // handling the timestamp
    var timestamp = new Date(payer.timestamp);
    if (!timestamps[payer.payer] || (timestamps[payer.payer] && timestamp < timestamps[payer.payer])) {
        timestamps[payer.payer] = timestamp;
    }
    res.sendStatus(200);
})

// SPENDING POINTS
app.post('/spend', (req, res) => {
    var points = req.body.points;

    if (points > totalPoints) {
        // handling the spending request exceeding the total amount of points the user has
        res.send("The user does not have enough points to spend " + points + " points");
        res.sendStatus(400);
    } else {
        // sorting the payers based on oldest timestamp
        var payers = Object.keys(timestamps);
        payers.sort(function(a, b){
            return timestamps[a] - timestamps[b];
        })
        
        
        res.sendStatus(200);
    }
})

// GETTING POINTS
app.get('/balance', (req, res) => {
    //res.send(balances);
    res.send(timestamps);
    res.sendStatus(200);
})