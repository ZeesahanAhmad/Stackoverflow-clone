var express=require('express');
var router=express.Router();
const passport=require('passport');
// load Person model
const Person=require('../../models/Person');
// load Profile model
const Profile=require('../../models/Profile');
// load Question model
const Question=require('../../models/Question');


//@routh:api/question
//@desc:routes for getting all asked question
//@access:public
//@method:get

router.get('/',(req,res)=>{
    Question.find()
    .sort({date:'desc'})
    .then(questions=>{
        res.json(questions);
    })
    .catch(err=>console.log(err));
});

//@routh:api/question
//@desc:routes for question 
//@access:private
//@method:post

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
         const newQuestion=new Question({
             user:req.user.id,
             textone:req.body.textone,
             texttwo:req.body.texttwo,
             name:req.body.name

         });
         newQuestion
         .save()
         .then(question=>{
             res.json(question);
         })
         .catch(err=>console.log('error in pushing question '+err));
     });
//@routh:api/question/answer/:id
//@desc:routes for posting answer to question
//@access:private
//@method:post

router.post('/answer/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Question.findById(req.params.id)
    .then(question=>{
        var newAnswer={};
        newAnswer.user=req.user.id;
        newAnswer.text=req.body.text;
        newAnswer.name=req.body.name;

        question.answer.unshift(newAnswer);
        question.save()
        .then(question=>{
            res.json(question);
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err));
});

//@routh:api/question/upvote:id
//@desc:routes for upvote to question
//@access:private
//@method:post

router.post('/upvote/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Question.findById(req.params.id)
    .save(question=>{
        if(question.upvote.filter(vote=>vote.user.toString()===req.user.toString().length>0) ){
            res.status(400).json({already:'already voted'});
        }
        question.upvote.unshift({user:req.user.id});
        question.save()
        .then(question=>res.json(question))
        .catch(err=>console.log(err))
        
    })
    .then(err=>console.log(err));


});



module.exports=router;
