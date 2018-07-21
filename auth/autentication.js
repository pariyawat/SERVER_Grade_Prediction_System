const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/secret');
const createError = require('http-errors');
const auth = {

    createToken(user){
        let token = jwt.sign({activeUser: user}, config.secret, {expiresIn : 86400});
        return token;
    },

    verifyToken(token, next){
        if(!token){
            return next(createError(401))
        } else {
            jwt.verify(token, config.secret,(err, decoded) =>{
                if (err){
                    return next(createError(401));
                }
            })
        }
    },
    getIdByToken(req){
        const token = req.headers['authorization']
        return jwt.verify(token,config.secret,(err, decoded) =>{
            if(err){
                return false
            } else {
                return decoded.activeUser.ID
            }
        })
    }
}

module.exports = auth;