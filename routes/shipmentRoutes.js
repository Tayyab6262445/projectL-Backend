const express = require("express");
const {  generateLabelData,getAllShipments,getShipmentById,getUserShipments } = require("../controllers/shipmentController");
const {authenticateUser} =require("../middlewares/middleware.js")
const router = express.Router();

router.get('/shipments', authenticateUser, getUserShipments);
router.post('/generateLabel', authenticateUser, generateLabelData);
// router.post("/generateLabel", generateLabelData);
router.get('/labels', getAllShipments);
router.get('/label/:id',getShipmentById);

//whenever user is returned to our Oauth2 url hence the name callback, could say login

module.exports = router;
