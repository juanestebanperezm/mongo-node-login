const router=require('express').Router();
const passport=require('passport')
const User=require('../models/User')

router.get('/users/signin',(req,res)=>{
    res.render('users/signin')
})


router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash:true
}))



router.get('/users/signup',(req,res)=>{
    res.render('users/signup')
})


router.post('/users/signup',async(req,res)=>{
    const {name,email,password,confirm_password}=req.body;
    const errors=[];
    
    if(name.length<=0){
        errors.push({text:'Porfavor insertar el nombre'})
    }
    if(password!=confirm_password){
        errors.push({text:'No coinciden'})
    }if(password.length<4){
        errors.push({text:'debe tener mas caracteres'})
    }
    if(errors.length>0){
        res.render('users/signup',{errors,name,email,password,confirm_password});
    }else{
        const emailUser=await User.findOne({emai:email});
        if(emailUser){
            req.flash('error_msg','Email en uso');
            res.redirect('/users/signup')
        }
        const newUser=new User({name,email,password});
        newUser.password=await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('succes_msg','Estas registrado');
        res.redirect('/users/signin')
    }
    
});

router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
})


module.exports=router