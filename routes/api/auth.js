var express=require('express');
var router=express.Router();
var passport=require('passport');
var jsonwt=require('jsonwebtoken');
var bcrypt=require('bcryptjs');
var mongoose=require('mongoose');
var key=require('../../setup/myURL').secret;



//@routh:/api/auth
//@desc:just for testing purpose
//@access:public
//@method:get
router.get('/',(req,res)=>{
    res.json({test:'test for auth is successful'});
});
//@routh:api/auth/register
//@desc:routes for registration of users
//@access:public
//@method:post
var Person=require('../../models/Person');
router.post('/register',(req,res) =>{
    Person.findOne({email:req.body.email})
    .then((person)=>{
        
        
        if(person){
            return res.status(400).json({emailError:"this email id already exist"});
        }
        else{
            var myPerson=new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password

            })

            //code to encrypt password.
            bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(myPerson.password, salt, (err, hash)=> {
            
            if(err) throw err;
            myPerson.password=hash;
            myPerson.save()
            .then((person)=>{
                res.json(person);
            })
            .catch((err)=>console.log(err));
    });
});

        }
    })
    .catch((err)=>console.log(err));

});

//@routh:api/auth/login
//@desc:routes for login
//@access:public
//@method:post
router.post('/login',(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    Person.findOne({email})
    .then((person)=>{
        if(!person){
            return res.status(404).json({emailError:'email not found'});
        }
        // comparing password and hash passwod from database.
        bcrypt.compare(password, person.password)
        .then((isCorrect) => {
            if(isCorrect){
                // res.json({success:'login Successfull !'});
                // use payload and create token for user
                var payload={
                    id:person.id,
                    name:person.name,
                    email:person.email
                }
                jsonwt.sign(
                    payload,key,{ expiresIn: 60 * 60 },(err,token)=>{
                        if(err) throw err;
                        else{
                            res.json({
                                success:"true",
                                token: "Bearer " + token

                            });
                        } }
                      );




            }else{
                res.status(400).json({loginError:'password is wrong'});
            }
            
        })
        .catch((err)=>{
            console.log(err)});
            
        })
    .catch((err)=>{
        console.log(err);
    })
});


//@routh:api/auth/profile
//@desc:routes for profile of users
//@access:private
//@method:get
router.get('/profile',passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.json(req.user);
    // res.json({
    //     // id:req.user.id,
    //     // name:req.user.name,
    //     // email:req.user.email

    // });

});

module.exports=router;
