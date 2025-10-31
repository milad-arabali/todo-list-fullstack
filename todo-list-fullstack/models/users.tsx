import {model, models, Schema} from "mongoose";


const usersSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    family: String,
    todos: [{
        title: String,
        status: String
    }],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    }
})

const User = models.User || model('User', usersSchema);
export default User;
