// Importing Client model, uuid for unique IDs, and pubsub for event publishing
const Supervisor = require("../../models/supervisor.model");
const { v4: uuidv4 } = require("uuid");
const pubsub = require("../pubsub");

const supervisorResolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},
		getAllSupervisors: async () => {
			return await Supervisor.find()
				.then((Supervisors) => {
					console.log("all the Supervisors", Supervisors, "\n____________________");
					return Supervisors;
				})
				.catch((err) => {
					console.log("there was an error fetching all the Supervisors", err, "\n____________________");
					throw err;
				});
		},
		getOneSupervisor: async (_, { id }) => {
			return await Supervisor.findById(id)
				.then((Supervisor) => {
					console.log("one Supervisor", Supervisor, "\n____________________");
					return Supervisor;
				})
				.catch((err) => {
					console.log("there was an error fetching one Supervisor", err, "\n____________________");
					throw err;
				});
		},
	},

	Mutation: {
		createOneSupervisor: async (_, { Name, Addresses, keys }) => {
			const createdAt = new Date().toISOString();
			const updatedAt = new Date().toISOString();

			// cellPhones = cellPhones.map((numberDate) => {
			// 	return {
			// 		...numberDate,
			// 		numberId: uuidv4(),
			// 	};
			// });

			return await Supervisor.create({
				Name,
				Addresses,
				keys,
				createdAt,
				updatedAt,
			})
				.then((newSupervisor) => {
					pubsub.publish("Supervisor_ADDED", {
						onSupervisorChange: {
							eventType: "Supervisor_ADDED",
							SupervisorChanges: newSupervisor,
						},
					});
					console.log("new Supervisor created", newSupervisor, "\n____________________");
					return newSupervisor;
				})
				.catch((err) => {
					console.log("there was an error creating a new Supervisor", err, "\n____________________");
					throw err;
				});
		},

		// updateOneSupervisor: async (parent, args, context, info) => {
		// 	const { id, clientName, clientLastName, cellPhones } = args;
		// 	const update = { updatedAt: new Date().toISOString() };

		// 	if (clientName !== undefined) {
		// 		update.clientName = clientName;
		// 	}
		// 	if (clientLastName !== undefined) {
		// 		update.clientLastName = clientLastName;
		// 	}
		// 	if (cellPhones !== undefined && cellPhones.length > 0) {
		// 		const bulkOps = [];

		// 		for (const phone of cellPhones) {
		// 			if (phone.status === "add") {
		// 				const newPhone = {
		// 					numberId: uuidv4(),
		// 					number: phone.number,
		// 				};

		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: {
		// 							$push: { cellPhones: newPhone },
		// 						},
		// 					},
		// 				});
		// 			} else if (phone.status === "update") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: {
		// 							_id: id,
		// 							"cellPhones.numberId": phone.numberId,
		// 						},
		// 						update: {
		// 							$set: {
		// 								"cellPhones.$.number": phone.number,
		// 							},
		// 						},
		// 					},
		// 				});
		// 			} else if (phone.status === "delete") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: {
		// 							_id: id,
		// 							"cellPhones.numberId": phone.numberId,
		// 						},
		// 						update: {
		// 							$pull: {
		// 								cellPhones: {
		// 									numberId: phone.numberId,
		// 								},
		// 							},
		// 						},
		// 					},
		// 				});
		// 			}
		// 		}

		// 		if (bulkOps.length > 0) {
		// 			await Client.bulkWrite(bulkOps);
		// 		}
		// 	}

		// 	return await Client.findByIdAndUpdate(id, update, { new: true })
		// 		.then((updatedClient) => {
		// 			pubsub.publish("CLIENT_UPDATED", {
		// 				onClientChange: {
		// 					eventType: "CLIENT_UPDATED",
		// 					clientChanges: updatedClient,
		// 				},
		// 			});
		// 			console.log("client update");
		// 			return updatedClient;
		// 		})
		// 		.catch((err) => {
		// 			console.log("error", err);
		// 		});
		// },

		// deleteOneManager: async (_, { id }) => {
		// 	return await Client.findByIdAndDelete(id)
		// 		.then((deletedClient) => {
		// 			pubsub.publish("CLIENT_DELETED", {
		// 				onClientChange: {
		// 					eventType: "CLIENT_DELETED",
		// 					clientChanges: deletedClient,
		// 				},
		// 			});
		// 			console.log("a client was deleted", deletedClient, "\n____________________");
		// 			return deletedClient;
		// 		})
		// 		.catch((err) => {
		// 			console.log("there was an error deleting a client", err, "\n____________________");
		// 			throw err;
		// 		});
		// },
	},

	Subscription: {
		onSupervisorChange: {
			subscribe: () => pubsub.asyncIterator(["SUPERVISOR_ADDED", "SUPERVISOR_UPDATED", "SUPERVISOR_DELETED"]),
		},
	},

	Supervisor: {
		createdAt: (superviso) => superviso.createdAt.toISOString(),
		updatedAt: (superviso) => superviso.updatedAt.toISOString(),
	},
};

module.exports = { supervisorResolvers };
