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
    addThought ({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
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
    updateThought (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id }, 
            {thoughtText: req.body.thoughtText}, 
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'Thought not found by id.'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //reaction to thought
    addReaction ({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'Thought not found by id.' })
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // remove reaction
    removeReaction ({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId} } },
            { new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    },

    // delete thought

    deleteThought ({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            return User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this username.' });
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController;