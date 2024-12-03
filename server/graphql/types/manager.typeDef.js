const { gql } = require("apollo-server-express");
require("../scalar/dateTime");

const managerTypeDef = gql`
	scalar DateTime

	# Object
	type Manager {
		id: ID!
		name: String!
		addresses: [Address!]!
		keys: [key!]!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type Address {
		id: ID!
		address: String!
		city: String!
		state: String!
		zipCode: String!
	}

	type key {
		id: ID!
		keyWay: String!
		keyCode: String!
		doorLocation: String!
	}

	type managerChange {
		eventType: String
		managerChange: Manager!
	}

	# Queries
	type Query {
		hello: String
		getAllManagers: [Manager!]!
		getOneManager(id: ID!): Manager!
	}

	input AddressInput {
		address: String!
		city: String!
		state: String!
		zipCode: String!
	}

	input AddressUpdateInput {
		addressId: ID
		address: String
		city: String
		state: String
		zipCode: String
		status: String
	}

	input keyInput {
		keyWay: String!
		keyCode: String!
		doorLocation: String!
	}

	input keyUpdateInput {
		keyId: ID
		keyWay: String
		keyCode: String
		doorLocation: String
		status: String
	}

	# Mutations
	type Mutation {
		createOneManager(name: String!, addresses: [AddressInput!]!, keys: [keyInput!]!): Manager!

		updateOneManager(id: ID!, name: String, addressesInfo: [AddressUpdateInput], keysInfo: [keyUpdateInput]): Manager!

		deleteOneManager(id: ID!): Manager!

		# deleteOneClientItem(id: ID!, cellPhone: [NumberInput]): Boolean
	}

	# Re-renders data on data update
	type Subscription {
		onManagerChange: managerChange
	}
`;

module.exports = { managerTypeDef };

// # skip for now
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # type cellNumber {
// #   numberId: ID
// #   number: String!
// # }

// # type ClientChange {
// #   eventType: String
// #   clientChanges: Client
// # }
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # skip for now
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # input NumberInput {
// # 	numberId: ID
// # 	number: String
// # 	status: String
// # 	# __typename: String
// # }

// input cellNumberInput {
//   numberId: ID
//   number: String!
// }

// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
// # !!!!!!!!!!
