const express     = require('express')
      bcrypt      = require('bcryptjs')
      ObjectID    = require('mongodb').ObjectID
      jwt         = require('jsonwebtoken')
      verifyToken = require('../config/verifyToken')
      verifySaldo = require('../config/verifySaldo')
      config      = require('../config/config');


module.exports = function(app) { 
    var User = require('../models/users');
    
    // login function [email & passwd] required
    login = function(req, res) {
        User.findOne({
                'email' : req.body.email
            },
            {
                'email' : 1,
                'passwd': 1,
            },
            function(err, user) {
                // handler errors like email not existing
                if (err) 
                    return res.status(500).json({
                        message : 'Error on server.',
                        token   : null
                    });
                if (!user) 
                    return res.status(404).json({
                        message : "Email doesn't exist.",
                        token   : null
                    });
                //checking passwd
                var passwordIsValid = bcrypt.compareSync(req.body.passwd, user.passwd);
                
                // bad Password
                if (!passwordIsValid) 
                    return res.status(401).json({
                        message : 'Password invalid',
                        token   : null
                    });
                // Generating auth token
                var token = newToken(user);
                res.status(200).json({
                    id      : user._id,
                    message : 'Authenticated',
                    token   : token
                });
            }
        );
    }
    signup = function(req, res) {
        // Registration function [ username && 
        //                            email && 
        //                       first name && 
        //                        last name ] required
        User.create({
                userName     : req.body.userName,
                email        : req.body.email,
                name         : { 
                    first    : req.body.first_name,
                    last     : req.body.last_name
                },
                passwd       : bcrypt.hashSync(req.body.passwd, 8)
            },
            function(err, user) {
                if (err){
                    console.log(err); 
                    return res.status(500).json({
                        message : 'Error on server.',
                        token   : null
                    })
                }
                else{
                    var token = newToken(user);
                    res.status(200).send({
                        id      : user._id,
                        message : 'Registered & Authenticated',
                        token   : token,
                    });
                }
            });
    }
    // New Token function for auth (JWT)
    newToken = function(user){
        return jwt.sign({
                 id: user._id
               }, config.secret, {
                 expiresIn: 86400 // expires in 24 hours
               });
    }
    // Get User by _id or default owner request
    getUser = function(req, res) {
        var userid = req.params.user_id || req.userId;
        User.findOne({
            "_id": userid
        }, {
            passwd: 0
        }, function(err, user) {
            if (err)
                res.send(err)
            res.json(user);
        });
    }
    // Getting all users registered to select to whom interact
    getUsers = function(req,res){
        User.find({
        },{
            transactions : 0,
            passwd       : 0
        },function(err,users){
            if (err)
                res.send(err)
            res.json(users);
        });
    }
    // Get own balance, similar to getUser
    getBalance = function(req, res) {
        var userid = req.params.user_id || req.userId;
        User.findOne({
            _id: userid
        }, {
            balance  : 1,
            currency : 1
        }, function(err, user) {
            if (err)
                res.send(err)
            res.json(user);
        });
    }
    // Updating balance after a transaction between users
    updateBalance = function(data){
        User.findOneAndUpdate({
            _id : data.userId
        },{
            $inc: { 
                balance : data.money 
            }
        },function(err,user){
            if (err)
                return err
            // Finding if user has less than 0 EUR on account, and if it change to 0 (no negative EUR on accounts!)
            User.findOneAndUpdate({
                _id     : data.userId,
                balance : { 
                    $lt : 0 
                } 
            },
            { 
                $set : {
                    balance : 0 
                } 
            });
        });
    }
    // Pushing transaction info into each user involucrated on transaction,(receiver, sender and money important information)
    updateTransactions = function(data){
        const now = new Date();
        User.findOneAndUpdate({
            '_id' : data.userId  
        }, {
            $push: {
                'transactions': {
                    '_id': new ObjectID(),
                    'from': data.from,
                    'to': data.to,
                    'money': data.money,
                    'created_at': now,
                    'updated_at': now
                }
            }
        },function(err,user){
            if (err)
                console.log(err)
            console.log(user);
        });
    }
    // Endpoint for sending money, calling updateBalance && updateTransactions
    sendMoney = function(req,res){
        const IDs = [
            { 
                userId      : req.params.receiver_id,
                to          : req.params.receiver_id,
                from        : req.userId,
                money       : req.body.money
            },  
            {
                userId      : req.userId,
                to          : req.params.receiver_id,
                from        : req.userId,
                money       : 0 - req.body.money
            }   
        ]
        var user; 
        IDs.forEach(function(data){
            updateTransactions(data)
            updateBalance(data);
        });
        User.findOne({
            _id : req.userId
        },
        function(err,user){
            if (err)
                res.send(err)
            res.json({
                message : 'Operation succeed!',
                user    : user
            });
        });
    }

    // AUTH endpoints
    app.post('/login', login); 
    app.post('/signup', signup);
    // getting info
    app.get('/users/',verifyToken,getUsers); // All users
    app.get('/user/detail/:user_id',verifyToken, getUser);  // Own user
    app.get('/user/balance/:user_id',verifyToken, getBalance); //Own balance
    
    app.post('/send/:receiver_id',verifyToken,verifySaldo,sendMoney); // Sending money
    
};
