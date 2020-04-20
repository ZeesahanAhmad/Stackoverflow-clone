var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var profileSchema=new Schema({
  user:{
      type:Schema.Types.ObjectId,
      require:true,
      ref:'myPerson'
  },
  username:{
      type:String,
      require:true,
      max:50
  },
  website:{
      type:String
  },
  country:{
      type:String
  },
  languages:{
      type:[String],
      require:true
  },
  portfolio:{
      type:String
  },
  workrole:[{
      role:{
          type:String,
          require:true
      },
      company:{
          type:String
      },
      country:{
          type:String
      },
      from:{
          type:Date,
          require:true
      },
      to:{
          type:Date
      },
      current:{
          type:Boolean,
          default:false
      },
      details:{
          type:String
      }
  }],
  social:{
      youtube:{
        type:String
      },
      facebook:{
        type:String
      },
      instagram:{
        type:String  
      }

  }

});
//creating model
module.exports=Profile=mongoose.model('myProfile',profileSchema);