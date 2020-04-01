const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  fpis: Number,
  admin2: String,
  province_state: String,
  country_region: String,
  last_update: Date,
  lat: Number,
  long: Number,
  confirmed: Number,
  deaths: Number,
  recovered: Number,
  combined_key: String,
  createdAt: { type: Date, default: Date.now },
});

ReportSchema.static('getReport', fpis => this.findOne({ fpis }));

export default mongoose.model('ReportModel', ReportSchema);
