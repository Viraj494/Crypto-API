const User = require('../models/userModel');
const creatError = require('../utills/appError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Register user
exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(user){
            return next(new creatError('User already exists!', 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        //Assign JWT to user
        const token = jwt.sign({_id: newUser._id}, 'secretkey123', {
            expiresIn: '90d',
        });

        res.status(201).json({
            status: 'success',
            message:  'User created successfully!',
            token,
            user: {
                _id : newUser._id,
                name : newUser.name,
                email : newUser.email,
                role : newUser.role
            }
        });
    } catch (error) {
        next(error)
    }
};

//Login user
exports.login = async (req, res, next)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return next(new creatError('User not found', 404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return next(new creatError('Invalid Usename or Password', 401));
        }

        const token = jwt.sign({_id: user._id}, 'secretkey123', {
            expiresIn: '90d',
        });

        res.status(201).json({
            status:'success',
            token,
            message: 'Logged in Successfully!',
            user: {
                _id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        })

    } catch (error) {
        next(error);
    }
};