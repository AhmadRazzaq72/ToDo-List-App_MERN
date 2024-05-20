const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE-1: Get All the Notes using: GET "/api/notes/fetchalldata/". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE-2: Add a new Note using: POST "/api/notes/addnote/". login required
router.post('/addnote', [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //If error return (Bad request and errors)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNotes = await note.save()
        res.json(saveNotes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE-3: Update a Note using: PUT "/api/notes/updatenote/:id". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }
        // Find the note to be update and update it
        //parms.id is a id that are in route.post URL
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found")
        }
        //Allow deletin only if user owns this note
        //note.user.toString() it will give current note's id
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//ROUTE-4: Delete a Note using: DELETE "/api/notes/deletenote/:id". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        //parms.id is a id that are in route.post URL
        let note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found")
        }
        //Allow deletin only if user owns this note
        //note.user.toString() it will give current note's id
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note Deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;