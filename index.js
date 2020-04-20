var express=require('express');
var app=express();
var passport=require('passport');
const ejs=require('ejs');
var path=require('path');
// this module is for database connection
var mongoose=require('mongoose');
//bodyparser is required to work with json that will be exported from other local module and also to work with url parsing.
var bodyparser=require('body-parser');
//to set static folder
app.use(express.static(path.join(__dirname,'public')));
//to set views folder
app.set('view engine','ejs');



//this local module is required to work with api routes from routes folder 
var auth=require('./routes/api/auth');
var profile=require('./routes/api/profile');
var questions=require('./routes/api/questions');



app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());



var port=process.env.PORT||3000;
//mongodb configuration
var db=require('./setup/myURL').mongoURL;
//attempt to connect to mongodb
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>console.log('mongoDB connected successfully'))
.catch((err)=>console.log(err));

// passport middleware
app.use(passport.initialize());
// configuration for jwt strategy
require('./strategies/jsonwtStrategy')(passport);


          
// //this routes is for testing purpose.
// app.get('/',(req,res)=>{
//     res.send("hello");
// });


//middleware that uses actual routes from other local file(auth.js).
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/questions',questions);






app.listen(port);