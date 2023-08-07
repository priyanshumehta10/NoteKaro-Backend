const express = require('express');
const router = express.Router()
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


//ROUTE 1: Fetch all notes : get "/api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {


        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occurred");

    }
})


//ROUTE 2: add notes  : get "/api/notes/addnotes"  login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', "Description must have 5 words").isLength({ min: 5 })
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        //if there are errors return bad requestand the errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await notes.save()
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occurred");

    }

})

//ROUTE 3: updating note  : put "/api/notes/updatenotr/:id"  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        
    
    // create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    //find the note to be updated and update it 
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json(note)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occurred");

}
})

//ROUTE 4: delete note  : delete "/api/notes/deletenote/:id"  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
   
    try {
        
    //find the note to be updated and update it 
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }
    //delete note if the user own the note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Note deleted successfully" });
} catch (error) {

    console.error(error.message);
    res.status(500).json({ success: false, message: "Error deleting note" });

}
})




module.exports = router;