const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/date-format');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: SChema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => formatDate(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true, 
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => formatDate(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reaction: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought