// Importing Schema and model to create the schema and saving it to the database
const { Schema, model } = require("mongoose");

const ManagementSchema = new Schema(
	{
		// Attributes for the database
		Name: {
			type: String,
			required: true,
			min: [2, "Name Of The Manager Must Be At Least 2 Characters Long"],
		},

		Addresses: {
			type: [
				{
					address: String,
					city: String,
					state: String,
					zipCode: String,
				},
			],
			require: true,
		},

		keys: {
			type: [
				{
					keyWay: String,
					keyCode: String,
				},
			],
			require: true,
		},

		// !! no phone numbers and the key ways can be numbers or leters

		cellPhones: {
			type: [
				{
					numberId: {
						type: String,
						// required: true
					},
					number: {
						type: String,
						required: true,
						validate: {
							validator: function (v) {
								// Example regex for validating US phone numbers
								return /\(\d{3}\)\d{3}-\d{4}/.test(v);
							},
							message: (props) => `${props.value} is not a valid phone number!`,
						},
					},
				},
			],
			//!! required: true,
		},
	},
	{ timestamps: true }
);

const Manager = model("Managers", ManagementSchema); // Naming the table(document) in the database

module.exports = Manager; // Exporting the schema
