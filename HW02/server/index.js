const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "apple2568",
  database: "dbhw01",
});

// 修改 room 表格的結構
db.query(`CREATE TABLE IF NOT EXISTS room (
  Room_ID INT PRIMARY KEY,
  Hotel_ID INT,
  Room_type VARCHAR(255),
  Price DECIMAL(10, 2),
  Status VARCHAR(255),
  FOREIGN KEY (Hotel_ID) REFERENCES hotel(Hotel_ID)
)`);

app.post("/create", (req, res) => {
  const Room_ID = req.body.Room_ID;
  const Hotel_ID = req.body.Hotel_ID;
  const Room_type = req.body.Room_type;
  const Price = req.body.Price;
  const Status = req.body.Status;

  db.query(
    "INSERT INTO room (Room_ID, Hotel_ID, Room_type, Price, Status) VALUES (?,?,?,?,?)",
    [Room_ID, Hotel_ID, Room_type, Price, Status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/room", (req, res) => {
  db.query("SELECT * FROM room", (err, result) => {
    if (err) {
      console.log(err);
      
    } else {
      res.send(result);
    }
  });
});

app.put("/update/:Room_ID", (req, res) => {
  const Room_ID = req.body.Room_ID;
  const Price = req.body.Price;
  db.query(
    "UPDATE room SET Price = ? WHERE Room_ID = ?",
    [Price, Room_ID],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating room");
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:Room_ID", (req, res) => {
  const Room_ID = req.params.Room_ID;
  db.query("DELETE FROM room WHERE Room_ID = ?", Room_ID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
