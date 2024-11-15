const Shipment = require("../models/Shipment.js");
const axios=require("axios")
const sharp=require("sharp")
const bwipjs = require('bwip-js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const BulkLabel = require('../models/bulkshipment.js'); 


const generateBarcode = require('../BarCode/barcodegen.js'); 
const { generateRandomSerialNumber, calculateMod10CheckDigit } = require('../helpers/helpers.js');







// Function to generate barcode
const baseURL = 'https://www.bcgen.com/demo/linear-dbgs.aspx';

// async function generateBarcode(trackingId, index, zipCode) {
//     try {
//         // Ensure trackingId is a string
//         if (typeof trackingId !== 'string') {
//             throw new Error(`Expected trackingId to be a string, received ${typeof trackingId}`);
//         }

//         const firstTwoDigits = trackingId.substring(0, 2);
//         const remainingTrackingId = trackingId.substring(2);

//          // Replace with your actual base URL
//         const controlCharacter = String.fromCharCode(29); // ASCII 0x1D (Group Separator)

//         // Create the barcode URL with correct control character
//         const barcodeURL = `${baseURL}?S=13&D=~202420${zipCode}${controlCharacter}${firstTwoDigits}${remainingTrackingId}&CC=T&CT=T&ST=F&X=0.03&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB=`;

//         // Request the barcode image
//         const response = await axios.get(barcodeURL, { responseType: 'arraybuffer' });

//         const outputFilePath = path.join(__dirname, 'uploads', `${trackingId}.png`);

//         const { width, height } = await sharp(response.data).metadata();
//         const newHeight = height - 18; // Adjust as needed

//         await sharp(response.data)
//             .extract({ left: 0, top: 0, width: width, height: newHeight })
//             .toFile(outputFilePath);

//         return outputFilePath;
//     } catch (error) {
//         console.error(`Error generating barcode for trackingId: ${trackingId}, index: ${index}, zipCode: ${zipCode}`);
//         console.error('Error details:', error.message);
//         throw error; // Propagate the error so the calling function can handle it
//     }
// }

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




function generateTrackingNumber(shippingService, receiverZipCode) {
    // Get the first 5 digits of the zip code
    console.log(receiverZipCode);
    let stringZipCode=toString(receiverZipCode)
    console.log(stringZipCode);

    const zipCode = stringZipCode.substring(0, 5);
  
    let channelAI, serviceTypeCode, mailerID, serialNumberLength;
  
    if (shippingService === "ground_advantage") {
      channelAI = "94";
      serviceTypeCode = "001";
      mailerID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Random 6-digit number
      serialNumberLength = 10;
    } else {
      channelAI = "92";
      serviceTypeCode = "0555";
      mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Random 5-digit number
      serialNumberLength = 10;   
    }
  
    const serialNumber = generateRandomSerialNumber(serialNumberLength);
    const trackingNumberBase = channelAI + serviceTypeCode + mailerID + serialNumber;
    const mod10CheckDigit = calculateMod10CheckDigit(trackingNumberBase);
    const trackingNumber = trackingNumberBase + mod10CheckDigit;
  
    return trackingNumber;
  }










  exports.excelData = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { vendor } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an Excel file.' });
        }

        // Save file to uploads directory
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const user=req.user._id;

        const filePath = path.join(uploadsDir, req.file.originalname);
        fs.writeFileSync(filePath, req.file.buffer);

        // Read the Excel file
        const workbook = xlsx.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // Map the data to the labels schema with barcode and QR code generation
        const labels = await Promise.all(jsonData.map(async (item, index) => {
            const trackingNumber = generateTrackingNumber(item.class, item.to_postcode);

            // Generate barcode image
            const barcodePath = path.join(uploadsDir, `${trackingNumber}.png`);
            const randomNumber = Math.floor(Math.random() * 9) + 1; // Define if needed for barcode generation
            await generateBarcode(trackingNumber, index, item.to_postcode);

            // Generate QR code image
            const qrCodePath = path.join(uploadsDir, `${trackingNumber}-qr.png`);
            const pngBuffer = await bwipjs.toBuffer({
                bcid: 'datamatrix',           // Barcode type for Data Matrix
                text: trackingNumber,         // Data to encode
                scale: 1,                     // Scaling factor (adjust as needed)
                width: 80,                    // Set width in pixels
                height: 80,                   // Set height in pixels
                includetext: false,           // Optional: remove text below the barcode
            });
            fs.writeFileSync(qrCodePath, pngBuffer);

            return {
                provider: item.provider,
                class: item.class,
                weight: item.weight,
                from_phone: item.from_phone || '',
                from_name: item.from_name || '',
                from_address1: item.from_address1,
                from_address2: item.from_address2,
                from_city: item.from_city,
                from_state: item.from_state,
                from_postcode: item.from_postcode,
                from_country: item.from_country,
                to_name: item.to_name,
                to_company: item.to_company,
                to_phone: item.to_phone || '',
                to_address1: item.to_address1,
                to_address2: item.to_address2,
                to_city: item.to_city,
                to_state: item.to_state,
                to_postcode: item.to_postcode,
                to_country: item.to_country,
                length: item.length,
                width: item.width,
                height: item.height,
            
                trackingNumber: trackingNumber,
                barCodeImage: `/uploads/${trackingNumber}.png`, // Store relative path
                qrCodeImage: `/uploads/${trackingNumber}-qr.png`, // Store relative path for QR code
            };
        }));

        // Save the bulk label data to the database
        const bulkLabel = new BulkLabel({  labels,user });
        await bulkLabel.save();

        res.status(201).json({ message: 'Bulk labels created successfully!', bulkLabel, filename: req.file.originalname });
    } catch (error) {
        console.error('Error processing the file:', error);
        res.status(500).json({ error: error.message || 'An error occurred while processing the file.' });
    }
};





// this is the working one
//   exports.excelData = async (req, res) => {
//     try {
//         const { vendor } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ error: 'Please upload an Excel file.' });
//         }

//         // Save file to uploads directory
//         const uploadsDir = path.join(__dirname, '../uploads');
//         if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir);
//         }

//         const filePath = path.join(uploadsDir, req.file.originalname);
//         fs.writeFileSync(filePath, req.file.buffer);

//         // Read the Excel file
//         const workbook = xlsx.read(req.file.buffer);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = xlsx.utils.sheet_to_json(sheet);

//         // Map the data to the labels schema with barcode and QR code generation
//         const labels = await Promise.all(jsonData.map(async (item,index) => {
//             const trackingNumber = generateTrackingNumber(item.class, item.to_postcode);

//             // Generate barcode image
//             const barcodePath = path.join(uploadsDir, `${trackingNumber}.png`);
//             const randomNumber = Math.floor(Math.random() * 9) + 1; // Define if needed for barcode generation
//             await generateBarcode(trackingNumber, index, item.to_postcode);

//             // Generate QR code image
//             const qrCodePath = path.join(uploadsDir, `${trackingNumber}-qr.png`);
//             const pngBuffer = await bwipjs.toBuffer({
//                 bcid: 'datamatrix',           // Barcode type for Data Matrix
//                 text: trackingNumber,         // Data to encode
//                 scale: 1,                     // Scaling factor (adjust as needed)
//                 width: 80,                    // Set width in pixels
//                 height: 80,                   // Set height in pixels
//                 includetext: false,           // Optional: remove text below the barcode
//             });
//             fs.writeFileSync(qrCodePath, pngBuffer);

//             return {
//                 provider: item.provider,
//                 class: item.class,
//                 weight: item.weight,
//                 from_phone: item.from_phone || '',
//                 from_address1: item.from_address1,
//                 from_address2: item.from_address2,
//                 from_city: item.from_city,
//                 from_state: item.from_state,
//                 from_postcode: item.from_postcode,
//                 from_country: item.from_country,
//                 to_name: item.to_name,
//                 to_company: item.to_company,
//                 to_phone: item.to_phone || '',
//                 to_address1: item.to_address1,
//                 to_address2: item.to_address2,
//                 to_city: item.to_city,
//                 to_state: item.to_state,
//                 to_postcode: item.to_postcode,
//                 to_country: item.to_country,
//                 length: item.length,
//                 width: item.width,
//                 height: item.height,
//                 tracking_number: trackingNumber,
//                 barCodeImage: `/uploads/${trackingNumber}.png`, // Store relative path
//                 qrCodeImage: `/uploads/${trackingNumber}-qr.png`, // Store relative path for QR code
//             };
//         }));

//         // Save the bulk label data to the database
//         const bulkLabel = new BulkLabel({ vendor, labels });
//         await bulkLabel.save();

//         res.status(201).json({ message: 'Bulk labels created successfully!', bulkLabel, filename: req.file.originalname });
//     } catch (error) {
//         console.error('Error processing the file:', error);
//         res.status(500).json({ error: error.message || 'An error occurred while processing the file.' });
//     }
// };







// exports.excelData = async (req, res) => {
//     try {
//         const { vendor } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ error: 'Please upload an Excel file.' });
//         }

//         // Save file to uploads directory
//         const uploadsDir = path.join(__dirname, '../uploads');
//         if (!fs.existsSync(uploadsDir)) {
//             fs.mkdirSync(uploadsDir);
//         }

//         const filePath = path.join(uploadsDir, req.file.originalname);
//         fs.writeFileSync(filePath, req.file.buffer);



//         // Read the Excel file
//         const workbook = xlsx.read(req.file.buffer);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = xlsx.utils.sheet_to_json(sheet);



    
    



//         // Map the data to the labels schema
//         const labels = jsonData.map((item) => {
//             const trackingNumber = generateTrackingNumber(item.class, item.to_postcode);

            
//             return {
//                 provider: item.provider,
//                 class: item.class,
//                 weight: item.weight,
//                 from_phone: item.from_phone || '',
//                 from_address1: item.from_address1,
//                 from_address2: item.from_address2,
//                 from_city: item.from_city,
//                 from_state: item.from_state,
//                 from_postcode: item.from_postcode,
//                 from_country: item.from_country,
//                 to_name: item.to_name,
//                 to_company: item.to_company,
//                 to_phone: item.to_phone || '',
//                 to_address1: item.to_address1,
//                 to_address2: item.to_address2,
//                 to_city: item.to_city,
//                 to_state: item.to_state,
//                 to_postcode: item.to_postcode,
//                 to_country: item.to_country,
//                 length: item.length,
//                 width: item.width,
//                 height: item.height,
//                 tracking_number: trackingNumber,
//                 barCodeImage: `/uploads/${trackingNumber}.png`, // Store relative path
//                 qrCodeImage: `/uploads/${trackingNumber}-qr.png`,
//                 // Add generated tracking number
//             };
//         });



//         // const labels = jsonData.map((item) => ({

//         //    provider: item.provider,
//         //     class: item.class,
//         //     weight: item.weight,
//         //     from_phone: item.from_phone || '',
//         //     from_address1: item.from_address1,
//         //     from_address2: item.from_address2,
//         //     from_city: item.from_city,
//         //     from_state: item.from_state,
//         //     from_postcode: item.from_postcode,
//         //     from_country: item.from_country,
//         //     to_name: item.to_name,
//         //     to_company: item.to_company,
//         //     to_phone: item.to_phone || '',
//         //     to_address1: item.to_address1,
//         //     to_address2: item.to_address2,
//         //     to_city: item.to_city,
//         //     to_state: item.to_state,
//         //     to_postcode: item.to_postcode,
//         //     to_country: item.to_country,
//         //     length: item.length,
//         //     width: item.width,
//         //     height: item.height,
//         //     tracking_number: trackingNumber,
//         // }));

//         const bulkLabel = new BulkLabel({ vendor, labels });
//         await bulkLabel.save();

//         res.status(201).json({ message: 'Bulk labels created successfully!', bulkLabel, filename: req.file.originalname });
//     } catch (error) {
//         console.error('Error processing the file:', error); // Log the detailed error
//         res.status(500).json({ error: error.message || 'An error occurred while processing the file.' });
//     }
// };





    exports.generateBarCodeForLabel = async (req, res) => {
        const { trackingId, index, zipCode } = req.query;
    
        if (!trackingId || !zipCode) {
            return res.status(400).json({ error: 'Missing required parameters: trackingId, zipCode' });
        }
    
        // Convert trackingId and zipCode to strings
        const trackingNumber = String(trackingId);
        const zip = String(zipCode);
    
        try {
            const barcodePath = await generateBarcode(trackingNumber, index, zip);
    
            // Read the generated barcode image and send it back
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(barcodePath).pipe(res);
        } catch (error) {
            console.error('Failed to generate barcode88888:', error.message); // Log the error for debugging
            res.status(500).json({ error: `Failed to generate barcode: ${error.message}` });
        }
    };



    exports.getBulkLabelsData = async (req, res) => {
        try {
            // Fetch shipments only for the authenticated user
            const shipments = await BulkLabel.find({ user: req.user._id });
            res.status(200).json(shipments);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching shipments', error });
        }
    };
    


// exports.getBulkLabelsData = async (req, res) => {
//     try {
//       const shipments = await BulkLabel.find();
//       res.status(200).json(shipments);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching shipments', error });
//     }
//   };


exports.upload = upload.single('file');