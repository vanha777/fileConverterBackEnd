const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
//const register = require('./controllers/register.js');
//const getKey = require('./controllers/handleGetKey.js');

const multer = require("multer");
const fs = require("fs");
const convert = require('./controllers/converter.js');
const getObjects = require('./controllers/getObjects.js');



require('dotenv').config();









const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => { res.json('dataBase') });

//get signature for front-end to sign aws-s3 upload
app.post('/getSignedRequest', (req, res) => {
  const request = req.body.file[0];
  console.log(request)
  const s3Params = {
    Bucket: 'imgconverter',
    Key: request.name,
    Expires: 60,
    ContentType: request.type,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${request.name}`
    };
    res.json(returnData)
    console.log(returnData)
  })
  //end.

  {/*Promise.all(request.map((request,index)=>{
    return handleGetKey(request.name,request.type)
  })).then((result)=>console.log(result))*/}

});


app.get('/pdfConverter', (req, res) => { convert.handleConvert(req, res) });




//confirgue multer() to read input files
const storage = multer.memoryStorage({
  /*destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },*/
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}`);
  },
})
const upload = multer({
  storage: storage
});
//end.

//convert file from front-end and return PDF files on amazon s3
app.post("/upLoad", upload.array("files"), (req, res, next) => {
  //if server crashed => failed to read input files
 
  // Get the uploaded file from memory
  console.log(req.files)
 

  //convert file from Images to PDF and upload to Amazon S3
  convert.handleConvert(req, res, req.files)
  
  //return to front-end.



});

// Get All Objects List
app.get('/files', (req, res) => { getObjects.handleGetObjects(req, res) });



//app.post('/signin', signin.handleSignin(bcrypt, dataBase));
//app.post('/register', register.handleRegister(bcrypt, dataBase));
//app.get('/profile/:id', getUser.getUser(dataBase))







app.listen(process.env.PORT || 777, () => {
  console.log(`app is active on ${process.env.PORT}`);
})