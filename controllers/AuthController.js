const User = require('../models/User');
const bcryptjs = require('bcryptjs');

module.exports = class AuthController {
    static login(req, res){
        res.render('auth/login')
    }

    static async loginPost(req, res){
        const {email, password} = req.body;

        //Encontrar usuário no banco
        const user = await User.findOne({ where: { email: email } })

        if(!user){
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')
            return
        }

        //Checa a senha
        const validPassword = bcryptjs.compareSync(password, user.password)

        if(!validPassword){
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')
            return
        }

        //Inicializando session
        req.session.userid = user.id
        req.flash('message', 'Autenticação realizada com sucesso!')  
        req.session.save(()=>{
            res.redirect('/')     
        })
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){

        const {name, email, password, confirmpassword} = req.body;

        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if(checkIfUserExists){
            req.flash('message', 'E-mail já cadastrado!')
            res.render('auth/register')
            return
        }

        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {

            const createdUser =  await User.create(user)  
            
            //Inicializando session
            req.session.userid = createdUser.id
            req.flash('message', 'Usuário cadastrado com sucesso!')  
            req.session.save(()=>{
                res.redirect('/')     
            })

        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res){
        req.session.destroy(()=>{
            res.redirect('/login')
        })
    }
}