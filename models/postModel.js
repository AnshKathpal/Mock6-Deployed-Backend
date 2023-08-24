const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

    username : String,
    title : String,
    content : String,
    category : String,
    date : String,
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    likes : {
        type : [String], default : []
    },
    comments : {
        type : [String] , default : []
    }
    
},{
    versionKey : false
}

)

const postModel = mongoose.model("blogs", postSchema)

module.exports = {
    postModel
}