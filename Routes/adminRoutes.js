const express=require('express')

const authMiddleware = require('../middlewares/authMiddleware')
const { getDonarListController, getHospitalListController, getOrgListController, deleteDonarController } = require('../controllers/adminController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router=express.Router()
//Routes

//Get || donar list
router.get(
    "/donar-list",
    authMiddleware,
    adminMiddleware,
    getDonarListController
  );
  //Hospital List
router.get(
    "/hospital-list",
    authMiddleware,
    adminMiddleware,
    getHospitalListController
  );
  //GET hospital List
router.get(
    "/org-list",
    authMiddleware,
    adminMiddleware,
    getOrgListController
  );

  //***********delete donar || GET */
  router.delete('/delete-donar/:id',authMiddleware,adminMiddleware,deleteDonarController)

  module.exports=router
