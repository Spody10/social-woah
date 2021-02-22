const { Thought, User } = require('../models');

const thoughtController = {
    // get thoughts
    getAllThoughts (req, res) {
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    // get one thought by id
    getThoughtById ({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found by id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
        })
    },

    // add new thought
    addThought ({ params, body }, res) {
        Thought.creat(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this id.' });
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err));
    },
    
    // update thought
    updateThought () {

    },

    //reaction to thought
    addReaction () {

    },

    // remove reaction
    removeReaction () {

    },

    // delete thought

    deleteThought () {

    }


}