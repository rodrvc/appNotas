const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup'); 
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect : '/notes',
    failureRedirect : 'signin',
    failureFlash: true 
}));


router.post('/users/signup' , async (req, res)=>{
    console.log(req.body);

    const errors = [];
    const { name , email , password , password_confirm } = req.body; 
    if ( password != password_confirm) {
        errors.push({text: 'Las contraseñas no coinciden'})
    }
    if (password.length < 4) {
        errors.push({text:'contraseña demaciado corta'})
    }
   
    if (name.length <= 0 ) {
        errors.push({text: 'por favor ingresa un nombre con caracteres'})
    }
    
    if (email.length <= 0 ) {
        errors.push({text: 'por favor ingresa un    email'})
    }

    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email , password, password_confirm})
    }else{
        //se comprueba si existe
        const emailUser = await User.findOne({email: email});
        const newUser = new User({name, email, password});
        if (emailUser) {
            req.flash('error_msg', 'el imail ya esta en uso');
            res.redirect('/users/signup');
        }

         
         newUser.password = await newUser.encryptPassword(password);
         await newUser.save();
         req.flash('success_msg', 'Estas registrado' );
         res.redirect('/users/signin'); 
    }  
});

router.get('/users/logout' , (req, res)=>{
    req.logout();
    res.redirect('/');
})




module.exports = router;