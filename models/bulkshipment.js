const mongoose = require('mongoose');
const { Schema } = mongoose;

const labelSchema = new Schema({

 
    provider: { type: String, required: true },
  class: { type: String, required: true },
  notes: { type: String,},
  weight: { type: String, required: true },
  from_address1: { type: String, required: true },
  from_name: { type: String, required: true },
  from_phone: { type: String, default:''},
  from_address2: { type: String },
  from_city: { type: String, required: true },
  from_state: { type: String, required: true },
  from_postcode: { type: String, required: true },
  from_country: { type: String, required: true },
  to_name: { type: String, required: true },
  to_company: { type: String },
  to_phone: { type: String,default:'' },
  to_address1: { type: String, required: true },
  to_address2: { type: String },
  to_city: { type: String, required: true },
  to_state: { type: String, required: true },
  to_postcode: { type: String, required: true },
  to_country: { type: String, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  trackingNumber: { type: String, required: true },
  barCodeImage: {
    type: String,
  },
  qrCodeImage: {
    type: String,
  },
});

const bulkLabelSchema = new Schema({
  // date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  labels: [labelSchema], // Array of label objects
});

const BulkLabel = mongoose.model('BulkLabel', bulkLabelSchema);

module.exports = BulkLabel;
