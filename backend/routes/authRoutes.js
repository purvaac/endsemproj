const express = require('express');
const router = express.Router();
const User =  require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register new user
router.post('/register', async(req, res)=>{
    const {name, email, password, role} = req.body;

    //Role validation
    const validRoles = ['freelancer', 'client', 'both'];
    if(!validRoles.includes(role)){
        return res.status(400).json({error: 'Invalid role. Role must be freelancer, client, or both'});
    }

    try{
        //Check if user already exists
        const userExists =  await User.findOne({email});
        if(userExists){
            return res.status(400).json({error: 'User already exists.'});
        }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //create new user
    const user = new User({
        name, 
        email,
        password: hashedPassword,
        role,
    });

    await user.save();

    res.status(201).json({message: 'User registered successfully'});
    }
    catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error registering user.' });
    }
});

//Login a user
router.post( '/login', async(req, res) => {
    const{email, password} = req.body;

    try{
        //Find user
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({error: 'Invalid email'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: 'Invalid email or password'});
        }

        //generate jwt
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200). json({token, user: {id: user._id, name: user.name, role: user.role}});
    }

    catch(error){
        res.status(500).json({error: 'Error Logging in.'});
    }

});

module.exports = router;


