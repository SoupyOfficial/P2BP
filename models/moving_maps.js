const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const Entry = mongoose.Schema({
    path: [{
        lat: Number,
        long: Number
    }],
    age: {
        type: String,
        enum: ['<15','15-30','30-45','45-60','60+']
    },
    mode: {
        type: String,
        enum: ['running','walking','biking','skateboarding','other']
    },
    time: String
})

const moving_schema = mongoose.Schema({
    project: ObjectId,
    owner: ObjectId,
    start_time: String,
    end_time: String,
    data: [Entry],
    complete: Boolean
})

const Movings = module.exports = mongoose.model('Moving_Maps', moving_schema)

module.exports.addTest = async function addTest(newTest) {
    
}

module.exports.addEntry = async function(testId, entry) {
    Movings.updateOne(
        { _id: testId },
        { $addToSetid: { data: entry }}
    )
}

module.exports.deleteEntry = async function(testId, entryId) {
    Movings.updateOne(
        { _id: testId },
        { $pull: { data: { _id: entryId }}}
    )
}

module.exports.claim = async function(testId, userId) {

}

module.exports.complete = async function(testId) {

}

module.exports.getData = async function(testId) {

}