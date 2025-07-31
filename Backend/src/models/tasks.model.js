
import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        text:{
            type:String,
            required: true
        },
        due:{
            type: Date,
            required:true,
        },
        done:{
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category:{
            type:String,
        },
    }
)

const listItemSchema = new Schema(
    {
        text:{
            type: String,
            required: true,
        }
    }
)

const listSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        items: [listItemSchema],
        due: {
            type: Date,
            required:true
        },
        done:{
            type: Boolean,
            default: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category:{
            type:String,
        },
    }
)

const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", listSchema);

export {Task, List};