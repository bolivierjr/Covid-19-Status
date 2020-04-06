// eslint-disable-next-line no-undef
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_USERNAME)
db = db.getSiblingDB("covid");

db.createUser({
  user: process.env.MONGO_NON_ROOT_USERNAME,
  pwd: process.env.MONGO_NON_ROOT_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: "covid"
    }
  ]
});

db.createCollection("report");
