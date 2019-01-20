const router = require('express').Router();

const Note = require('../models/Note');//se crea una clase con mongoose - se
//obtienen los datos de notes


router.get('/notes/add', (req, res)=>{
    res.render('notes/newnote');
});

router.get('/notes', async (req,res)=>{
   const notes =  await  Note.find().sort({date:'desc'});
    res.render('notes/all-notes' , { notes });
})

router.post('/notes/newnote', async (req , res)=>{
    const {title, description} = req.body;
    const errors = [];

    if (!title) {
        errors.push({text:'Por favor ingresa un titulo'});
    }
    if(!description){
        errors.push({text:'Por favor ingresa una descripcion'});
    }

    if (errors.length>0) {
        res.render('notes/newnote', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({title, description});       
        console.log(newNote);
        await newNote.save();
        req.flash('success_msg' , 'Note agregada');
        res.redirect('/notes')
    }
});

//edit 
router.get('/notes/edit/:id', async (req, res)=>{
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-notes', {note});
})

router.put('/notes/edit-note/:id', async (req ,res )=>{
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title , description })
    req.flash('success_msg' , 'nota modificada');
    res.redirect('/notes')
});

router.delete('/notes/delete/:id' , async (req , res)=>{
    await Note.findOneAndDelete(req.params.id);
    req.flash('success_msg' , 'nota Eliminada');
    res.redirect('/notes');
})



module.exports = router;


