module.exports.checkAuth = function(req, res, next){
    const userid = req.session.userid

    if(userid){
        next()
    }else{
        res.redirect('/login')
    }

    
}