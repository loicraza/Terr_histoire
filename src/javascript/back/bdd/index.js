const mongoose = require('mongoose');
const { DataSchema } = require('./schemas/DataSchema.js');
const { UserSchema } = require('./schemas/UserSchema.js');
const { ProcessingSchema } = require('./schemas/ProcessingSchema.js');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
};

module.exports.connect = async (uri) => {
    const connection = await mongoose.createConnection(uri, options).asPromise();
    if (!connection) throw new Error("Can't find the connection");
    console.log("Connected to the database !");
    connection.model('data', DataSchema, 'data');
    connection.model('user', UserSchema);
    connection.model('processing', ProcessingSchema, 'processing');
    return connection;
};