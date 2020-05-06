const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const app = express();
const main = express();
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-f1fc3.firebaseio.com",
});
const db = admin.firestore();

main.use("/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//Add a user

//Get all users
app.get("/users", async (req, res) => {
  try {
    const users = [];
    const usersSnapshot = await db.collection("users").get();
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.send(users);
  } catch (err) {
    console.log("Error getting documents", err);
  }
});
//Get a specific user
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await db.collection("users").doc(req.params.userId).get();
    if (!user.exists) {
      throw new Error("user does not exists");
    }
    res.send({
      id: user.id,
      data: user.data(),
    });
  } catch (err) {
    console.log("Error getting document", err);
  }
});
//Update a user
app.put("/users/:userId", async (req, res) => {
  try {
    await db
      .collection("users")
      .doc(req.params.userId)
      .set(req.body, { merge: true });
    res.send("User Updated");
  } catch (err) {
    res.status(500).send("Error Updating document", err);
  }
});
//Delete a user
app.delete("/users/:userId", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.userId).delete();
    res.send("Contact deleted");
  } catch (err) {
    res.status(500).send("Error deleting the document", err);
  }
});
exports.api = functions.https.onRequest(main);
