import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  fpis: Number,
  admin2: String,
  provinceState: String,
  countryRegion: String,
  lastUpdate: Date,
  lat: Number,
  long: Number,
  confirmed: Number,
  deaths: Number,
  recovered: Number,
  active: Number,
  combinedKey: String,
  createdAt: { type: Date, default: Date.now },
});

ReportSchema.static('getReport', fpis => this.findOne({ fpis }));

export default mongoose.model('ReportModel', ReportSchema);
