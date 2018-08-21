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
app.post("/api/clients", (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    res.sendStatus(403);
  } else {
    //  Check if email exists
    db.clients.findOne({ email }, (err, client) => {
      if (err) res.send(err);
      else if (client) {
        res.status(403).send("Email exists");
      } else {
        db.clients.insert(req.body, (err, client) => {
          if (err) {
            res.send(err);
          } else {
            res.json(client);
          }
        });
      }
    });
  }
});

//  Update a client
app.put("/api/clients/:id", (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email || !phone) {
    res.sendStatus(403);
  } else {
    //  Check if email already exists
    const id = mongojs.ObjectId(req.params.id);
    db.clients.findOne({ email }, (err, client) => {
      if (err) res.send(err);
      else if (client._id != req.params.id) {
        res.status(403).send("Email exists");
      } else {
        //  Does not exist
        db.clients.findAndModify(
          {
            query: { _id: id },
            update: {
              $set: {
                first_name,
                last_name,
                email,
                phone
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
      }
    });
  }
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
