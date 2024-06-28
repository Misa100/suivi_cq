const express = require('express'); //import express
const router  = express.Router(); 

const menuController = require('../controllers/menu_controller'); 
router.post('/get-menu', menuController.getMenu); 
router.get('/get-date', menuController.getDateNow); 
router.post('/get-login', menuController.getLogin); 
router.get('/get-max-rang-menu', menuController.getMaxRangMenu)
router.post('/update-menu', menuController.updateMenu)
router.post('/update-rang-menu', menuController.updateRangMenu)
router.post('/supprimer-menu', menuController.supprimerMenu)
router.post('/insert-menu', menuController.insertMenu)
router.post('/update_sous_menu', menuController.updateSousMenu)
router.get('/get-titre', menuController.getTitre)
router.post('/update-titre', menuController.updateTitre)
router.post('/login-gpao', menuController.getLoginFromGpao)

const usersController = require('../controllers/users_controller'); 
router.get('/get-all-users', usersController.getAllUsers);
router.post('/delete-user', usersController.deleteUser);
router.post('/insert-users', usersController.insertUser);
router.post('/update-users', usersController.updateUser);
router.post('/get-user', usersController.getUser);
router.post('/get-user-gpao', usersController.getAllUsersGPAO); 
router.get('/get-processus-lean', usersController.getProcessusLean);

const dateTimeController = require('../controllers/date_controller');
router.get('/get-date-time', dateTimeController.getDateTime);

// upload file
const controller = require('../controllers/file.controller');
router.post('/upload', controller.upload);
router.get("/files", controller.getListFiles);
router.get("/files/:name", controller.download);

//suivi cq
const suiviController = require("../controllers/suivi_cq.controller")
router.get('/get-type-controle', suiviController.getTypecontrole)
router.post('/get-livraison', suiviController.getLivraison)
router.get('/get-list-typage',suiviController.getTypeActe)
router.post('/get-reprise', suiviController.getReprise)
router.post('/get-echantillon', suiviController.getEchantillon)
router.post('/excel-export', suiviController.generateExcel)
// router.post('/save-download', suiviController.downloadFile)

module.exports = router; // export to use in server.js
