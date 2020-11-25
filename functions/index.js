const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors')
const { db } = require("./util/admin")

const app = express();
app.use(cors())

getProducts = (req, res) => {
  db.collection('listProduct')
      .get()
      .then(async data => {
        let resData = []
        await data.forEach(item => {
          resData.push(item.data())
        })
        return res.json(resData);
      })
}

app.get('/products',getProducts)

exports.api = functions.https.onRequest(app)

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
