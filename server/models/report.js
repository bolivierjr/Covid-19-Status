const mongoose = require('mongoose');

const Report = new mongoose.Schema(
  {
    fpis: {
      type: Number,
      unique: true,
    },

    admin2: {
      type: String,
    },

    province_state: {
      type: String,
    },

    country_region: {
      type: String,
    },

    last_update: {
      type: Date,
    },

    lat: {
      type: Number,
    },

    long: {
      type: Number,
    },

    confirmed: {
      type: Number,
    },

    deaths: {
      type: Number,
    },

    recovered: {
      type: Number,
    },

    combined_key: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Report', Report);
