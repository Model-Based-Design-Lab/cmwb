// Switch to (or create) a database
dbm = db.getSiblingDB("cmwb_models2");
dbu = db.getSiblingDB("cmwb_users2");

// collection name is 'compmodmodels'
//export const passwordDbName = 'cmwb_users2'
// collection name is 'passwordusermodels'
// collection name is 'accessgroupmodels' (?)


// Create collections
dbm.createCollection("compmodmodels");
dbu.createCollection("passwordusermodels");
dbu.createCollection("accessgroupmodels");

// Insert initial data
dbm.compmodmodels.insertOne({
  username: "admin",
  role: "admin",
  createdAt: new Date()
});
dbu.passwordusermodels.insertOne({
})
dbu.accessgroupmodels.insertOne({
})
