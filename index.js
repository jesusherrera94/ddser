var express = require('express');
var bodyParser = require("body-parser");
var cryptoJS = require("crypto-js");
var app = express();
var firebase = require('firebase')
// Modifique esta línea con el config que sale en su proyecto firebase
const config = {
    apiKey: "AIzaSyBdozx5BUSVt5spx2WmLB41_f4qCNC--4w",
    authDomain: "diet-design.firebaseapp.com",
    databaseURL: "https://diet-design.firebaseio.com",
    projectId: "diet-design",
    storageBucket: "diet-design.appspot.com",
    messagingSenderId: "983533221114"
};

var users = {};
var ind= 0;
firebase.initializeApp(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/',(req,res)=>{
res.send('¡Hola!');
res.end();
})
app.post('/login', (req,res) => {
    var truster = '42';
    
    var id = req.body.id
    var userEmail = req.body.user
    var userPassword = req.body.pass

    var idDecrypted = cryptoJS.AES.decrypt(req.body.id,truster);
    var userDecrypted = cryptoJS.AES.decrypt(userEmail,truster);
    var passDecrypted = cryptoJS.AES.decrypt(userPassword,truster);
    var authdata = firebase.auth().currentUser
    
    firebase.auth().signInWithEmailAndPassword(userDecrypted.toString(cryptoJS.enc.Utf8), passDecrypted.toString(cryptoJS.enc.Utf8))
        .then(
            function(user){

                if(Object.values(users).indexOf(user.email) == -1){
                    users[ind]=user.email;
                    ind++;
                    res.send('../index.html');
                    res.end();
                }else{
                    res.send('usuario logeado previamente');
                    res.end();
                }
                res.end();
        }
        )
        .catch(
          function(error){
              //Cuando no hay conexión a internet en el servidor
              //auth/network-request-failed
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            res.send(errorCode);
            res.end();
          }
        )
});
app.post('/logout',(req,res)=>{
    console.log('entró a logout');
    console.log(req.body.user)
    firebase.auth().signOut().then(function() {
        console.log('deslogeo exitoso')
       users[Object.values(users).indexOf(req.body.user)]='';
       res.send('x')
       res.end();
      }).catch(function(error) {
        
      });
})

//_________________________________________________________________
app.listen(process.env.PORT || 8080);