const express = require("express");
const path = require("path");
const mongojs = require("mongojs");

//  Setup init
const app = express();
const port = process.env.PORT || 3000;
const db = mongojs("clientkeeper", ["clients"]);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//  Routes
app.get("/", (req, res) => {
  res.send("Please use /api/clients");
});

//  Show clients
app.get("/api/clients", (req, res) => {
  db.clients.find().sort({ first_name: 1 }, (err, clients) => {
    if (err) {
      res.send(err);
    } else {
      console.log("Sending clients to client side");
      res.json(clients);
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
