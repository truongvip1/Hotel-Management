/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions")
const admin = require("firebase-admin");

const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://truong-ac24d-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const express = require("express")
const app = express()
const cors = require("cors")

// var database = firebase.database();

const db = admin.database()
dbRef = admin.database().ref()
app.use(cors({origin: true} ) )
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// routes
app.get("/", (req, res, next) =>
  res.json({message: "Firebase function service is working kaka"})
);


app.get('/user/:id', (req,res)=>{
  res.status(200).send(req.body.id)
})
// create
// add room
app.post('/room/add', (req, res)=>{
  var roomObj={
    reserveID: '',
    number: '',
    type: '',
    name: '',
    status: 0,
    cost: 0,
    description: "",
    image: ''
  }
  roomObj.reserveID = req.body.reserveID;
  roomObj.number = req.body.number;
  roomObj.type = req.body.type;
  roomObj.name = req.body.name;
  roomObj.status = req.body.status;
  roomObj.description = req.body.description;
  roomObj.cost = req.body.reserveID;
  roomObj.image = req.body.image;
  console.log(req.body)
  var postListRef = admin.database().ref('room');
  var newPostRef = postListRef.push();
  newPostRef.set(roomObj);
  res.status(200).send("OK")
})
// add user
app.post('/user/add', (req,res)=>{
  var userObj={
    name: '',
    numberphone: '',
    email: '',
    username: '',
    password: '',
    role: 0,
    img: '',
    address: '',
    salary: 0,
    birthday:'',
    hiredate: '',
    session: ''
  }
  if(req.body.role==2){
    userObj.name=req.body.name
    userObj.email=req.body.email
    userObj.numberphone=req.body.numberphone
    userObj.username=req.body.username
    userObj.password=req.body.password
    userObj.role=req.body.role
  }
  else if(req.body.role==1){
    userObj.name=req.body.name
    userObj.email=req.body.email
    userObj.numberphone=req.body.numberphone
    userObj.username=req.body.username
    userObj.password=req.body.password
    userObj.role=req.body.role
    userObj.address=req.body.address
    userObj.salary=req.body.salary
    userObj.birthday=req.body.birthday
    userObj.hireday=req.body.hireday
  }
  var postListRef = admin.database().ref('user');
  var newPostRef = postListRef.push();
  newPostRef.set(userObj);
  res.status(200).send("OK")
})

// add reservation
app.post('/reservation/add',(req,res)=>{
  reserveObj={
    userID: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
    status: 0,
    moreRequire: "",
    totalPrice: 0
  }
  reserveObj.userID = req.body.userID
  reserveObj.roomType = req.body.roomType
  reserveObj.checkIn = req.body.checkIn
  reserveObj.checkOut = req.body.checkOut
  reserveObj.status = req.body.status
  reserveObj.moreRequire = req.body.moreRequire
  reserveObj.totalPrice = req.body.totalPrice

  var postListRef = admin.database().ref('reservation');
  var newPostRef = postListRef.push();
  newPostRef.set(reserveObj);
  res.status(200).send("OK")
})
// read

// get all users
app.get("/user", (req, res, next) =>
  {
    dbRef.child("user").get().then((snapshot) => {
      if (snapshot.exists()) {
        var listUser = [];
        snapshot.forEach((child)=>{
          listUser.push({
            key: child.key,
            name: child.val().name,
            email: child.val().email,
            username: child.val().username,
            password: child.val().password,
            role: child.val().role,
            img: child.val().img
          });
        });
        res.status(200).send(listUser)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
);

// get all rooms
app.get("/room", (req, res)=>{
  dbRef.child("room").get().then((snapshot) => {
    var listRoom = []
    if (snapshot.exists()) {
      snapshot.forEach((child)=>{
        listRoom.push({
          key: child.key,
          reserveID: child.val().reserveID,
          number: child.val().number,
          type: child.val().type,
          name: child.val().name,
          status: child.val().status,
          description: child.val().description,
          cost: child.val().cost,
          image: child.val().image
        })
      });
      console.log(listRoom)
      res.status(200).send(listRoom)
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
});

// get all reservation
app.get("/reservation",(req, res)=>{
  dbRef.child("reservation").get().then((snapshot) => {
    if (snapshot.exists()) {
      var listReserve = [];
      snapshot.forEach((child)=>{
        listReserve.push({
          key: child.key,
          userID: child.val().userID,
          roomType: child.val().roomType,
          checkIn: child.val().checkIn,
          checkOut: child.val().checkOut,
          status: child.val().status,
          moreRequire: child.val().moreRequire,
          totalPrice: child.val().totalPrice
        });
      });
      res.status(200).send(listReserve)
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
);

// get login
app.post("/user/login",(req, res)=>{
  var usr = req.body.username
  var pass = req.body.password
  dbRef.child("user").get().then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child)=>{
        var usrObj
        if(child.val().username==usr&&child.val().password==pass){
          usrObj = {
            key: child.key,
            name: child.val().name,
            email: child.val().email,
            username: child.val().username,
            password: child.val().password,
            role: child.val().role,
            img: child.val().img
          }
          console.log(usrObj)
          res.status(200).send(usrObj)
        }
      });
      res.status(300).send("NOT FOUND")
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
})
// update
// update room by id
app.put("/room/update/:id",(req, res)=>{
  var roomObj={
    reserveID: '',
    number: '',
    type: '',
    name: '',
    status: 0,
    cost: 0,
    description: "",
    image: ''
  }
  roomObj.reserveID = req.body.reserveID;
  roomObj.number = req.body.number;
  roomObj.type = req.body.type;
  roomObj.name = req.body.name;
  roomObj.status = req.body.status;
  roomObj.description = req.body.description;
  roomObj.cost = req.body.reserveID;
  roomObj.image = req.body.image;
  console.log(req.params.id)
  admin.database().ref('/room/'+req.params.id).set(roomObj, (error)=>{
    if(error){
      console.log(error)
    } else{
      res.status(200).send('OK')
    }
  })
});

// update user by id role 2
app.put("/user/update/2/:id", (req, res)=>{
  var userObj={
    name: '',
    numberphone: '',
    email: '',
    username: '',
    password: '',
    role: 0,
    img: '',
    address: '',
    salary: 0,
    birthday:'',
    hiredate: '',
    session: ''
  }
  userObj.name=req.body.name
  userObj.email=req.body.email
  userObj.numberphone=req.body.numberphone
  userObj.username=req.body.username
  userObj.password=req.body.password
  userObj.img=req.body.img
  userObj.role=req.body.role
  admin.database().ref('/user/'+req.params.id).set(userObj, (error)=>{
    if(error){
      console.log(error)
    } else{
      res.status(200).send('OK')
    }
  })
})
// delete
exports.api = functions.https.onRequest(app);