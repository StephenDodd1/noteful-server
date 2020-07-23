const NoteService = {
  getNotes(knex) {
    return knex.from("notes").select("*");
  },
  createNote(knex, note) {
    return knex.insert(note).into("notes")
  },
  deleteNote(knex, id) {
    return knex.from("notes").where('id', id).delete()
  },
  updateNote(knex, noteData) {
    return knex.from('notes').where('id', noteData.id).update({note: noteData.note, name: noteData.name})
  }
};
module.exports = NoteService;
