const express = require("express");
const path = require("path");
const mongojs = require("mongojs");
const cors = require("cors");

//  Setup init
const app = express();
const port = process.env.PORT || 3000;
const db = mongojs("clientkeeper", ["clients"]);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

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
      res.json(clients);
    }
  });
});

//  Add a client
//  TODO: avoid duplicates
app.post("/api/clients", (req, res) => {
  db.clients.insert(req.body, (err, client) => {
    if (err) {
      res.send(err);
    } else {
      res.json(client);
    }
  });
});

//  Update a client
//  TODO: avoid updating to an existing client
app.put("/api/clients/:id", (req, res) => {
  const id = mongojs.ObjectId(req.params.id);
  db.clients.findAndModify(
    {
      query: { _id: id },
      update: {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone
        }
      },
      //  Add if client does not exist
      new: true
    },
    (err, client) => {
      if (err) {
        res.send(err);
      } else {
        res.json(client);
      }
    }
  );
});

//  Delete client
app.delete("/api/clients/:id", (req, res) => {
  const id = mongojs.ObjectId(req.params.id);
  db.clients.remove({ _id: id }, (err, client) => {
    if (err) {
      res.send(err);
    } else {
      res.json(client);
    }
  });
});

//  Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
