const express=require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonarController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController } = require('../controllers/inventoryController');

const router=express.Router();

//routes
//add inventory || POST

router.post('/create-inventory',authMiddleware,createInventoryController)

// get blood records || GET
router.get('/get-inventory',authMiddleware,getInventoryController)

//get hospital blood records
router.post('/get-inventory-hospital',authMiddleware,getInventoryHospitalController)
// get Donar  || GET
router.get('/get-donars',authMiddleware,getDonarController)

//Get hospital Record || GET
router.get('/get-hospitals',authMiddleware,getHospitalController)

//Get organisation Record || GET
router.get('/get-organisations',authMiddleware,getOrganisationController)


router.get('/get-organisations-for-hospital',authMiddleware,getOrganisationForHospitalController)

module.exports=router