var express = require('express')
    , mysql = require('mysql')
    , cors = require('cors')
    , app = express()
    , bcrypt = require('bcrypt')
const saltRounds = 10;

// -----------------------------------------

app.use(cors());

let bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "uosh6quu",
    database: "neverhaveiever"
});

con.connect((err) => {
    if(!err) console.log("Connection succeed");
    else console.log("Connection failed");
});

// ----------------------------------------- NEVEREVER DATABASE

// GET ALL INFO FROM neverever
app.get('/neverever', (req, res) => {
    con.query('SELECT * FROM neverever', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else console.log(err);
    });
});

// GET SINGLE INFO FROM neverever
app.post(`/neverever/prompt`, (req, res) =>{
    con.query('SELECT * FROM neverever WHERE statement LIKE ?', '%' + [req.body.statement] + '%',(err, rows) =>{
        if(!err) res.send(rows);
        else console.log(err);
    });
});

// DELETE THE INFO FROM neverever
app.delete('/neverever/:id', function (req, res){
    con.query('DELETE FROM neverever WHERE id = ?',[req.params.id],(err, rows)=>{
        if(!err){
            res.send('Deleted succesfully.');
            console.log(rows);
        }else{
            console.log(err);
        }
    });
});

// UPDATE THE INFO IN neverever
app.put('/neverever', (req, res) =>{
    con.query('UPDATE neverever SET statement = ? WHERE id = ?', [req.body.statement, req.body.id], (err, rows)=>{
        if(!err) res.send(rows);
        else console.log(err);
    });
});

// ADD NEW INFO TO neverever
app.post('/neverever/add', (req, res) =>{
    var jsonObj = req.body;

    con.query('INSERT INTO neverever(name, statement, kieli) VALUES(?,?,?)', [jsonObj.name, jsonObj.statement, jsonObj.kieli], (err, rows)=>{
        if(!err) {
            res.send("Prompt added.");
        }
        else console.log(err);
    });
});

// ----------------------------------------- USERS DATABASE

// GET ALL INFO FROM users
app.get('/users', (req, res) => {
    con.query('SELECT * FROM users', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else console.log(err);
    });
});

// GET SINGLE INFO FROM users AND CHECK THE PASSWORD MATCHING
app.post(`/users/this`, (req, res) =>{
    con.query('SELECT * FROM users WHERE user_name LIKE ?', [req.body.user_name],(err, rows) =>{
        if(!err){
            bcrypt.compare(req.body.user_password, rows[0].user_password, function(err, result){
                res.send(result);
            });
        }
        else console.log(err);
    });
});

// ADD NEW INFO TO users
app.post('/users/add', (req, res) =>{
    var jsonObj = req.body;
    bcrypt.hash(req.body.user_password, saltRounds, function(err, hash) {
        bcrypt.compare(req.body.user_password, hash, function(err, result){
            if(!err){

                if(result) {
                    con.query('INSERT INTO users(user_name, user_level, user_password) VALUES(?,?,?)', [jsonObj.user_name, jsonObj.user_level, hash], (err, rows) => {
                        if (!err) {
                            res.send("User added.");
                            console.log(rows);
                        } else console.log(err);
                    });
                }else res.send("Something went wrong.");
            }
        });
    });
});

// GET SINGLE INFO FROM users BY NAME || return true & false
app.post(`/users/info`, (req, res) =>{
    con.query('SELECT * FROM users WHERE user_name LIKE ?', [req.body.user_name],(err, rows) =>{
        if(!err){
            if(rows.length == 1) res.send(true);
            else res.send(false);
        }
        else console.log(err);
    });
});

// GET SINGLE INFO FROM users BY NAME || return data
app.post(`/users/infos`, (req, res) =>{
    con.query('SELECT * FROM users WHERE user_name LIKE ?', [req.body.user_name],(err, rows) =>{
        if(!err) res.send(rows);
        else res.send(err);
    });
});

// GET SINGLE INFO FROM users BY ID
app.get(`/users/:id`, (req, res) =>{
    con.query('SELECT * FROM users WHERE user_id LIKE ?', [req.params.id],(err, rows) =>{
        if(!err) res.send(rows);
        else console.log(err);
    });
});

// UPDATE THE PASSWORD IN users
app.put('/users/update', (req, res) =>{
    bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {
        bcrypt.compare(req.body.new_password, hash, function(err, result) {
            if (!err) {

                if(result) {
                    con.query('UPDATE users SET user_password = ? WHERE user_id = ?', [hash, req.body.user_id], (err, rows) => {
                        if (!err) {
                            res.send(true);
                            console.log(rows);
                        } else {
                            console.log(err);
                            res.send(false);
                        }
                    });
                }else res.send(false);
            }else res.send(err);
        });
    });
});

// UPDATE THE NAME IN users
app.put('/users/username/update', (req, res) =>{
    con.query('UPDATE users SET user_name = ? WHERE user_id = ?', [req.body.user_name, req.body.user_id], (err, rows)=>{
        if(!err) res.send(rows);
        else console.log(err);
    });
});

// -----------------------------------------

app.use('/login', (req, res) =>{
   res.send({
       token: req.body.token,
       username: req.body.user_name,
       id: req.body.user_id
   });
});

var server =  app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});