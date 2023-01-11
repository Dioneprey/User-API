var User = require("../models/User")
var PasswordToken = require('../models/PasswordToken')
class UserController {
    async index(req,res) {
        var users = await User.findAll()
        res.json(users)
    }

    async findUser(req,res){
        var id = req.params.id
        var user = await User.findById(id)
        if(user == undefined){
            res.status(404)
            res.json({})
        }else{
            res.status(200)
            res.json(user)
        }
    }

    async create(req,res) {
        
        var {email, name, password} = req.body

        if(email == undefined) {
            res.status(400).send("Invalid email")
            return
        }

        var emailExists = await User.findEmail(email)

        if(emailExists){
            res.status(406).send("Email already taken")
            return
        }

        await User.new(email,password,name)        
        res.status(200).send("OK")
    }

    async edit(req,res){
        var {id, name, role, email} = req.body
        var result = await User.update(id,email,name,role)
        if(result != undefined) {
            if(result.status){
                res.send("KO")
            }else{
                res.status("406").send(result.err)
            }
        }else{
            res.status(406).send("An error occurred on the server")
        }
    }

    async remove(req,res){
        var id = req.params.id
        var result = await User.delete(id)

        if(result.status){
            res.status(200).send("OK")
        }else{
            res.status(406).send(result.err)
        }
    }

    async recoverPassword(req,res) {
        var email = req.body.email
        var result = await PasswordToken.create(email)
        if(result.status){
            res.status(200)
            res.send("" + result.token)
        }else {
            res.status(406).send(result.err)
        }
    }

    async changePassword(req,res) {
        var token = req.body.token
        var password = req.body.password

        var isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status){
            
            await User.changePassword(password, isTokenValid.token.user_id,isTokenValid.token.token)
            res.status(200).send("Password changed")
        }else {
            res.status(406).send("Invalid token")
        }
    }

}

module.exports = new UserController()