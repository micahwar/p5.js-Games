class Network
{
    // handles all communication with the server that handles the highscores
    // and users
    constructor(host)
    {
        this.host = host;
    }

    getLeaderboard()
    {
        this.send("POST", "type=leaderboard", (req) => {
            console.log(req.response);
            leaderboard = req.response;
        });
    }

    send(type, data, callback)
    {
        // generic function for sending any request 
        // to the server
        let req = new XMLHttpRequest();
        req.responseType = 'json';
        req.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                callback(req);
            }
        };
        
        req.open(type, this.host, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send(data);
    }

    submitScore(s = "", score = false)
    {
        // this is very easily hackable, and has been tricked by users
        // into displaying custom scores with custom names.
        // more should be done to verify score submitions
        if (score)
        {
            s = "type=scoresubmit&name=" + name.toLowerCase() + "&value=" + s;
        } else
        {
            s = "type=score&name=" + name.toLowerCase();
        }
        this.send("POST", s, (req) => {
            console.log(req.response);
            highscore = parseInt(req.response.score);
            network.getLeaderboard();
        });
    }
}