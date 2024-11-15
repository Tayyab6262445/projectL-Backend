// const mongoose = require('mongoose');

// const shipmentSchema = new mongoose.Schema({
//   carrier: {
//     type: String,
//     required: true,
//   },
//   vendor: {
//     type: String,
//     required: true,
//   },
//   shippingService: {
//     type: String,
//     required: true,
//   },
//   weight: {
//     type: Number,
//     required: true,
//   },
//   dimensions: {
//     width: {
//       type: Number,
//       required: true,
//     },
//     length: {
//       type: Number,
//       required: true,
//     },
//     height: {
//       type: Number,
//       required: true,
//     },
//   },
//   sender: {
//     name: {
//       type: String,
//       required: true,
//     },
//     company: {
//       type: String,
//       required: false,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     address1: {
//       type: String,
//       required: true,
//     },
//     address2: {
//       type: String,
//       required: false,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     zipCode: {
//       type: String,
//       required: true,
//     },
//   },
//   receiver: {
//     name: {
//       type: String,
//       required: true,
//     },
//     company: {
//       type: String,
//       required: false,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     address1: {
//       type: String,
//       required: true,
//     },
//     address2: {
//       type: String,
//       required: false,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     zipCode: {
//       type: String,
//       required: true,
//     },
//   },
//   additionalInfo: {
//     type: String,
//     required: false,
//   },
//   trackingNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   barCodeImage: {
//     type: String, // URL or path to the barcode image
  
//   },
//   qrCodeImage: {
//     type: String, // URL or path to the QR code image
   
//   },
//   notes: {
//     type: String,
//     required: false,
//   }
// }, { timestamps: true });

// const Shipment = mongoose.model('Shipment', shipmentSchema);

// module.exports = Shipment;


const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carrier: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  shippingService: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  sender: {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  receiver: {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  additionalInfo: {
    type: String,
    required: false,
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  barCodeImage: {
    type: String,
  },
  qrCodeImage: {
    type: String,
  },
  notes: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
