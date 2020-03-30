const mongoose = require('mongoose');

const Report = new mongoose.Schema({
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
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Report', Report);
