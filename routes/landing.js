import { Router } from 'express';
import { getUserById } from '../data/users.js';
const router = Router();

router.get('/', async(req, res) => {
    if(req.session.user){
        const userId = req.session.user._id;
        const user = await getUserById(userId);
        res.render('landing', {
            title: "Landing Page",
            firstName: user.firstName,
            isAdmin: user.isAdmin
        })
    }
    else{
        return res.render('landing', {
        title: "Landing Page"
    });}
});

export default router;