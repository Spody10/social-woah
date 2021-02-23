const { Schema, model } = require('mongoose');

const UserSchema = new Schema (
    {
        username: { 
            type: String, 
            required: true, 
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        thoughts: [
            { 
            type: Schema.Types.ObjectId,
            ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
},
{
    toJSON: {
        virutals: true,
        getters: true
    },
    // prevent duplicate of _id
    id: false
}
);
// get total count of friends
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});
const User = model('User', UserSchema);

module.exports = User;