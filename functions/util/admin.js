const  admin  = require('firebase-admin');
const firebase = require('firebase')
admin.initializeApp();
const config = require("../util/config")
firebase.default.initializeApp(config)
//database
const db = firebase.default.firestore()

module.exports = { admin,db, firebase }