const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

const Pool = require('pg').Pool
const DB_DSN = 'SECRET'


// id is index
const dummyUsers = [
  {
    id: 1,
    name: "krobus",
    balance: "10",
  },
  {
    id: 2,
    name: "kr1bus",
    balance: "1022",
  },
  {
    id: 3,
    name: "kr2bus",
    balance: "1023",
  },
  {
    id: 4,
    name: "kr3bus",
    balance: "17",
  },
  {
    id: 5,
    name: "kr4bus",
    balance: "55",
  },
  {
    id: 6,
    name: "kr5bus",
    balance: "10",
  },
];

// get one users
app.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const user = dummyUsers[userID];

  res.json(`{
    "data": ${dummyUsers}
  }`);
});

// pagination endpoint
app.get("/users", (req, res) => {
  return res.json(dummyUsers);
});

// get total balance of all users
app.get("/total-balance/users", (req, res) => {
  let total = 0;
  dummyUsers.forEach((user) => {
    total += user.balance;
  });
  return res.json(total);
});

// create new user
app.post("/users", (req, res) => {
  const data = req.body;
  const newUser = {
    id: dummyUsers.length,
    name: data.name,
    balance: data.balance,
  };
  dummyUsers.push(newUser);
  return res.json(newUser);
});


// call third party api
app.get("/third-party", (req, res) => {
  const apiResponse = axios.get("https://dog.ceo/api/breeds/list/all");
  return res.json(apiResponse);
});


// get data from db
app.get("/db/users", (req,res)=>{
  const pool = new Pool({
    connectionString: DB_DSN
  })
  
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

// insert user into table users
app.post("/db/users", (req,res)=>{
  const data = req.body;
  const pool = new Pool({
    connectionString: DB_DSN
  })
  
  pool.query('INSERT INTO users (name, balance) VALUES ($1, $2) RETURNING *', [data.name, data.balance], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
})

// sample endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
