const express = require("express");
const cors = require("cors");
const sql = require("mysql");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const keyp = "samay@6751@guru@bapasitaram_9898134603";

const db = sql.createPool({
  user: "surapuradada123",
  password: "1234567890",
  database: "surapura123",
  host: "db4free.net",
  port: 3306,
  connectionLimit: 100,
  multipleStatements: true,
});

app.post("/api/book", (req, res) => {
  const name = req.body.name;
  const village = req.body.village;
  const phNo = req.body.phNo;
  const key = req.body.key;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  const date = yyyy + "-" + mm + "-" + dd;
  const time = new Date();

  if (key === keyp) {
    let entry = [];
    const q1 = "SELECT * FROM entry;";
    db.query(q1, (err, result) => {
      for (i in result) {
        entry = [...entry, JSON.parse(JSON.stringify(result[i]))];
      }
      if (entry[0].entry == "off") {
        res.send({
          type: "fail",
          msg: "Currently booking is closed",
        });
      } else {
        const q2 = `SELECT count(*) as tBook FROM bookings WHERE date=?;`;
        db.query(q2, [date], (error1, data) => {
          if (JSON.parse(JSON.stringify(data[0])) >= entry[0].epd) {
            res.send({
              type: "fail",
              msg: "Currently booking is closed",
            });
            const q = "UPDATE entry SET entry='off'";
            db.query(q, (error2, data) => {});
          } else {
            const addData = async () => {
              const q3 =
                await `INSERT INTO bookings (name,village,phNo,date,task,tokenId,time) values ('${name}','${village}','${phNo}','${date}',"n",'${
                  JSON.parse(JSON.stringify(data[0])).tBook + 1
                }','${time}');`;

              await db.query(q3, (error3, result3) => {
                res.send({
                  error: error3,
                  reseult: result3,
                  type: "pass",
                  msg: "Booked",
                  data: {
                    name: name,
                    village: village,
                    phNo: phNo,
                    date: date,
                    tokenId: JSON.parse(JSON.stringify(data[0])).tBook + 1,
                    time: time,
                    task: "n",
                  },
                });
              });
            };
            addData();
          }
        });
      }
    });
  } else {
    res.send({
      type: "fail",
      msg: "Currently booking is closed",
    });
  }
});
app.get("/", (req, res) => {
  res.send("<h1>Sura Pura Dada Server</h1>");
});
app.get("/api/check", (req, res) => {
  const q1 = "SELECT * from entry";
  db.query(q1, (err, result) => {
    res.send(JSON.parse(JSON.stringify(result[0])));
  });
});
app.post("/api/updateentry", (req, res) => {
  const key = req.body.key;
  const entry = req.body.entry;
  const epd = req.body.epd;
  if (key === keyp) {
    const q1 = `UPDATE entry SET entry='${entry == true ? "on" : "off"}' and epd='${epd}'`;
    db.query(q1, (err, result) => {});
  } else {
    res.send({ type: "error" });
  }
});

app.post("/api/edit", (req, res) => {
  const key = req.body.key;
  const name = req.body.name;
  const phNo = req.body.phNo;
  const tokenNo = req.body.tokenId;
  const date = req.body.date;
  var today = new Date(date);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  const Ndate = yyyy + "-" + mm + "-" + dd;
  const q = req.body.q;
  if (key === keyp) {
    const q1 = `UPDATE bookings SET task='${q}' where tokenId='${tokenNo}' and name='${name}' and phNo='${phNo}' and date='${Ndate}';`;
    db.query(q1, (err, result) => {});
    res.send({
      type: "error",
    });
  } else
    res.send({
      type: "error",
    });
});

app.post("/api/todayentry", (req, res) => {
  const key = req.body.key;

  if (key === keyp) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    const date = yyyy + "-" + mm + "-" + dd;
    const q1 = `SELECT * FROM bookings where date='${date}'`;
    db.query(q1, (err, results) => {
      let data = [];
      for (i in results) {
        data = [...data, JSON.parse(JSON.stringify(results[i]))];
      }
      res.send({ type: "success", data });
    });
  } else {
    res.send({ type: "error" });
  }
});
app.post("/api/allentry", (req, res) => {
  const key = req.body.key;

  if (key === keyp) {
    const q1 = `SELECT * FROM bookings;`;
    db.query(q1, (err, results) => {
      let data = [];
      for (i in results) {
        data = [...data, JSON.parse(JSON.stringify(results[i]))];
      }
      res.send({ type: "success", data });
    });
  } else {
    res.send({ type: "error" });
  }
});
app.post("/api/verifier", (req, res) => {
  const name = req.body.name;
  const village = req.body.village;
  const phNo = req.body.phNo;

  const tokenId = req.body.tokenId;
  const date = req.body.date;
  const key = req.body.key;
  if (key === keyp) {
    const q1 = `SELECT task FROM bookings WHERE name='${name}' and village='${village}' and phNo='${phNo}' and tokenId='${tokenId}' and date='${date}';`;
    db.query(q1, (err, result) => {
      
      res.send(result[0]);
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Running on http://localhost:3001");
});
