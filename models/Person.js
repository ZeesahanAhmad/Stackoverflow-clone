const mongoose=require('mongoose');
const schema= mongoose.Schema;

const personSchema=new schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    userName:{type:String},
    profilePic:{type:String},
    date:{type:Date,default:Date.now}
});
Person=mongoose.model('myPerson',personSchema);
module.exports=Person;