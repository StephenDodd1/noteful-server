const express = require("express");
const FolderService = require("./folder-service");
const folderRouter = express.Router();
const jsonBodyParser = express.json();
const xss = require("xss");

const serializeFolder = (folder) => ({
  id: folder.id,
  name: xss(folder.name)
});
 
folderRouter.route("/api/folder").get((req, res, next) => {
  const knex = req.app.get("db");
  FolderService.getFolders(knex).then((folder) => {
    if(!folder){
      res.status(404).json({
        error: { message: "Folder not available"}
      });
    }
    res.json(folder.map(serializeFolder))
  })
  .catch(next);
});

folderRouter.route("/api/folder").post(jsonBodyParser, (req, res, next) => {
  const knex = req.app.get("db");
  const { name } = req.body;
  const folderName = { name }
  console.log(req.body.name)
  FolderService.createFolder(knex, folderName).then((folder) => {
    if(!folder) {
      res.status(404).json({
        error: { message: "Folder not created"}
      })
    }
    res.json(folder)
  })
  .catch(next)
});

folderRouter.route("/api/folder/:folderid").delete((req,res,next) => {
  const knex = req.app.get('db');
  const folder = req.params.folderid;
  FolderService.deleteFolder(knex, folder).then(folder => {
    if(!folder) {
      return res.status(404).json({
        error: { message: "Not found"}
      })
    }
    res.json(folder)
  })
  .catch(next)
});

folderRouter.route("/api/folder/:folderid").patch(jsonBodyParser,(req,res,next) => {
  const knex = req.app.get('db');
  const folder = req.params.folderid;
  FolderService.changeFolder(knex, folder, req.body.name).then(folder => {
    if(!folder) {
      res.status(404).json({
        error: { message: "Folder not found for update"}
      })
    }
    res.json(folder)
  })
  .catch(next)
})

module.exports = folderRouter;