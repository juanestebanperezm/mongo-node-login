const { response, Router } = require('express');

const router=require('express').Router();
const Note=require('../models/Note')

const {isAuthenticated}=require('../helpers/auth')

router.get('/notes/add',isAuthenticated,(req,res)=>{
    res.render('notes/newnote');
})


router.post('/notes/new',isAuthenticated,async(req,res)=>{
    const{title,description}=req.body;
    const errors=[];
    if(!title){
        errors.push({text:'Ingresa algo'})
    }
    if(!description){
        errors.push({text:'Ingresa una descripcion'})
    }
    if(errors.length>0){
        res.render('notes/newnote',{
            errors,
            title,
            description
        });
    }else{
        const newNote=new Note({title,description});
        newNote.user=req.user.id;
        await newNote.save();
        req.flash('succes_msg','Agregado con Exito')
        res.redirect('/notes');
    }
    
})

router.get('/notes',isAuthenticated,async(req,res)=>{
    const notes=await Note.find({user:req.user.id}).sort({title:'desc'})
    res.render('notes/all-notes',{notes})
})


router.get('/notes/edit/:id',isAuthenticated,async (req,res)=>{
    const note=await Note.findById(req.params.id)
    res.render('notes/edit-note',{note})
})

router.put('/notes/edit-note/:id',isAuthenticated,async (req,res)=>{
    const {title,description}=req.body
    await Note.findByIdAndUpdate(req.params.id,{title,description})
    req.flash('succes_msg','Actualizada con exito')
    res.redirect('/notes')
})


router.delete('/notes/delete/:id',isAuthenticated,async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('succes_msg','Eliminada con exito')
    res.redirect('/notes')
})



module.exports=router