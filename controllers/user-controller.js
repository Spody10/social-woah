const { User } = require('../models');

const userController = {
    // gets all the users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'friends',
            select:'__v'
        })
        .select('__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    // get specific user by id
    getUserByID({ params }, res) {
        User.findOne({ _id: params.id})
        .populate({
            path: 'friends',
            select: '__v'
        })
        .select('__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    // create user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user
    updateUser({ params, body }, res) {
        User.findByIdAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found with this id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData => {
                res.status(404).json({ message: 'User not found with this id.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = userController;