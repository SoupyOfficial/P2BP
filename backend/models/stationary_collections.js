const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Stationary_Map = require('../models/stationary_maps.js')


const area_schema = mongoose.Schema({
    title: String,
    date: {
        type: Date,
        required: true
    },

    area: {
        type: ObjectId,
        required: true,
        ref: 'Areas'
    },

    duration: {
        type: Number,
        required: true,
        default: 15
    },

    maps: [{
        type: ObjectId,
        ref: 'Stationary_Maps'
    }]

})

const Collection = module.exports = mongoose.model('Stationary_Collections', area_schema)

module.exports.deleteMap = async function(collectionId, mapId){
    Collection.findByIdAndDelete(mapId)
    return await Collection.updateOne(
        { _id: collectionId },
        { $pull: { maps: mapId}}
    )

}

module.exports.deleteCollection = async function(collectionId){
    collection = await Collection.findById(collectionId)

    for(var i = 0; i < collection.maps.length; i++)
        await Stationary_Map.findByIdAndDelete(collection.maps[i])

    return Collection.findByIdAndDelete(collectionId)
}

module.exports.addMap = async function(collectionId, mapId){
    return await Collection.updateOne(
        { _id: collectionId },
        { $push: { maps: mapId}}
    )
}

module.exports.updateColection = async function(collectionId, newCollection){
    return await Collection.updateOne(
        { _id: collectionId },
        { $set: {
            title: newCollection.title,
            time: newCollection.date,
            area: newCollection.area,
            duration: newCollection.duration
        }}
    )
}