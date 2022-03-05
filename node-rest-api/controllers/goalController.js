const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// Get Goals

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })

    res.status(200).json(goals)
})

// Set a new goal

const setGoal = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400).json({message: 'please add a text!'})
        throw new Error('please add a text Field!')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(201).json(goal);
})

// Update a single goal

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if(!goal){ 
        res.status(400);
        throw new Error('goal not found');
    };

    const user = await User.findById(req.user.id)

    //Check if user exists
    if(!user){
        res.status(401);
        throw new Error('User not found!');
    };

    // Make sure only the loged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized')
    };

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new:true})

    res.status(200).json(updatedGoal)
})

// delete a goal

const deleteGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id);

    if(!goal){
        res.status(400)
        throw new Error('there is no goal to delete')
    }

    const user = await User.findById(req.user.id)

    //Check if user exists
    if(!user){
        res.status(401);
        throw new Error('User not found!');
    };

    // Make sure only the loged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized')
    };

    await goal.remove();

    res.status(200).json(req.params.id)
})


module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}