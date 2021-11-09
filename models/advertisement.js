const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
	product_id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	milage: {
		type: String,
		required: false
	},
	power: {
		type: String,
		required: false
	},
	production_date: {
		type: Date,
		required: false
	},
	registration_date: {
		type: Date,
		required: false
	},
});

module.exports = mongoose.model('Advertisement', advertisementSchema);