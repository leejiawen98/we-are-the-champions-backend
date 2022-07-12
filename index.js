const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'champion_db'
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

app.listen(3001, () => {
    console.log('running on port 3001');
})

// Routes
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
