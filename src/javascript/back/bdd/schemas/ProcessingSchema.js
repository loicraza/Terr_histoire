const { Schema } = require("mongoose");

module.exports.ProcessingSchema = new Schema({
    isProcessed: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    addedByEmail: {
        type: String,
        required: true
    },
    addedByName: {
        type: String,
        required: true
    },
    addedBySurname: {
        type: String,
        required: true
    },
    bddUUID: {
        type: String,
        required: false
    },
    processedAt: {
        type: Date,
        default: null
    },
    processedByEmail: {
        type: String,
        default: null
    }
});