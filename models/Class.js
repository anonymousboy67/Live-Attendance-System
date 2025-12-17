import mongoose from "mongoose";

const classSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true,
    },
    teacher:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', required:true
    },
    student:[{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    }]
},
{
    timestamps:true
}
)

const Class=mongoose.model('Class', classSchema)
export default Class;