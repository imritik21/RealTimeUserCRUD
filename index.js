const { faker } = require('@faker-js/faker');
// Get the client
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
// to parse form data
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'imRitik@21',
});
let createRandomUser = () => {

    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}
// A simple SELECT query
// to run query in the database
// let q = "INSERT INTO users (id,username,email,password) VALUES ?";
// let data = [];

// for(let i=1;i<=100;i++){
//     data.push(createRandomUser()); //100 fake data
// }


// console.log(createRandomUser());
// creating route 
// 1 home route 
app.get("/", (req, res) => {
    let q = `SELECT COUNT(*) FROM users`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(results[0]["COUNT(*)"]);
            let count = results[0]["COUNT(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in database");
    }
});
// show routes
app.get("/user/new",(req,res)=>{
    res.render("new.ejs");
});
app.get("/user", (req, res) => {
    let q = `SELECT * FROM users`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            // console.log(results);
            // res.send(results);

            res.render("showUsers.ejs",{users});
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occured in dataBase");
    }
});
// Edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id='${id}'`;
    // pass id as a string 
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(users);
            let user = results[0];
            res.render("edit.ejs",{user});
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occured in dataBase");
    }
});
// update routte
app.patch("/user/:id",(req,res)=>{
    // what we will receivve here
    // pass, new username and id
    // now i know id,username and pass from database
    // so search user from id 
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id='${id}'`;
    // step 2 then check if form pass is same with user pass 
    let {password:formPass,username:newUsername} = req.body;
    
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(users);
            let user = results[0];
            if(formPass != user.password){
                res.send("Wrong Password");
            }
            else{
                // sttep3: then change or update usernname
                // run update query
                let q2 = `UPDATE users SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    // res.send(result);
                    res.redirect("/user");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occured in dataBase");
    }
});


// add route
app.post("/user",(req,res)=>{
    //INSERT INTO users (id,username,email,password)
    //VALUES ("11x","Ritikwa","imritik@gmail.com","1431512");
    let {username,email,password} = req.body;
    let id = uuidv4();
    let q = `INSERT INTO users (id,username,email,password)
    VALUES ("${id}","${username}","${email}","${password}")`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(results);
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occured in dataBase");
    }

});
// delete route
app.delete("/user/:id",(req,res)=>{
    let { id } = req.params;
    let q = `DELETE FROM users WHERE id='${id}'`;
    try {
        connection.query(q, (err, results) => {
            if (err) throw err;
            // console.log(results);
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occured in dataBase");
    }
})
app.listen("8080", () => {
    console.log("server is listening to portt 8080");
});


// connection.end();