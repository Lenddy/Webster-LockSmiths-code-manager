// Importing Client model, uuid for unique IDs, and pubsub for event publishing
const Manager = require("../../models/manager.model");
const { v4: uuidv4 } = require("uuid");
const pubsub = require("../pubsub");

const managerResolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},

		getAllManagers: async () => {
			try {
				const managers = await Manager.find();
				console.log("all the Managers", managers, "\n____________________");
				return managers;
			} catch (err) {
				console.log("there was an error fetching all the Managers", err, "\n____________________");
				throw err;
			}
		},

		// getOneManager: async (_, { id }) => {
		// 	return await Manager.findById(id)
		// 		.then((Manager) => {
		// 			console.log("one Manager", Manager, "\n____________________");
		// 			return Manager;
		// 		})
		// 		.catch((err) => {
		// 			console.log("there was an error fetching one Manager", err, "\n____________________");
		// 			throw err;
		// 		});
		// },

		getOneManager: async (_, { id }) => {
			try {
				const manager = await Manager.findById(id);
				console.log("one Manager", manager, "\n____________________");
				return manager;
			} catch (err) {
				console.log("there was an error fetching one Manager", err, "\n____________________");
				throw err;
			}
		},
	},

	Mutation: {
		createOneManager: async (_, { name, addresses, keys }) => {
			const createdAt = new Date().toISOString();
			const updatedAt = new Date().toISOString();

			// Uncomment and use if cellPhones processing is needed
			// cellPhones = cellPhones.map((numberDate) => {
			//     return {
			//         ...numberDate,
			//         numberId: uuidv4(),
			//     };
			// });

			try {
				const newManager = await Manager.create({
					name,
					addresses,
					keys,
					createdAt,
					updatedAt,
				});

				pubsub.publish("MANAGER_ADDED", {
					onManagerChange: {
						eventType: "MANAGER_ADDED",
						ManagerChanges: newManager,
					},
				});

				console.log("new Manager created", newManager, "\n____________________");
				return newManager;
			} catch (err) {
				console.log("there was an error creating a new Manager", err, "\n____________________");
				throw err;
			}
		},

		// ! later on change the ids to be a le to take arrays  of ids to update multiple  also do the same for the other info
		// updateOneManager: async (parent, args, context, info) => {
		// 	const { id, addressID, keyId, name, addressInfo, keyInfo } = args;
		// 	const update = { updatedAt: new Date().toISOString() };

		// 	if (name !== undefined) {
		// 		update.name = name;
		// 	}
		// 	if (addressID !== undefined || keyId !== undefined) {
		// 		const bulkOps = [];

		// 		if (addressInfo.address !== undefined || addressInfo.city !== undefined || addressInfo.state !== undefined || addressInfo.zipCode !== undefined) {
		// 			bulkOps.push({
		// 				updateOne: {
		// 					// * try changing the id to _id if there is an error not finding the id
		// 					filter: {
		// 						_id: id,
		// 						"addresses._id": addressID,
		// 					},
		// 					update: {
		// 						$set: {
		// 							address: addressInfo.address,
		// 							city: addressInfo.city,
		// 							state: addressInfo.state,
		// 							zipCode: addressInfo.zipCode,
		// 						},
		// 					},
		// 				},
		// 			});
		// 		}

		// 		// if (keyInfo.keyWay !== undefined || keyInfo.keyCode !== undefined || keyInfo.doorLocation !== undefined) {
		// 		// 	bulkOps.push({
		// 		// 		updateOne: {
		// 		// 			// * try changing the id to _id if there is an error not finding the id
		// 		// 			filter: {
		// 		// 				_id: id,
		// 		// 				"keys.id": keyInfo.id,
		// 		// 			},
		// 		// 			update: {
		// 		// 				$set: {
		// 		// 					keyWay: keyInfo.keyWay,
		// 		// 					keyCode: keyInfo.keyCode,
		// 		// 					doorLocation: keyInfo.doorLocation,
		// 		// 				},
		// 		// 			},
		// 		// 		},
		// 		// 	});
		// 		// }

		// 		// for (const phone of cellPhones) {
		// 		// 	if (phone.status === "add") {
		// 		// 		const newPhone = {
		// 		// 			numberId: uuidv4(),
		// 		// 			number: phone.number,
		// 		// 		};

		// 		// 		bulkOps.push({
		// 		// 			updateOne: {
		// 		// 				filter: { _id: id },
		// 		// 				update: {
		// 		// 					$push: { cellPhones: newPhone },
		// 		// 				},
		// 		// 			},
		// 		// 		});
		// 		// 	} else if (phone.status === "update") {
		// 		// 		bulkOps.push({
		// 		// 			updateOne: {
		// 		// 				filter: {
		// 		// 					_id: id,
		// 		// 					"cellPhones.numberId": phone.numberId,
		// 		// 				},
		// 		// 				update: {
		// 		// 					$set: {
		// 		// 						"cellPhones.$.number": phone.number,
		// 		// 					},
		// 		// 				},
		// 		// 			},
		// 		// 		});
		// 		// 	} else if (phone.status === "delete") {
		// 		// 		bulkOps.push({
		// 		// 			updateOne: {
		// 		// 				filter: {
		// 		// 					_id: id,
		// 		// 					"cellPhones.numberId": phone.numberId,
		// 		// 				},
		// 		// 				update: {
		// 		// 					$pull: {
		// 		// 						cellPhones: {
		// 		// 							numberId: phone.numberId,
		// 		// 						},
		// 		// 					},
		// 		// 				},
		// 		// 			},
		// 		// 		});
		// 		// 	}
		// 		// }

		// 		if (bulkOps.length > 0) {
		// 			await Manager.bulkWrite(bulkOps);
		// 		}
		// 	}

		// 	return await Manager.findByIdAndUpdate(id, update, { new: true })
		// 		.then((updatedManager) => {
		// 			pubsub.publish("MANAGER_UPDATED", {
		// 				onManagerChange: {
		// 					eventType: "MANAGER_UPDATED",
		// 					managerChanges: updatedManager,
		// 				},
		// 			});
		// 			console.log("Manager update");
		// 			return updatedManager;
		// 		})
		// 		.catch((err) => {
		// 			console.log("error", err);
		// 		});
		// },

		// updateOneManager: async (parent, args, context, info) => {
		// 	const { id, name, addresses = [], keys = [] } = args;

		// 	const update = { updatedAt: new Date().toISOString() };
		// 	if (name !== undefined) {
		// 		update.name = name;
		// 	}

		// 	try {
		// 		const bulkOps = [];

		// 		// Process addresses
		// 		addresses.forEach((address) => {
		// 			if (address.status === "add") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $push: { addresses: { ...address, _id: new mongoose.Types.ObjectId() } } },
		// 					},
		// 				});
		// 			} else if (address.status === "update") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id, "addresses._id": address._id },
		// 						update: {
		// 							$set: {
		// 								"addresses.$.address": address.address,
		// 								"addresses.$.city": address.city,
		// 								"addresses.$.state": address.state,
		// 								"addresses.$.zipCode": address.zipCode,
		// 							},
		// 						},
		// 					},
		// 				});
		// 			} else if (address.status === "delete") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $pull: { addresses: { _id: address._id } } },
		// 					},
		// 				});
		// 			}
		// 		});

		// 		// Process keys
		// 		keys.forEach((key) => {
		// 			if (key.status === "add") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $push: { keys: { ...key, _id: new mongoose.Types.ObjectId() } } },
		// 					},
		// 				});
		// 			} else if (key.status === "update") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id, "keys._id": key._id },
		// 						update: {
		// 							$set: {
		// 								"keys.$.keyWay": key.keyWay,
		// 								"keys.$.keyCode": key.keyCode,
		// 								"keys.$.doorLocation": key.doorLocation,
		// 							},
		// 						},
		// 					},
		// 				});
		// 			} else if (key.status === "delete") {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $pull: { keys: { _id: key._id } } },
		// 					},
		// 				});
		// 			}
		// 		});

		// 		// Execute bulk operations if any
		// 		if (bulkOps.length > 0) {
		// 			await Manager.bulkWrite(bulkOps);
		// 		}

		// 		// Update other fields
		// 		const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

		// 		if (!updatedManager) {
		// 			throw new Error("Manager not found");
		// 		}

		// 		// Publish updates
		// 		pubsub.publish("MANAGER_UPDATED", {
		// 			onManagerChange: {
		// 				eventType: "MANAGER_UPDATED",
		// 				managerChanges: updatedManager,
		// 			},
		// 		});

		// 		console.log("Manager updated", updatedManager);
		// 		return updatedManager;
		// 	} catch (err) {
		// 		console.error("Error updating manager", err);
		// 		throw err;
		// 	}
		// },

		// updateOneManager: async (parent, args, context, info) => {
		// 	const { id, name, addresses = [], keys = [] } = args;

		// 	const update = {};
		// 	let hasUpdates = false; // Flag to track if there's valid data to update

		// 	if (name !== null && name !== undefined) {
		// 		update.name = name;
		// 		hasUpdates = true;
		// 	}

		// 	try {
		// 		const bulkOps = [];

		// 		// Process addresses
		// 		if (Array.isArray(addresses)) {
		// 			addresses.forEach((address) => {
		// 				if (!address || !address.status) return; // Skip if no valid address or status

		// 				if (address.status === "add" && address.address && address.city) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id },
		// 							update: { $push: { addresses: { ...address, _id: new mongoose.Types.ObjectId() } } },
		// 						},
		// 					});
		// 				} else if (address.status === "update" && address._id) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id, "addresses._id": address._id },
		// 							update: {
		// 								$set: {
		// 									"addresses.$.address": address.address,
		// 									"addresses.$.city": address.city,
		// 									"addresses.$.state": address.state,
		// 									"addresses.$.zipCode": address.zipCode,
		// 								},
		// 							},
		// 						},
		// 					});
		// 				} else if (address.status === "delete" && address._id) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id },
		// 							update: { $pull: { addresses: { _id: address._id } } },
		// 						},
		// 					});
		// 				}
		// 			});
		// 		}

		// 		// Process keys
		// 		if (Array.isArray(keys)) {
		// 			keys.forEach((key) => {
		// 				if (!key || !key.status) return; // Skip if no valid key or status

		// 				if (key.status === "add" && key.keyWay && key.keyCode) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id },
		// 							update: { $push: { keys: { ...key, _id: new mongoose.Types.ObjectId() } } },
		// 						},
		// 					});
		// 				} else if (key.status === "update" && key._id) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id, "keys._id": key._id },
		// 							update: {
		// 								$set: {
		// 									"keys.$.keyWay": key.keyWay,
		// 									"keys.$.keyCode": key.keyCode,
		// 									"keys.$.doorLocation": key.doorLocation,
		// 								},
		// 							},
		// 						},
		// 					});
		// 				} else if (key.status === "delete" && key._id) {
		// 					bulkOps.push({
		// 						updateOne: {
		// 							filter: { _id: id },
		// 							update: { $pull: { keys: { _id: key._id } } },
		// 						},
		// 					});
		// 				}
		// 			});
		// 		}

		// 		// Execute bulk operations if any valid operations exist
		// 		if (bulkOps.length > 0) {
		// 			await Manager.bulkWrite(bulkOps);
		// 			hasUpdates = true; // Flag as having performed updates
		// 		}

		// 		// Perform main update if there are updates
		// 		if (hasUpdates) {
		// 			const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

		// 			if (!updatedManager) {
		// 				throw new Error("Manager not found");
		// 			}

		// 			// Publish updates
		// 			pubsub.publish("MANAGER_UPDATED", {
		// 				onManagerChange: {
		// 					eventType: "MANAGER_UPDATED",
		// 					managerChanges: updatedManager,
		// 				},
		// 			});

		// 			console.log("Manager updated", updatedManager);
		// 			return updatedManager;
		// 		} else {
		// 			console.log("No valid updates provided");
		// 			return null; // Return null if nothing to update
		// 		}
		// 	} catch (err) {
		// 		console.error("Error updating manager", err);
		// 		throw err;
		// 	}
		// },

		// updateOneManager: async (parent, args, context, info) => {
		// 	const { id, name, addresses, keys } = args;

		// 	console.log("this are the given arguments", args);

		// 	const update = {};
		// 	let hasUpdates = false; // Flag to track if there's valid data to update

		// 	// Update the name field if it's provided
		// 	if (name !== null && name !== undefined) {
		// 		update.name = name;
		// 		hasUpdates = true;
		// 	}

		// 	try {
		// 		const bulkOps = []; // Array to hold bulk operations

		// 		// Normalize addresses to an array if it's a single object
		// 		const normalizedAddresses = Array.isArray(addresses) ? addresses : addresses ? [addresses] : [];

		// 		// Process addresses and prepare bulk operations
		// 		normalizedAddresses.forEach((address) => {
		// 			if (!address || !address.status) return; // Skip if no valid address or status

		// 			// Handle adding new addresses
		// 			if (address.status === "add" && address.address && address.city) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $push: { addresses: { ...address, _id: new mongoose.Types.ObjectId() } } },
		// 					},
		// 				});
		// 			}
		// 			// Handle updating existing addresses
		// 			else if (address.status === "update" && address._id) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id, "addresses._id": address._id },
		// 						update: {
		// 							$set: {
		// 								"addresses.$.address": address.address,
		// 								"addresses.$.city": address.city,
		// 								"addresses.$.state": address.state,
		// 								"addresses.$.zipCode": address.zipCode,
		// 							},
		// 						},
		// 					},
		// 				});
		// 			}
		// 			// Handle deleting addresses
		// 			else if (address.status === "delete" && address._id) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $pull: { addresses: { _id: address._id } } },
		// 					},
		// 				});
		// 			}
		// 		});

		// 		// Normalize keys to an array if it's a single object
		// 		const normalizedKeys = Array.isArray(keys) ? keys : keys ? [keys] : [];

		// 		// Process keys and prepare bulk operations
		// 		normalizedKeys.forEach((key) => {
		// 			if (!key || !key.status) return; // Skip if no valid key or status

		// 			// Handle adding new keys
		// 			if (key.status === "add" && key.keyWay && key.keyCode) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $push: { keys: { ...key, _id: new mongoose.Types.ObjectId() } } },
		// 					},
		// 				});
		// 			}
		// 			// Handle updating existing keys
		// 			else if (key.status === "update" && key._id) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id, "keys._id": key._id },
		// 						update: {
		// 							$set: {
		// 								"keys.$.keyWay": key.keyWay,
		// 								"keys.$.keyCode": key.keyCode,
		// 								"keys.$.doorLocation": key.doorLocation,
		// 							},
		// 						},
		// 					},
		// 				});
		// 			}
		// 			// Handle deleting keys
		// 			else if (key.status === "delete" && key._id) {
		// 				bulkOps.push({
		// 					updateOne: {
		// 						filter: { _id: id },
		// 						update: { $pull: { keys: { _id: key._id } } },
		// 					},
		// 				});
		// 			}
		// 		});

		// 		// Execute bulk operations if any valid operations exist
		// 		if (bulkOps.length > 0) {
		// 			await Manager.bulkWrite(bulkOps);
		// 			hasUpdates = true; // Flag as having performed updates
		// 		}

		// 		// Perform the main update if there are updates
		// 		if (hasUpdates) {
		// 			const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

		// 			if (!updatedManager) {
		// 				throw new Error("Manager not found");
		// 			}

		// 			// Publish updates to any subscribers (e.g., for a GraphQL subscription)
		// 			pubsub.publish("MANAGER_UPDATED", {
		// 				onManagerChange: {
		// 					eventType: "MANAGER_UPDATED",
		// 					managerChanges: updatedManager,
		// 				},
		// 			});

		// 			console.log("Manager updated", updatedManager);
		// 			return updatedManager; // Return the updated manager object
		// 		} else {
		// 			console.log("No valid updates provided");
		// 			return null; // Return null if no updates were made
		// 		}
		// 	} catch (err) {
		// 		console.error("Error updating manager", err); // Log the error for debugging
		// 		throw err; // Rethrow the error so it can be handled by the calling function
		// 	}
		// },

		updateOneManager: async (parent, args, context, info) => {
			const { id, name, addressesInfo, keysInfo } = args;

			const update = {};
			let hasUpdates = false; // Flag to track if there's valid data to update

			console.log("Received arguments:", args);

			// Update the name field if it's provided
			if (name !== null && name !== undefined) {
				update.name = name;
				hasUpdates = true;
				console.log("Name updated:", name);
			}

			try {
				const bulkOps = []; // Array to hold bulk operations

				// Normalize addresses to an array if it's a single object
				const normalizedAddresses = Array.isArray(addressesInfo) ? addressesInfo : addressesInfo ? [addressesInfo] : [];

				console.log("address", addressesInfo);

				console.log("Normalized addresses:", normalizedAddresses);

				// Process addresses and prepare bulk operations
				normalizedAddresses.forEach((address) => {
					console.log("Processing address:", address);

					if (!address || !address.status) {
						console.log("Skipping invalid address:", address);
						return; // Skip if no valid address or status
					}

					// Handle adding new addresses
					if (address.status === "add" && address.address && address.city) {
						console.log("Adding address:", address);
						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: { $push: { addresses: { ...address, _id: new mongoose.Types.ObjectId() } } },
							},
						});
					}
					// Handle updating existing addresses
					else if (address.status === "update" && address.addressId) {
						console.log("Updating address:", address);
						bulkOps.push({
							updateOne: {
								filter: { _id: id, "addresses._id": address.addressId },
								update: {
									$set: {
										"addresses.$.address": address.address,
										"addresses.$.city": address.city,
										"addresses.$.state": address.state,
										"addresses.$.zipCode": address.zipCode,
									},
								},
							},
						});
					}
					// Handle deleting addresses
					else if (address.status === "delete" && address._id) {
						console.log("Deleting address:", address);
						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: { $pull: { addresses: { _id: address.addressId } } },
							},
						});
					}
				});

				console.log("Bulk operations for addresses:", bulkOps);

				// Normalize keys to an array if it's a single object
				const normalizedKeys = Array.isArray(keysInfo) ? keysInfo : keysInfo ? [keysInfo] : [];

				console.log("Normalized keys:", normalizedKeys);

				// Process keys and prepare bulk operations
				normalizedKeys.forEach((key) => {
					console.log("Processing key:", key);

					if (!key || !key.status) {
						console.log("Skipping invalid key:", key);
						return; // Skip if no valid key or status
					}

					// Handle adding new keys
					if (key.status === "add" && key.keyWay && key.keyCode) {
						console.log("Adding key:", key);
						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: { $push: { keys: { ...key, _id: new mongoose.Types.ObjectId() } } },
							},
						});
					}
					// Handle updating existing keys
					else if (key.status === "update" && key._id) {
						console.log("Updating key:", key);
						bulkOps.push({
							updateOne: {
								filter: { _id: id, "keys._id": key._id },
								update: {
									$set: {
										"keys.$.keyWay": key.keyWay,
										"keys.$.keyCode": key.keyCode,
										"keys.$.doorLocation": key.doorLocation,
									},
								},
							},
						});
					}
					// Handle deleting keys
					else if (key.status === "delete" && key._id) {
						console.log("Deleting key:", key);
						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: { $pull: { keys: { _id: key._id } } },
							},
						});
					}
				});

				console.log("Bulk operations for keys:", bulkOps);

				// Execute bulk operations if any valid operations exist
				if (bulkOps.length > 0) {
					console.log("Executing bulk operations...");
					await Manager.bulkWrite(bulkOps);
					hasUpdates = true; // Flag as having performed updates
					console.log("Bulk operations completed successfully.");
				}

				// Perform the main update if there are updates
				if (hasUpdates) {
					console.log("Updating manager with id:", id);
					const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

					if (!updatedManager) {
						console.log("Manager not found with id:", id);
						throw new Error("Manager not found");
					}

					// Publish updates to any subscribers (e.g., for a GraphQL subscription)
					pubsub.publish("MANAGER_UPDATED", {
						onManagerChange: {
							eventType: "MANAGER_UPDATED",
							managerChanges: updatedManager,
						},
					});

					console.log("Manager updated successfully:", updatedManager);
					return updatedManager; // Return the updated manager object
				} else {
					console.log("No valid updates provided");
					return null; // Return null if no updates were made
				}
			} catch (err) {
				console.error("Error updating manager", err); // Log the error for debugging
				throw err; // Rethrow the error so it can be handled by the calling function
			}
		},

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
		onManagerChange: {
			subscribe: () => pubsub.asyncIterator(["MANAGER_ADDED", "MANAGER_UPDATED", "MANAGER_DELETED"]),
		},
	},

	Manager: {
		createdAt: (manager) => manager.createdAt.toISOString(),
		updatedAt: (manager) => manager.updatedAt.toISOString(),
	},
};

module.exports = { managerResolvers };
