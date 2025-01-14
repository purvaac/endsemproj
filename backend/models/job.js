const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    budget: {type: Number, required: true},
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    freelancers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    status: {type: String, default: 'open'},
});

module.exports = mongoose.model('Job', JobSchema);