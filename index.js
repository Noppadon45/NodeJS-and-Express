const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2/promise");

app.use(bodyParser.json());

const port = 8000;
let conn = null;

const initdatasql = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorial",
  });
};

//ดูข้อมูล
app.get("/users", async (req, res) => {
  const results = await conn.query("SELECT * FROM user");
  res.json(results[0]);
});

//เพิ่มข้อมูล
app.post("/user", async (req, res) => {
  try {
    let user = req.body;
    const results = await conn.query("INSERT INTO user SET ?", user);
    res.json({
      Message: "Add ok",
      data: results[0],
    });
  } catch (error) {
    res.status(500).json({
      Massage: "Error Server",
    });
  }
});

//สร้างPath = put
app.get("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * FROM user WHERE ID = ?", id);
    if (results[0].length > 0) {
      res.json({
        Message: "Get ID = " + id,
        data: results[0],
      });
    } else {
      res.status(404).json({
        Massage: "Error Client",
      });
    }
  } catch (error) {
    res.status(500).json({
      Massage: "Error Server",
    });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let update = req.body;
    const results = await conn.query("UPDATE user SET ? WHERE id = ?", [
      update,
      id,
    ]);
    res.json({
      Message: "Updated",
      data: results[0],
    });
  } catch (error) {
    res.status(500).json({
      Massage: "Error Server",
    });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("DELETE FROM user WHERE id = ?", id);
    res.json({
      Message: "Deleted",
      data: results[0],
    });
  } catch (error) {
    res.status(500).json({
      Massage: "Error Server",
    });
  }
});

app.listen(port, async (req, res) => {
  await initdatasql()
  console.log("listening on port " + port);
});
