const mongoose = require('mongoose')
const car = require('./car')

const schema = new mongoose.Schema({
    rentDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10)  },
    dayCount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    description: { type: String, required: true },
    userName: { type: String, required:true },
    carName: { type: String, required:true }
}, {
    versionKey: false,
    additionalProperties: false
})

let model = null

module.exports = {

    getSchema: () => schema,
    getModel: () => model,

    init: connection => {
        model = connection.model('rent', schema)
        return model
    },

    get: (req, res) => {
        const _id = req.query._id
        if(_id) {
            model.findOne({ _id })
            .then(data => {
                if(data) {
                    res.json(data)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        } else {
            let aggregation = [
                { $sort: { description: 1 }},
                { $match: 
                    { description: { $regex: new RegExp(req.query.search, 'i') } }
                },
                { $lookup: {
                    from: 'cars',
                    localField: '_id',
                    foreignField: 'cars',
                    as: 'cars'
                }},
            ]
            aggregation.push({ $skip: parseInt(req.query.skip) || 0 })
            aggregation.push({ $limit: parseInt(req.query.limit) || 10 })
            model.aggregate(aggregation)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        }
    },

    post: (req, res) => {
        const instance = new model(req.body)
        instance.save()
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(406).json({ error: err.message })
            })
    },

    put: (req, res) => {
        const _id = req.query._id
        model.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                if (updated) {
                    res.json(updated)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(406).json({ error: err.message })
            })
    },

    delete: (req, res) => {
        const _id = req.query._id
        model.findOneAndDelete({ _id }).then((deleted) => {
            if (deleted) {
                car.getModel().updateMany({}, { $pull: { cars: _id } })
                    .then(() => res.json(deleted))
                    .catch(err => res.status(400).json({ error: err.message }))
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    }

}