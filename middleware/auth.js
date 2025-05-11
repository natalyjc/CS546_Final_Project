export const loggedInRedirect = (req, res, next) => {
    if(req.session.user){
        res.redirect('/dashboard');
    } else {
        next();
    }
};

export const loggedOutRedirect = (req, res, next) => {
    if(!req.session.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
}