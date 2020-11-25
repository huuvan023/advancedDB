const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors')
const { db ,admin } = require("./util/admin")
const config = require('./util/config')

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
uploadImage = (req,res) => {

    const Busboy = require("busboy");

    const path = require("path");

    const os = require("os");

    const fs = require("fs");

    const busboy = new Busboy({ headers: req.headers });

    let imageToBeUploaded = {};
    let imageFileName;
    if( req.headers['content-length'] / 1024 > 5000 ) {
        res.status(400).json({
            error: "This file is too large!"
        })
    }
    busboy.on("file", (fieldName, file, fileName, enCoding, mimeType) => {
        if( mimeType !== "image/jpeg" && mimeType !== "image/jpg" && mimeType !== "image/png" ) {
            return res.status(400).json({
                error: "Only .jpeg or .jpg or .png are allowed !",
            })
        }
        const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filePath, mimeType };
        file.pipe(fs.createWriteStream(filePath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contenType: imageToBeUploaded.mimeType
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return imageUrl
            })
            .then((url) => {
                return res.json(
                    { message: "Image uploaded successfully!", url }
                );
            })
            .catch( error => {
                console.log(error);
                return res.status(400).json({ error: error.code })
            })
    })
    busboy.end(req.rawBody);
}

app.get('/products',getProducts);
app.post('/upload', uploadImage)

exports.api = functions.https.onRequest(app)

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
