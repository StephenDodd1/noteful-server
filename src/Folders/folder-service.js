const FolderService = {
  getFolders(knex) {
    return knex.select("*").from("folder");
  },
  createFolder(knex, name) {
    return knex.into("folder").insert(name);
  },
  deleteFolder(knex, id) {
    return knex.from("folder").where("id", id).delete();
  },
  changeFolder(knex, name) {
    return knex.into('folder').update({"name": name})
  },
};
module.exports = FolderService;
