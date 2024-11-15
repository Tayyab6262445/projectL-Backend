function generateRandomSerialNumber(length) {
    let serialNumber = '';
    for (let i = 0; i < length; i++) {
      serialNumber += Math.floor(Math.random() * 10);
    }
    return serialNumber;
  }




  function calculateMod10CheckDigit(input) {
    const digits = input.split('').map(Number);
    let sum = 0;
  
    digits.forEach((digit, index) => {
      const weight = (index % 2 === 0) ? 3 : 1;
      sum += digit * weight;
    });
  
    const remainder = sum % 10;
    return (remainder === 0) ? 0 : (10 - remainder);
  }



  module.exports = {
    generateRandomSerialNumber,
    calculateMod10CheckDigit
};