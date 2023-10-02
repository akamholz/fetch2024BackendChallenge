# fetch2024BackendChallenge

## Set Up Instructions
1. Clone this repository
2. Navigate to the directory in which you cloned this repository
3. Run `npm install` in the terminal to install all the dependencies
4. Run `node .` to run the server.
5. Use Insomnia, Postman, or any other HTTP request application to send HTTP requests to http://localhost:8000/ to utilize/test the API endpoints.

## Sending HTTP Requests

### Get Points Balance

Make a GET request to http://localhost:8000/balance to get the current balance of all the payers. No request body is necessary for this request.

### Add points

Make a POST request to http://localhost:8000/add to add points to a payer. A body is required for this request, and that should look something like...

```
 { "payer": "DANNON", "points": 1000, "timestamp": "2022-11-02T14:00:00Z" }
```
