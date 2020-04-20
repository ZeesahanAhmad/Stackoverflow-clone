var express=require('express');
var router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//model of person
const Person=require('../../models/Person');
//model of profile
const Profile=require('../../models/Profile');

//@routh:api/profile
//@desc:routes for profile of users
//@access:private
//@method:get
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then((profile)=>{
        if(!profile){
            res.status(404).json({profileError:'profile not found for user'});
        }else{
            res.json(profile);
        }
    })
    .catch((err)=>console.log(err));
});

//@routh:api/profile
//@desc:routes for updating/saving personal user profile
//@access:private
//@method:post
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    var profileValues={};
    profileValues.user=req.user.id;
    if(req.body.username){
        profileValues.username=req.body.username;
    }
    if(req.body.website){
        profileValues.website=req.body.website;
    }
    if(req.body.country){
        profileValues.country=req.body.country;
    }
    if(req.body.portfolio){
        profileValues.portfolio=req.body.portfolio;
    }
    if(typeof req.body.languages!=undefined){
        profileValues.languages=req.body.languages.split(',');
    }
    profileValues.social={}
    if(req.body.youtube){
        profileValues.social.youtube=req.body.youtube;
    }
    if(req.body.facebook){
        profileValues.social.facebook=req.body.facebook;
    }
    if(req.body.instagram){
        profileValues.social.instagram=req.body.instagram;
    }

    // DataBase stuff
    Profile.findOne({user:req.user.id})
    .then((profile)=>{
        if(profile){
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileValues},{new:true})
            .then((profile)=>{
                res.json(profile);
            })
            .catch((err)=>console.log(err));

        }else{
            Profile.findOne({username:profileValues.username})
            .then((profile)=>{
                // if username already exist
                if(profile){
                    res.status(400).json({usernameError:'username already exist'});
                }
                //if username already donot exist
                else{
                    new Profile(profileValues)
                    .save()
                    .then((profile)=>{
                        res.json(profile);
                    })
                    .catch((err)=>console.log(err));

                }
            })
            .catch()

        }
    })
    .catch((err)=>console.log(err));
    
});

//@routh:api/profile/:username
//@desc:routes for getting profile based on username
//@access:public
//@method:get
router.get('/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
    .populate('user',['name','email'])
    .then((profile)=>{
        if(!profile){
            res.status(404).json({usernameError:'username donot exist in database'});
        }else{
            res.json(profile);
        }
    })
    .catch((err)=>console.log('error in getting usrename based profile '+err));
});

//@routh:api/profile/all/user
//@desc:routes for getting all user from database
//@access:public
//@method:get
router.get('/all/user',(req,res)=>{
    Profile.find()
    .populate('user',['name','email'])
    .then((profiles)=>{
        if(!profiles){
            res.status(404).json({alluserError:'no user was found'});
        }else{
            res.json(profiles);
        }
    })
    .catch((err)=>console.log('error in getting usrename based profile '+err));
});

//@routh:api/profile
//@desc:routes for deleting a user from database
//@access:private
//@method:delete

router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //Profile.findOne({user:req.user.id});
    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>{
        Person.findOneAndRemove({_id:req.user.id})
        .then(()=>{
            res.json({success:'user deleted successfully'});
        })
        .catch((err)=>console.log(err));
    })
    .catch((err)=>console.log(err));


});


//@routh:api/profile/workrole
//@desc:routes for adding workrole in database
//@access:private
//@method:post

router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile){
            res.status(404).json({error:'profile not found'});
        }
        const newWorkrole={
            role:req.body.role,
            company:req.body.company,
            country:req.body.country,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            details:req.body.details
        }
        profile.workrole.unshift(newWorkrole);
        profile.save()
        .then(profile=>{
            res.json(profile);
        })
        .catch(err=>console.log(err));

    })
    .catch(err=>console.log(err));

});

//@routh:api/profile/workrole/:w_id
//@desc:routes for deleting workrole in database based on id
//@access:private
//@method:delete
router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        const itemToBeDeleted=profile.workrole.map(item=>item.id).indexOf(req.params.w_id);
        profile.workrole.splice(itemToBeDeleted,1);
        profile.save()
        .then(res.json(profile))
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
})





module.exports=router;
