import { EntitySchema } from 'typeorm';

const ReportModel = new EntitySchema({
  name: 'report',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: 'increment',
    },
    fpis: {
      type: Number,
      nullable: false,
    },
    admin2: {
      type: String,
    },
    provinceState: {
      name: 'province_state',
      type: String,
    },
    countryRegion: {
      name: 'country_region',
      type: String,
    },
    lastUpdate: {
      name: 'last_update',
      type: Date,
      nullable: false,
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
    active: {
      type: Number,
    },
    combinedKey: {
      name: 'combined_key',
      type: String,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp with time zone',
      createDate: true,
    },
  },
});

export default ReportModel;
