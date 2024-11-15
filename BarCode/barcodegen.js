const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Jimp } = require("jimp");
const sharp = require('sharp');

// Base URL for the barcode API
const baseURL = 'https://www.bcgen.com/demo/linear-dbgs.aspx';

// Function to generate barcode image
// async function generateBarcode(trackingId, index) {
//     try {
//         // Create the barcode URL with dynamic tracking ID
//         const firstTwoDigits = trackingId.substring(0, 2);
//         const remainingTrackingId = trackingId.substring(2);
//         const barcodeURL = `${baseURL}?S=13&D=~20242090020\x1D${firstTwoDigits}${remainingTrackingId}&CC=T&CT=T&ST=F&X=0.03&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB=`;

//         // Request the barcode image
//         const response = await axios.get(barcodeURL, { responseType: 'arraybuffer' });


//         const image = await Jimp.read(response.data);

//         const cropX = 0; // Starting from the left
//         const cropY = 0; // Starting from the top
//         const cropWidth = image.bitmap.width; // Full width
//         const cropHeight = image.bitmap.height - 30;
// const croppedFilePath = path.join(__dirname, '../uploads', `${trackingId}.png`);
// console.log(croppedFilePath);

//         // const croppedFilePath = path.join("", `cropped_barcode_${index}.png`);
//         await image.crop(cropX, cropY, cropWidth, cropHeight).writeAsync(croppedFilePath);
//         // sharp
        
//         // await sharp(response.data)
//         //     .extract({ left: 0, top: 0, width: 400, height: 100 }) // Adjust height based on your image
//         //     .toFile(croppedFilePath);





//         // // // Save the barcode image to a file
//         // const filePath = path.join("", `barcode_${index}.png`);
//         // const barcodePath = path.join(__dirname, '../uploads', `${trackingId}.png`);
//         // fs.writeFileSync(barcodePath, response.data);

//         console.log(`Barcode ${index} saved as ${filePath}`);
//     } catch (error) {
//         console.error(`Error generating barcode ${index}:`, error.message);
//     }
// }

// async function generateBarcode(trackingId, index) {
//     try {
//         // Create the barcode URL with dynamic tracking ID
//         const firstTwoDigits = trackingId.substring(0, 2);
//         const remainingTrackingId = trackingId.substring(2);
//         const barcodeURL = `${baseURL}?S=13&D=~20242090020\x1D${firstTwoDigits}${remainingTrackingId}&CC=T&CT=T&ST=F&X=0.03&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB=`;

//         // Request the barcode image
//         const response = await axios.get(barcodeURL, { responseType: 'arraybuffer' });

//         const image = await Jimp.read(response.data);

//         const cropX = 0; // Starting from the left
//         const cropY = 0; // Starting from the top
//         const cropWidth = image.bitmap.width; // Full width
//         const cropHeight = image.bitmap.height - 30;
//         const croppedFilePath = path.join(__dirname, '../uploads', `${trackingId}.png`);
//         console.log(croppedFilePath);

//         await image.crop(cropX, cropY, cropWidth, cropHeight).writeAsync(croppedFilePath);

//         console.log(`Barcode ${index} saved as ${croppedFilePath}`);
//     } catch (error) {
//         console.error(`Error generating barcode ${index}:`, error.message);
//     }
// }

// async function generateBarcode(trackingId, index) {
//     try {
//         // Ensure trackingId is a string
//         if (typeof trackingId !== 'string') {
//             throw new Error(`Expected trackingId to be a string, received ${typeof trackingId}`);
//         }

//         // Create the barcode URL with dynamic tracking ID
//         const firstTwoDigits = trackingId.substring(0, 2);
//         const remainingTrackingId = trackingId.substring(2);
//         const barcodeURL = `${baseURL}?S=13&D=~20242090020\x1D${firstTwoDigits}${remainingTrackingId}&CC=T&CT=T&ST=F&X=0.03&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB=`;

//         // Request the barcode image
//         const response = await axios.get(barcodeURL, { responseType: 'arraybuffer' });
//         console.log(`Response data length: ${response.data.length}`);

//         const image = await Jimp.read(response.data);

//         const cropX = 0; // Starting from the left
//         const cropY = 0; // Starting from the top
//         const cropWidth = image.bitmap.width; // Full width
//         const cropHeight = image.bitmap.height - 30;
//         const croppedFilePath = path.join(__dirname, '../uploads', `${trackingId}.png`);
//         console.log(`Cropped file path: ${croppedFilePath}`);

//         await image.crop(cropX, cropY, cropWidth, cropHeight).writeAsync(croppedFilePath);

//         console.log(`Barcode ${index} saved as ${croppedFilePath}`);
//     } catch (error) {
//         console.error(`Error generating barcode ${index}:`, error);
//     }
// }




async function generateBarcode(trackingId, index,zipCode) {
    try {
        // Ensure trackingId is a string
        if (typeof trackingId !== 'string') {
            throw new Error(`Expected trackingId to be a string, received ${typeof trackingId}`);
        }

        // Create the barcode URL with dynamic tracking ID
        const firstTwoDigits = trackingId.substring(0, 2);
        const remainingTrackingId = trackingId.substring(2);
        
        const barcodeURL = `${baseURL}?S=13&D=~202420${zipCode}\x1D${firstTwoDigits}${remainingTrackingId}&CC=T&CT=T&ST=F&X=0.03&O=0&BBV=0&BBH=0&CG=0&BH=1&LM=0.2&EM=0&CS=0&PT=T&TA=F&CA=&CB=`;

        // Request the barcode image
        const response = await axios.get(barcodeURL, { responseType: 'arraybuffer' });

        
        const outputFilePath = path.join(__dirname, '../uploads', `${trackingId}.png`);
        
      
        const { width, height } = await sharp(response.data).metadata();
        
        // Calculate the height you want to keep (e.g., keep only the top half)
        const newHeight = height - 18; // Adjust this value as needed
        
        // Crop the image by keeping the top part
        await sharp(response.data)
            .extract({ left: 0, top: 0, width: width, height: newHeight }) // Extract the top part
            .toFile(outputFilePath); // Save to file


            return outputFilePath;
        
    } catch (error) {
        console.error(`Error generating barcode ${index}:`, error);
    }
}



module.exports = generateBarcode;





// Generate 10 barcodes with different tracking IDs
// async function generateBarcodes() {
//     let ids = [
//         "9405503699300701000193",
//         "9405503699300701000438",
//         "9405503699300701000513",
//         "9405503699300701000575",
//     ];
//     for (let i = 0; i < ids.length; i++) {
//         await generateBarcode(ids[i], i);
//     }
// }

// Start generating barcodes
// generateBarcodes();