const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b05a84bc3f92e9',
    password: 'd6dfe19c',
    database: 'heroku_bd247f7ff7eab99'
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })
  //Cors Configuration - End

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

app.listen(process.env.PORT || 30001, () => {
    console.log('running on port 3001');
})

// Routes
app.get('/', (req, res) => {
    res.status(200).send("Connected");
});

// Team Information
app.get('/api/getAllTeamInformation', (req, res) => {
    const sqlSelect = "SELECT * FROM team_information";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(400).send(err.sqlMessage);
        } else {
            res.send(result)
        }
    });
});

app.post('/api/insertTeamInformation', (req, res) => {
    const teamList = req.body.teamList;

    db.query("DELETE FROM team_information", (err, result) => {
        if (result) {
            const sql = "INSERT INTO team_information (team_name, group_number, registration_date) VALUES ?";
            const values = teamList.map(team => [team.team_name, team.group_number, team.registration_date])
            db.query(sql, [values], (err, result) => {
                if (result) {
                    res.status(200).send("OK");
                }
                if (err) {
                    res.status(400).send(err.sqlMessage);
                }
            });
        }
    });
});

// Match Results
app.get('/api/getAllMatchResults', (req, res) => {
    const sqlSelect = "SELECT * FROM match_results";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(400).send(err.sqlMessage);
        } else {
            res.send(result)
        }
    });
});

app.post('/api/insertMatchResults', (req, res) => {
    const matchResultsList = req.body.matchResultsList;

    db.query("DELETE FROM match_results", (err, result) => {
        if (result) {
            const sql = "INSERT INTO match_results (team_1, team_2, team_1_goals, team_2_goals) VALUES ?";
            const values = matchResultsList.map(mr => [mr.team1, mr.team2, mr.team1_goals, mr.team2_goals]);
            db.query(sql, [values], (err, result) => {
                if (result) {
                    res.status(200).send("OK");
                }
                if (err) {
                    console.log(err)
                    res.status(400).send(err.sqlMessage);
                }
            });
        }
        if (err) {
            console.log(err);
        }
    });
});

// Team Scores
app.get('/api/getAllTeamScores', (req, res) => {
    const sqlSelect = "SELECT * FROM team_scores";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(400).send(err.sqlMessage);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/insertTeamScores', (req, res) => {
    let teamScoreList = req.body.teamScoreList;
    teamScoreList = teamScoreList.map(x => ({...x, registration_date: new Date(x.registration_date)}));
    db.query("DELETE FROM team_scores", (err, result) => {
        if (result) {
            const sql = "INSERT INTO team_scores (team_name, match_points, total_goals, alt_match_points, registration_date, group_number) VALUES ?";
            const values = teamScoreList.map(team => [team.team_name, team.match_points, team.total_goals, team.alt_match_points, team.registration_date, team.group_number])
            db.query(sql, [values], (err, result) => {
                if (result) {
                    res.status(200).send("OK");
                }
                if (err) {
                    console.log(err);
                    res.status(400).send(err.sqlMessage);
                }
            });
        }
    });
});

app.get('/api/clearAll', (req, res) => {
    let sql = "DELETE FROM team_scores";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    sql = "DELETE FROM team_information";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    sql = "DELETE FROM match_results";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    res.status(200).send("OK");
});