const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../db/user');
const router = express.Router();


router.get('/', (req,res) =>{
  res.render('auth/loginsignup');
});
//user can log in with valid email/password
//users cannot login with blank or missing email or blank or incorrect password
function validUser(user){
  const validEmail = typeof user.email == 'string' &&
          user.email.trim() != '';
  const validPassword = typeof user.password =='string' &&
          user.password.trim() != '' &&
          user.password.trim().length >= 6;
  return validEmail && validPassword;
}

router.post('/signup', (req,res, next) =>{
  if(validUser(req.body)){
    User
      .getOneByEmail(req.body.email)
      .then(user => {
        console.log('user', user);
        //if user wasnt found
        if(!user){
          //we have a new user!! sign em up!
          //hash the password
          bcrypt.hash(req.body.password, 10)
            .then((hash)=>{
              //put em in
              const user = {
                email: req.body.email,
                password: hash,
                fave_service:req.body.service,
                created_at: new Date()
              };
              User
                .create(user)
                .then(id=>{
                  res.json({
                    id,
                    message: '⛱'
                  });
                });
            });
        } else{
          // we already got 'em
          next(new Error('Email in use'));
        }

      });
  } else{
    // send error;
    next(new Error("Invalid User"));
  }
});
router.post('/login',(req,res,next)=>{
  //find user by email
  if(validUser(req.body)){
    //are they in the database?
    User
      .getOneByEmail (req.body.email)
      .then(user=> {
        console.log('user',user);
        if(user){
          //compare the password with our hashed password
          bcrypt
            .compare(req.body.password, user.password)
            .then((result)=>{//did they enter the correct password?
              if(result){ // they entered correct password

                const isSecure = req.app.get('env')!='development';
                res.cookie('user_id', user.id ,{
                  httpOnly: true,
                  signed: isSecure,
                  secure: true
                });
                res.json({
                  message:'Logged In!'
                });
                res.render('index', { title: 'Hey', message: 'Hello There!' });

              } else{//nope try again
                next(new Error('Incorrect Password'));
              }
            });
        }else {
          next(new Error('Sorry Invalid Login'));
        }
      });
  } else{
    next(new Error('Invalid Login'));
  }
});
module.exports = router;
