const Shipment = require("../models/Shipment.js");
const bwipjs = require('bwip-js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const generateBarcode = require('../BarCode/barcodegen.js'); 
const { generateRandomSerialNumber, calculateMod10CheckDigit } = require('../helpers/helpers.js');






// generateBarcode('9205556858097968349309', 0)
//     .then(() => console.log('Barcode generation completed'))
//     .catch((err) => console.error('Error in barcode generation:', err));

// exports.generateLabelData = async (req, res) => {
//     try {
        
     
//         const { 
//             shippingService, // updated to match the request body
//             carrier, 
//             vendor, 
//             dimensions, // destructuring the entire dimensions object
//             weight, 
//             additionalInfo, 
//             barCodeImage, 
//             qrCodeImage, 
//             notes, 
//             sender, // destructuring the entire sender object
//             receiver // destructuring the entire receiver object
//         } = req.body;    
//         console.log(req.body);
    
//         let channelAI, serviceTypeCode, mailerID, serialNumberLength;
//         if (shippingService=== "ground_advantage") {
//           channelAI = "94";
//           serviceTypeCode = "001";
//           mailerID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Random 6 digit number
//           serialNumberLength = 10;
//         } else {
//           channelAI = "92";
//           serviceTypeCode = "0555";
//           mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Random 5 digit number
//           serialNumberLength = 10;   
//         }
    
//         const serialNumber = generateRandomSerialNumber(serialNumberLength);
//         const trackingNumberBase = channelAI + serviceTypeCode + mailerID + serialNumber;
//         const mod10CheckDigit = calculateMod10CheckDigit(trackingNumberBase);
//         const trackingNumber = trackingNumberBase + mod10CheckDigit;
    
//         // Validate pricing
    
//         const shipment = new Shipment({
//             carrier,
//             vendor,
//             shippingService, // no change needed here
//             weight,
//             dimensions, // directly using destructured dimensions
//             sender, // directly using destructured sender
//             receiver, // directly using destructured receiver
//             additionalInfo,
//             trackingNumber,
//             barCodeImage,
//             qrCodeImage,
//             notes,
//         });
    
//           await shipment.save();
          
       
       
//           // Respond with success message
//           return res.json({
//             success: true,
//             message: 'Label generated! You can print it from the recent label.',
//           });
        
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred.' });
//       }
//   };






// yaha sy
// exports.generateLabelData = async (req, res) => {
//   try {
//     const { 
//       shippingService, 
//       carrier, 
//       vendor, 
//       dimensions, 
//       weight, 
//       additionalInfo, 
//       sender, 
//       receiver 
//     } = req.body;    
// const zipCode=receiver.zipCode.substring(0,5)



//     let channelAI, serviceTypeCode, mailerID, serialNumberLength;
//     if (shippingService === "ground_advantage") {
//       channelAI = "94";
//       serviceTypeCode = "001";
//       mailerID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Random 6 digit number
//       serialNumberLength = 10;
//     } else {
//       channelAI = "92";
//       serviceTypeCode = "0555";
//       mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Random 5 digit number
//       serialNumberLength = 10;   
//     }
//     const randomNumber = Math.floor(Math.random() * 9) + 1;
//     const serialNumber = generateRandomSerialNumber(serialNumberLength);
//     const trackingNumberBase = channelAI + serviceTypeCode + mailerID + serialNumber;
//     const mod10CheckDigit = calculateMod10CheckDigit(trackingNumberBase);
//     const trackingNumber = trackingNumberBase + mod10CheckDigit;

//     // Generate Barcode
// generateBarcode(trackingNumber, randomNumber,zipCode)
//     .then(() => console.log('Barcode generation completed'))
//     .catch((err) => console.error('Error in barcode generation:', err));

//     // const barcodePath = path.join(__dirname, '../uploads', `${trackingNumber}.png`);
//     // const barcodeBuffer = await bwipjs.toBuffer({
//     //   bcid: 'code128',  // Barcode type
//     //   text: trackingNumber,
//     //   scale: 3,         // Scaling factor
//     //   height: 10,       // Bar height, in millimeters
//     //   includetext: true, // Include text below the barcode
//     //   textxalign: 'center', // Always good to set this
//     // });
//     // fs.writeFileSync(barcodePath, barcodeBuffer);

//     // Generate QR Code
//     const qrCodePath = path.join(__dirname, '../uploads', `${trackingNumber}-qr.png`);
//     await QRCode.toFile(qrCodePath, trackingNumber, {
//       width: 300,
//       margin: 1
//     });

//     // Create Shipment document
//     const shipment = new Shipment({
//       carrier,
//       vendor,
//       shippingService,
//       weight,
//       dimensions,
//       sender,
//       receiver,
//       additionalInfo,
//       trackingNumber,
//       barCodeImage: `/uploads/${trackingNumber}.png`, // Store relative path
//       qrCodeImage: `/uploads/${trackingNumber}-qr.png`, // Store relative path
//     });

//     await shipment.save();

//     // Respond with success message
//     return res.json({
//       success: true,
//       message: 'Label generated! You can print it from the recent label.',
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred.' });
//   }
// };

















//this is the working one
exports.generateLabelData = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { 
      shippingService, 
      carrier, 
      vendor, 
      dimensions, 
      weight, 
      additionalInfo, 
      sender, 
      receiver 
    } = req.body;    

    const zipCode = receiver.zipCode.substring(0, 5);

    let channelAI, serviceTypeCode, mailerID, serialNumberLength;
    if (shippingService === "GroundAdvantage") {
      channelAI = "94";
      serviceTypeCode = "001";
      mailerID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Random 6 digit number
      serialNumberLength = 10;
    } else if(shippingService === "Express") {
      channelAI = "92";
      serviceTypeCode = "701";
      mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 100000; // Random 6 digit number
      serialNumberLength = 10;   
    } else {
      channelAI = "92";
      serviceTypeCode = "0555";
      mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Random 5 digit number
      serialNumberLength = 10;   
    }
    
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    const serialNumber = generateRandomSerialNumber(serialNumberLength);
    const trackingNumberBase = channelAI + serviceTypeCode + mailerID + serialNumber;
    const mod10CheckDigit = calculateMod10CheckDigit(trackingNumberBase);
    const trackingNumber = trackingNumberBase + mod10CheckDigit;

    // // Generate Barcode
    // generateBarcode(trackingNumber, randomNumber, zipCode)
    //   .then(() => console.log('Barcode generation completed'))
    //   .catch((err) => {
    //     console.error('Error in barcode generation:', err);
    //     return false;
    //   });



 // Generate Barcode
 try {
  await generateBarcode(trackingNumber, randomNumber, zipCode);
} catch (err) {
  console.error('Error in barcode generation:', err);
  return res.status(500).json({ message: 'Failed to generate barcode' });
}


    // Generate QR Code
    // const qrCodePath = path.join(__dirname, '../uploads', `${trackingNumber}-qr.png`);
    // await QRCode.toFile(qrCodePath, trackingNumber, {
    //   width: 300,
    //   margin: 1
    // });
    const qrCodePath = path.join(__dirname, '../uploads', `${trackingNumber}-qr.png`);
    const pngBuffer = await bwipjs.toBuffer({
      bcid: 'datamatrix',           // Barcode type for Data Matrix
      text: trackingNumber,         // Data to encode
      scale: 1,                     // Scaling factor (adjust as needed)
      width: 80,                   // Set width in pixels
      height: 80,                  // Set height in pixels
      includetext: false,           // Optional: remove text below the barcode
  });
  fs.writeFileSync(qrCodePath, pngBuffer);



    // Create Shipment document with user ID
    const shipment = new Shipment({
      user: req.user._id, // Associate the shipment with the logged-in user
      carrier,
      vendor,
      shippingService,
      weight,
      dimensions,
      sender,
      receiver,
      additionalInfo,
      trackingNumber,
      barCodeImage: `/uploads/${trackingNumber}.png`, // Store relative path
      qrCodeImage: `/uploads/${trackingNumber}-qr.png`, // Store relative path
    });

    await shipment.save();

    // Respond with success message
    return res.json({
      success: true,
      message: 'Label generated! You can print it from the recent label.',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};


//baseString img to db
// exports.generateLabelData = async (req, res) => {
//   try {
//     // Check if user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { 
//       shippingService, 
//       carrier, 
//       vendor, 
//       dimensions, 
//       weight, 
//       additionalInfo, 
//       sender, 
//       receiver 
//     } = req.body;    

//     const zipCode = receiver.zipCode.substring(0, 5);

//     let channelAI, serviceTypeCode, mailerID, serialNumberLength;
//     if (shippingService === "ground_advantage") {
//       channelAI = "94";
//       serviceTypeCode = "001";
//       mailerID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Random 6 digit number
//       serialNumberLength = 10;
//     } else {
//       channelAI = "92";
//       serviceTypeCode = "0555";
//       mailerID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000; // Random 5 digit number
//       serialNumberLength = 10;   
//     }
    
//     const randomNumber = Math.floor(Math.random() * 9) + 1;
//     const serialNumber = generateRandomSerialNumber(serialNumberLength);
//     const trackingNumberBase = channelAI + serviceTypeCode + mailerID + serialNumber;
//     const mod10CheckDigit = calculateMod10CheckDigit(trackingNumberBase);
//     const trackingNumber = trackingNumberBase + mod10CheckDigit;

//     // Generate Barcode
//     await generateBarcode(trackingNumber, randomNumber, zipCode); // Ensure this returns a promise

//     // Generate QR Code
//     const qrCodePath = path.join(__dirname, '../uploads', `${trackingNumber}-qr.png`);
//     await QRCode.toFile(qrCodePath, trackingNumber, {
//       width: 300,
//       margin: 1
//     });

//     // Read and convert images to Base64
//     const barCodePath = path.join(__dirname, '../uploads', `${trackingNumber}.png`);
//     const barCodeBase64 = fs.readFileSync(barCodePath).toString('base64');
//     const qrCodeBase64 = fs.readFileSync(qrCodePath).toString('base64');

//     // Create Shipment document with user ID and Base64 images
//     const shipment = new Shipment({
//       user: req.user._id, // Associate the shipment with the logged-in user
//       carrier,
//       vendor,
//       shippingService,
//       weight,
//       dimensions,
//       sender,
//       receiver,
//       additionalInfo,
//       trackingNumber,
//       barCodeImage: `data:image/png;base64,${barCodeBase64}`, // Store Base64 string
//       qrCodeImage: `data:image/png;base64,${qrCodeBase64}`, // Store Base64 string
//     });

//     await shipment.save();

//     // Respond with success message
//     return res.json({
//       success: true,
//       message: 'Label generated! You can print it from the recent label.',
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred.' });
//   }
// };




exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipments', error });
  }
};

exports.getUserShipments = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID
    console.log('Searching for shipments with userId:', userId);

    // Find shipments for the specific user
    const shipments = await Shipment.find({ user: userId }); // Use 'user' instead of 'userId'
    
    // Check if shipments are found
    if (shipments.length === 0) {
      console.log('No shipments found for userId:', userId);
      return res.status(404).json({ message: 'No shipments found for this user' });
    }

    res.status(200).json(shipments);
  } catch (error) {
    console.error('Error fetching user shipments:', error);
    res.status(500).json({ message: 'Error fetching shipments', error });
  }
};



exports.getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shipment', error });
  }
};