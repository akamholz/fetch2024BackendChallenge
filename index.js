// SET UP
const express = require('express');
const app = express();
const PORT = 8000;
const convertTime = require('moment')

// middleware that parses requests as JSON
app.use(express.json());

app.listen(PORT, () => console.log(`server listening on http://localhost:${PORT}`));

// state variables
var balances = {}; // key: a payer/user; value: their points balance
var transactions = []; // a list of all the transactions that have occurred in the form [payer name, points, timestamp]
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

    // adding the transaction
    transactions.push([payer.payer, payer.points, new Date(payer.timestamp)]);

    res.sendStatus(200);
})

// SPENDING POINTS
app.post('/spend', (req, res) => {
    var pointsRequested = req.body.points;

    if (pointsRequested > totalPoints) {
        res.status(400).send("The user does not have enough points to spend " + pointsRequested + " points");
    } else {
        // sorting the transactions based on oldest timestamp
        transactions.sort(function(a, b){
            return a[2] - b[2];
        })
        var contributions = {} // key: a payer; value: the amount they contributed to the spending
        var pointsSpent = 0 // the amount of points spent while iterating
        var index = 0; // index variable used for iterating through payers

        // determing how the points are going to be spent based on the rules
        while (pointsSpent < pointsRequested) {
            var payer = transactions[index][0];
            var transactionPoints = transactions[index][1];
            // skipping a transaction with 0 points or a payer with a negative balance
            if (transactionPoints == 0 || balances[payer] <= 0) {
                index += 1
                continue;
            }
            var pointsContributed = Math.min(transactionPoints, pointsRequested - pointsSpent, balances[payer]);
            balances[payer] -= pointsContributed;
            transactions[index][1] -= pointsContributed;
            pointsSpent += pointsContributed;
            if (contributions[payer]) {
                contributions[payer] += pointsContributed;
            } else {
                contributions[payer] = pointsContributed;
            }
            index += 1;
        }

        // creating the response object
        var responseList = []; // list of JSON objects that will be the response
        for (var contributor in contributions) {
            responseList.push({"payer": contributor, "points": -1*contributions[contributor]});
        }

        totalPoints -= pointsRequested;
        res.status(200).send(responseList);
    }
})

// GETTING POINTS
app.get('/balance', (req, res) => {
    res.status(200).send(balances);
})