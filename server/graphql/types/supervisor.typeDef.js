const { gql } = require("apollo-server-express");
require("../scalar/dateTime");

const supervisorTypeDef = gql`
	scalar DateTime

	# Object
	type Supervisor {
		id: ID!
		Name: String!
		Addresses: [Address!]!
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

	type supervisorChange {
		eventType: String
		supervisoChange: Supervisor!
	}

	# Queries
	type Query {
		hello: String
		getAllSupervisors: [Supervisor!]!
		getOneSupervisor(id: ID!): Supervisor!
	}

	input AddressInput {
		address: String!
		city: String!
		state: String!
		zipCode: String!
	}

	input keyInput {
		keyWay: String!
		keyCode: String!
		doorLocation: String!
	}

	# Mutations
	type Mutation {
		createOneSupervisor(Name: String!, Addresses: [AddressInput!]!, keys: [keyInput!]!): Supervisor!

		# updateOneManager(id: ID!, clientName: String, clientLastName: String, cellPhones: [NumberInput]): Client!

		# deleteOneManager(id: ID!): Client!

		# deleteOneClientItem(id: ID!, cellPhone: [NumberInput]): Boolean
	}

	# Re-renders data on data update
	type Subscription {
		onSupervisorChange: supervisorChange
	}
`;

module.exports = { supervisorTypeDef };

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
