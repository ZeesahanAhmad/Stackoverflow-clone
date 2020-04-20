const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var QuestionSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:'myPerson'  
    },
    textone:{
        
            type:String,
            require:true
    },
    texttwo:{
        
            type:String,
            require:true
    },
    name:{
        type:String
    },
    answer:[
        {
            user:{
                type:Schema.Types.ObjectId,
                // require:true,
                ref:'myPerson' 
            },
            text:{
                type:String

            },
            name:{
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    upvote:[{
        user:{
        type:Schema.Types.ObjectId,
        // require:true,
        ref:'myPerson' 
        }
    }],
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports=Question=mongoose.model('myQuestion',QuestionSchema);