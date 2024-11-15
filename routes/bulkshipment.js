const express = require("express");
const { generateBarCodeForLabel,excelData ,upload,getBulkLabelsData } = require("../controllers/bulkshipment.js");
const path = require('path');
const router = express.Router();
const {authenticateUser} =require("../middlewares/middleware.js")


router.get("/barcode", generateBarCodeForLabel); //whenever user is returned to our Oauth2 url hence the name callback, could say login
router.post('/bulk-labels',authenticateUser ,upload, excelData);
router.get('/allLabels',authenticateUser, getBulkLabelsData);

//whenever user is returned to our Oauth2 url hence the name callback, could say login



router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).json({ error: 'File not found.' });
            } else {
                console.error('Error downloading the file:', err);
                res.status(500).json({ error: 'Could not download the file.' });
            }
        }
    });
});


module.exports = router;
