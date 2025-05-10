export const loggedInRedirect = (req, res, next) => {
    if(req.session.user){
        res.redirect('/dashboard');
    } else {
        next();
    }
};