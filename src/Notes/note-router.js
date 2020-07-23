const express = require('express');
const NoteService = require('./note-service')
const noteRouter = express.Router();
const jsonBodyParser = express.json();
const xss = require('xss');

const serializeNotes = (note) => ({
  id: note.id,
  folder: note.folder,
  name: xss(note.name),
  note: xss(note.note),
  modified: note.modified
})

noteRouter.route('/api/notes').get((req,res,next) => {
  NoteService.getNotes(req.app.get('db')).then(note => {
    if(!note) {
      res.status(404).json({
        error: { message: "Note not found"}
      })
    }
    res.json(note.map(serializeNotes))
  })
  .catch(next)
})
noteRouter.route('/api/notes').post(jsonBodyParser, (req,res,next) => {
  const { folder, name, note } = req.body;
  const noteContent = {
    folder, 
    name, 
    note,
  };
  NoteService.createNote(req.app.get('db'), noteContent).then(note => {
    if(!note) {
      res.status(404).json({
        error: { message: "Note not found"}
      })
    }
    res.json(note)
  })
  .catch(next)
})
noteRouter.route('/api/notes/:noteid').delete((req,res,next) => {
  NoteService.deleteNote(req.app.get('db'),req.params.noteid).then(note => {
    console.log(req.params.noteid)
    if(!note) {
      res.status(404).json({
        error: { message: "Note not found"}
      })
    }
    res.json(note)
  })
  .catch(next)
})
noteRouter.route('/api/notes').patch(jsonBodyParser, (req,res,next) => {
  const { id, name, note } = req.body;
  const noteData = {
    id,
    name,
    note
  }
  NoteService.updateNote(req.app.get('db'), noteData).then(note => {
    if(!note) {
      res.status(404).json({
        error: { message: "Note was not found"}
      })
    }
    res.json(note)
  })
  .catch(next)
})

module.exports = noteRouter;