const express = require('express')
const router = express.Router()
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');

router.get('/', withAuth, async(req, res) => {
  try {
    let notes = await Note.find({auth: req.user._id})
    res.status(200).json(notes)
  } catch (error) {
    res.status(500).json({error: `error: ${error.message}`})
  }
})

router.post('/', withAuth, async (req, res) => {
  const {title, body} = req.body;
  try {
    let note = new Note({title: title, body: body, auth: req.user._id});
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({error: "Problem to create a new note"});
  }
})

router.get('/:id', withAuth, async(req, res) => {
  try {
    const {id} = req.params;
    let note = await Note.findById(id);
    if(isOwner(req.user,note))
      res.json(note);
    else
    res.status(403).json({error: "Permission denied"});
  } catch (error) {
    res.status(500).json({error: "This note does not exist"});
  }
})

router.put('/:id', withAuth, async (req, res) => {
  const {title, body} = req.body
  const {id} = req.params
  try {
    let note = await Note.findById(id)
    if(isOwner(req.user, note)){
      let newNote = await Note.findByIdAndUpdate(id,
        {$set: {title: title, body: body, updateAt: Date.now()}},
        {upsert: true, 'new': true}
      )
      await newNote.save();
      res.status(200).json(newNote)
    }else{
      res.status(403).json({error: "Permission denied"});
    }
  } catch (error) {
    res.status(500).json({error: `Error: problem to update a note`})
  }
})

router.delete('/:id', withAuth, async(req, res) => {
  const {id} = req.params
  try {
    let note = await Note.findById(id)
    if(isOwner(req.user, note)){
      let note = await Note.findByIdAndRemove(id)
      res.status(204).json(note)
    }else{
      res.status(403).json({error: "Permission denied"});
    }
  } catch (error) {
    res.status(500).json({error: `Error: problem to delete a note`})
  }
})

const isOwner = (user, note) => {
  if(JSON.stringify(user.id) === JSON.stringify(note.auth._id)) 
    return true;
  else 
    return false;
}

module.exports = router;