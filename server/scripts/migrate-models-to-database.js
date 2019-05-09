var server = require('../server');
var ds = server.dataSources.db;
const models = ['class','enrollment','teacher','subject','student','locker'];

ds.automigrate(models, function(err, result) {
  ds.disconnect();
});
