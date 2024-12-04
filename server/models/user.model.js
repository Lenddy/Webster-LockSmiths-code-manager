// Importing Schema and model to create the schema and saving it to the database
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		// Attributes for the database
		name: {
			type: String,
			required: true,
			min: [2, "Name Of The Manager Must Be At Least 2 Characters Long"],
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		password: { type: String, required: true }, // Use bcrypt for hashing
		role: {
			name: { type: String, required: true }, // e.g., "admin", "editor", "viewer"
			permissions: { type: [String], required: true }, // List of permissions for this role
		},

		// !! no phone numbers
		// cellPhones: {
		// 	type: [
		// 		{
		// 			numberId: {
		// 				type: String,
		// 				// required: true
		// 			},
		// 			number: {
		// 				type: String,
		// 				required: true,
		// 				validate: {
		// 					validator: function (v) {
		// 						// Example regex for validating US phone numbers
		// 						return /\(\d{3}\)\d{3}-\d{4}/.test(v);
		// 					},
		// 					message: (props) => `${props.value} is not a valid phone number!`,
		// 				},
		// 			},
		// 		},
		// 	],
		// 	//!! required: true,
		// },
	},
	{ timestamps: true }
);

const User = model("Users", UserSchema); // Naming the table(document) in the database

module.exports = Manager; // Exporting the schema
