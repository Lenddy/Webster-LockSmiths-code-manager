// updateOneManager: async (parent, args, { user }) => {

//     const { id, name, addressesInfo } = args;
//     const update = {};
//     let hasUpdates = false;
//     console.log("Received arguments:", args);

//     if (!user || user.role !== "admin") {
//         throw new Error("Unauthorized: Admin access required.");
//     }

//     // Update the name field if it's provided
//     if (name !== null && name !== undefined) {
//         update.name = name;
//         hasUpdates = true;
//         console.log("Name updated:", name);
//     }

//     try {
//         const bulkOps = []; // Array to hold bulk operations

//         // Normalize addresses to an array if it's a single object
//         const normalizedAddresses = Array.isArray(addressesInfo) ? addressesInfo : addressesInfo ? [addressesInfo] : [];

//         console.log("Normalized addresses:", normalizedAddresses);

//         // Process addresses and prepare bulk operations
//         normalizedAddresses.forEach((address) => {
//             console.log("Processing address:", address);

//             if (!address || !address.status) {
//                 console.log("Skipping invalid address:", address);
//                 return; // Skip if no valid address or status
//             }

//             // Handle adding new addresses, updating, or deleting addresses (existing logic remains)
//             // (Add handling logic for addresses similar to your current resolver)
//             if (address.status === "add" && address.address && address.city) {
//                 console.log("Adding address:", address);

//                 // Add address first
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id },
//                         update: { $push: { addresses: { ...address } } },
//                     },
//                 });

//                 // Now handle keys associated with the address, if any
//                 address.keys?.forEach((key) => {
//                     if (key.status === "add") {
//                         // Add the key to the address after the address is added
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses.address": address.address },
//                                 update: { $push: { "addresses.$.keys": key } },
//                             },
//                         });
//                     }
//                 });
//             }
//             // Handle updating existing addresses
//             else if (address.status === "update" && address.addressId) {
//                 console.log("Updating address:", address);

//                 // Process keys within the address for update
//                 address.keys?.forEach((key) => {
//                     if (key.status === "add") {
//                         // Add key to the address using addressId
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId },
//                                 update: { $push: { "addresses.$.keys": key } },
//                             },
//                         });
//                     } else if (key.status === "update" && key.keyId) {
//                         // Update existing key
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId, "addresses.keys._id": key.keyId },
//                                 update: {
//                                     $set: {
//                                         "addresses.$.keys.$.keyWay": key.keyWay,
//                                         "addresses.$.keys.$.keyCode": key.keyCode,
//                                         "addresses.$.keys.$.doorLocation": key.doorLocation,
//                                     },
//                                 },
//                             },
//                         });
//                     } else if (key.status === "delete" && key.keyId) {
//                         // Delete key from address
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId },
//                                 update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
//                             },
//                         });
//                     }
//                 });

//                 // Update the address itself after processing keys
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id, "addresses._id": address.addressId },
//                         update: {
//                             $set: {
//                                 "addresses.$.address": address.address,
//                                 "addresses.$.city": address.city,
//                                 "addresses.$.state": address.state,
//                                 "addresses.$.zipCode": address.zipCode,
//                             },
//                         },
//                     },
//                 });
//             }
//             // Handle deleting addresses
//             else if (address.status === "delete" && address.addressId) {
//                 console.log("Deleting address:", address);
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id },
//                         update: { $pull: { addresses: { _id: address.addressId } } },
//                     },
//                 });

//                 // If the address is deleted, delete all keys associated with it
//                 if (address.keys) {
//                     address.keys.forEach((key) => {
//                         if (key.keyId) {
//                             bulkOps.push({
//                                 updateOne: {
//                                     filter: { _id: id, "addresses._id": address.addressId },
//                                     update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
//                                 },
//                             });
//                         }
//                     });
//                 }
//             }
//         });

//         // Execute bulk operations if any valid operations exist
//         if (bulkOps.length > 0) {
//             console.log("Executing bulk operations...");
//             await Manager.bulkWrite(bulkOps);
//             hasUpdates = true; // Flag as having performed updates
//             console.log("Bulk operations completed successfully.");
//         }

//         // Perform the main update if there are updates
//         if (hasUpdates) {
//             console.log("Updating manager with id:", id);
//             const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

//             if (!updatedManager) {
//                 console.log("Manager not found with id:", id);
//                 throw new Error("Manager not found");
//             }

//             pubsub.publish("MANAGER_UPDATED", {
//                 onManagerChange: {
//                     eventType: "MANAGER_UPDATED",
//                     managerChanges: updatedManager,
//                 },
//             });

//             console.log("Manager updated successfully:", updatedManager);
//             return updatedManager;
//         } else {
//             console.log("No valid updates provided");
//             return null;
//         }
//     } catch (err) {
//         console.error("Error updating manager", err);
//         throw err;
//     }
// },

// // // Importing Client model, uuid for unique IDs, and pubsub for event publishing

// updateOneManager: async (parent, args, context, info) => {
//     const { id, name, addressesInfo } = args;

//     const update = {};
//     let hasUpdates = false; // Flag to track if there's valid data to update

//     console.log("Received arguments:", args);

//     // Update the name field if it's provided
//     if (name !== null && name !== undefined) {
//         update.name = name;
//         hasUpdates = true;
//         console.log("Name updated:", name);
//     }

//     try {
//         const bulkOps = []; // Array to hold bulk operations

//         // Normalize addresses to an array if it's a single object
//         const normalizedAddresses = Array.isArray(addressesInfo) ? addressesInfo : addressesInfo ? [addressesInfo] : [];

//         console.log("Normalized addresses:", normalizedAddresses);

//         // Process addresses and prepare bulk operations
//         normalizedAddresses.forEach((address) => {
//             console.log("Processing address:", address);

//             if (!address || !address.status) {
//                 console.log("Skipping invalid address:", address);
//                 return; // Skip if no valid address or status
//             }

//             // Handle adding new addresses
//             if (address.status === "add" && address.address && address.city) {
//                 console.log("Adding address:", address);

//                 // Add address first
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id },
//                         update: { $push: { addresses: { ...address } } },
//                     },
//                 });

//                 // Now handle keys associated with the address, if any
//                 address.keys?.forEach((key) => {
//                     if (key.status === "add") {
//                         // Add the key to the address after the address is added
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses.address": address.address },
//                                 update: { $push: { "addresses.$.keys": key } },
//                             },
//                         });
//                     }
//                 });
//             }
//             // Handle updating existing addresses
//             else if (address.status === "update" && address.addressId) {
//                 console.log("Updating address:", address);

//                 // Process keys within the address for update
//                 address.keys?.forEach((key) => {
//                     if (key.status === "add") {
//                         // Add key to the address using addressId
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId },
//                                 update: { $push: { "addresses.$.keys": key } },
//                             },
//                         });
//                     } else if (key.status === "update" && key.keyId) {
//                         // Update existing key
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId, "addresses.keys._id": key.keyId },
//                                 update: {
//                                     $set: {
//                                         "addresses.$.keys.$.keyWay": key.keyWay,
//                                         "addresses.$.keys.$.keyCode": key.keyCode,
//                                         "addresses.$.keys.$.doorLocation": key.doorLocation,
//                                     },
//                                 },
//                             },
//                         });
//                     } else if (key.status === "delete" && key.keyId) {
//                         // Delete key from address
//                         bulkOps.push({
//                             updateOne: {
//                                 filter: { _id: id, "addresses._id": address.addressId },
//                                 update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
//                             },
//                         });
//                     }
//                 });

//                 // Update the address itself after processing keys
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id, "addresses._id": address.addressId },
//                         update: {
//                             $set: {
//                                 "addresses.$.address": address.address,
//                                 "addresses.$.city": address.city,
//                                 "addresses.$.state": address.state,
//                                 "addresses.$.zipCode": address.zipCode,
//                             },
//                         },
//                     },
//                 });
//             }
//             // Handle deleting addresses
//             else if (address.status === "delete" && address.addressId) {
//                 console.log("Deleting address:", address);
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: id },
//                         update: { $pull: { addresses: { _id: address.addressId } } },
//                     },
//                 });

//                 // If the address is deleted, delete all keys associated with it
//                 if (address.keys) {
//                     address.keys.forEach((key) => {
//                         if (key.keyId) {
//                             bulkOps.push({
//                                 updateOne: {
//                                     filter: { _id: id, "addresses._id": address.addressId },
//                                     update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
//                                 },
//                             });
//                         }
//                     });
//                 }
//             }
//         });

//         console.log("Bulk operations for addresses:", bulkOps);

//         // Execute bulk operations if any valid operations exist
//         if (bulkOps.length > 0) {
//             console.log("Executing bulk operations...");
//             console.log("Final bulk operations array:", bulkOps);
//             await Manager.bulkWrite(bulkOps);
//             hasUpdates = true; // Flag as having performed updates
//             console.log("Bulk operations completed successfully.");
//         }

//         // Perform the main update if there are updates
//         if (hasUpdates) {
//             console.log("Updating manager with id:", id);
//             const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

//             if (!updatedManager) {
//                 console.log("Manager not found with id:", id);
//                 throw new Error("Manager not found");
//             }

//             // Publish updates to any subscribers (e.g., for a GraphQL subscription)
//             pubsub.publish("MANAGER_UPDATED", {
//                 onManagerChange: {
//                     eventType: "MANAGER_UPDATED",
//                     managerChanges: updatedManager,
//                 },
//             });

//             console.log("Manager updated successfully:", updatedManager);
//             return updatedManager; // Return the updated manager object
//         } else {
//             console.log("No valid updates provided");
//             return null; // Return null if no updates were made
//         }
//     } catch (err) {
//         console.error("Error updating manager", err); // Log the error for debugging
//         throw err; // Rethrow the error so it can be handled by the calling function
//     }
// },

// // Importing Client model, uuid for unique IDs, and pubsub for event publishing
// const Manager = require("../../models/manager.model");
// const { v4: uuidv4 } = require("uuid");
// const pubsub = require("../pubsub");

// const managerResolvers = {
// 	Query: {
// 		hello: async () => {
// 			return "hello world";
// 		},

// 		getAllManagers: async () => {
// 			try {
// 				const managers = await Manager.find();
// 				console.log("all the Managers", managers, "\n____________________");
// 				return managers;
// 			} catch (err) {
// 				console.log("there was an error fetching all the Managers", err, "\n____________________");
// 				throw err;
// 			}
// 		},

// 		getOneManager: async (_, { id }) => {
// 			try {
// 				const manager = await Manager.findById(id);
// 				console.log("one Manager", manager, "\n____________________");
// 				return manager;
// 			} catch (err) {
// 				console.log("there was an error fetching one Manager", err, "\n____________________");
// 				throw err;
// 			}
// 		},
// 	},

// 	Mutation: {
// 		createOneManager: async (_, { name, addresses, keys }) => {
// 			const createdAt = new Date().toISOString();
// 			const updatedAt = new Date().toISOString();

// 			// Uncomment and use if cellPhones processing is needed
// 			// cellPhones = cellPhones.map((numberDate) => {
// 			//     return {
// 			//         ...numberDate,
// 			//         numberId: uuidv4(),
// 			//     };
// 			// });

// 			try {
// 				const newManager = await Manager.create({
// 					name,
// 					addresses,
// 					keys,
// 					createdAt,
// 					updatedAt,
// 				});

// 				pubsub.publish("MANAGER_ADDED", {
// 					onManagerChange: {
// 						eventType: "MANAGER_ADDED",
// 						ManagerChanges: newManager,
// 					},
// 				});

// 				console.log("new Manager created", newManager, "\n____________________");
// 				return newManager;
// 			} catch (err) {
// 				console.log("there was an error creating a new Manager", err, "\n____________________");
// 				throw err;
// 			}
// 		},

// 		updateOneManager: async (parent, args, context, info) => {
// 			const { id, name, addressesInfo } = args;

// 			const update = {};
// 			let hasUpdates = false; // Flag to track if there's valid data to update

// 			console.log("Received arguments:", args);

// 			// Update the name field if it's provided
// 			if (name !== null && name !== undefined) {
// 				update.name = name;
// 				hasUpdates = true;
// 				console.log("Name updated:", name);
// 			}

// 			try {
// 				const bulkOps = []; // Array to hold bulk operations

// 				// Normalize addresses to an array if it's a single object
// 				const normalizedAddresses = Array.isArray(addressesInfo) ? addressesInfo : addressesInfo ? [addressesInfo] : [];

// 				console.log("Normalized addresses:", normalizedAddresses);

// 				// Process addresses and prepare bulk operations
// 				normalizedAddresses.forEach((address) => {
// 					console.log("Processing address:", address);

// 					if (!address || !address.status) {
// 						console.log("Skipping invalid address:", address);
// 						return; // Skip if no valid address or status
// 					}

// 					// Handle adding new addresses
// 					if (address.status === "add" && address.address && address.city) {
// 						console.log("Adding address:", address);

// 						// Add address first
// 						bulkOps.push({
// 							updateOne: {
// 								filter: { _id: id },
// 								update: { $push: { addresses: { ...address } } },
// 							},
// 						});

// 						// Now handle keys associated with the address, if any
// 						address.keys?.forEach((key) => {
// 							if (key.status === "add") {
// 								// Add the key to the address after the address is added
// 								bulkOps.push({
// 									updateOne: {
// 										filter: { _id: id, "addresses.address": address.address },
// 										update: { $push: { "addresses.$.keys": key } },
// 									},
// 								});
// 							}
// 						});
// 					}
// 					// Handle updating existing addresses
// 					else if (address.status === "update" && address.addressId) {
// 						console.log("Updating address:", address);

// 						// Process keys within the address for update
// 						address.keys?.forEach((key) => {
// 							if (key.status === "add") {
// 								// Add key to the address using addressId
// 								bulkOps.push({
// 									updateOne: {
// 										filter: { _id: id, "addresses._id": address.addressId },
// 										update: { $push: { "addresses.$.keys": key } },
// 									},
// 								});
// 							} else if (key.status === "update" && key.keyId) {
// 								// Update existing key
// 								bulkOps.push({
// 									updateOne: {
// 										filter: { _id: id, "addresses._id": address.addressId, "addresses.keys._id": key.keyId },
// 										update: {
// 											$set: {
// 												"addresses.$.keys.$.keyWay": key.keyWay,
// 												"addresses.$.keys.$.keyCode": key.keyCode,
// 												"addresses.$.keys.$.doorLocation": key.doorLocation,
// 											},
// 										},
// 									},
// 								});
// 							} else if (key.status === "delete" && key.keyId) {
// 								// Delete key from address
// 								bulkOps.push({
// 									updateOne: {
// 										filter: { _id: id, "addresses._id": address.addressId },
// 										update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
// 									},
// 								});
// 							}
// 						});

// 						// Update the address itself after processing keys
// 						bulkOps.push({
// 							updateOne: {
// 								filter: { _id: id, "addresses._id": address.addressId },
// 								update: {
// 									$set: {
// 										"addresses.$.address": address.address,
// 										"addresses.$.city": address.city,
// 										"addresses.$.state": address.state,
// 										"addresses.$.zipCode": address.zipCode,
// 									},
// 								},
// 							},
// 						});
// 					}
// 					// Handle deleting addresses
// 					else if (address.status === "delete" && address.addressId) {
// 						console.log("Deleting address:", address);
// 						bulkOps.push({
// 							updateOne: {
// 								filter: { _id: id },
// 								update: { $pull: { addresses: { _id: address.addressId } } },
// 							},
// 						});

// 						// If the address is deleted, delete all keys associated with it
// 						if (address.keys) {
// 							address.keys.forEach((key) => {
// 								if (key.keyId) {
// 									bulkOps.push({
// 										updateOne: {
// 											filter: { _id: id, "addresses._id": address.addressId },
// 											update: { $pull: { "addresses.$.keys": { _id: key.keyId } } },
// 										},
// 									});
// 								}
// 							});
// 						}
// 					}
// 				});

// 				console.log("Bulk operations for addresses:", bulkOps);

// 				// Execute bulk operations if any valid operations exist
// 				if (bulkOps.length > 0) {
// 					console.log("Executing bulk operations...");
// 					console.log("Final bulk operations array:", bulkOps);
// 					await Manager.bulkWrite(bulkOps);
// 					hasUpdates = true; // Flag as having performed updates
// 					console.log("Bulk operations completed successfully.");
// 				}

// 				// Perform the main update if there are updates
// 				if (hasUpdates) {
// 					console.log("Updating manager with id:", id);
// 					const updatedManager = await Manager.findByIdAndUpdate(id, update, { new: true });

// 					if (!updatedManager) {
// 						console.log("Manager not found with id:", id);
// 						throw new Error("Manager not found");
// 					}

// 					// Publish updates to any subscribers (e.g., for a GraphQL subscription)
// 					pubsub.publish("MANAGER_UPDATED", {
// 						onManagerChange: {
// 							eventType: "MANAGER_UPDATED",
// 							managerChanges: updatedManager,
// 						},
// 					});

// 					console.log("Manager updated successfully:", updatedManager);
// 					return updatedManager; // Return the updated manager object
// 				} else {
// 					console.log("No valid updates provided");
// 					return null; // Return null if no updates were made
// 				}
// 			} catch (err) {
// 				console.error("Error updating manager", err); // Log the error for debugging
// 				throw err; // Rethrow the error so it can be handled by the calling function
// 			}
// 		},

// 		deleteOneManager: async (_, { id }) => {
// 			return await Manager.findByIdAndDelete(id)
// 				.then((deletedManager) => {
// 					pubsub.publish("MANAGER_DELETED", {
// 						onManagerChange: {
// 							eventType: "MANAGER_DELETED",
// 							managerChanges: deletedManager,
// 						},
// 					});
// 					console.log("a client was deleted", deletedManager, "\n____________________");
// 					return deletedManager;
// 				})
// 				.catch((err) => {
// 					console.log("there was an error deleting a Manager", err, "\n____________________");
// 					throw err;
// 				});
// 		},
// 	},

// 	Subscription: {
// 		onManagerChange: {
// 			subscribe: () => pubsub.asyncIterator(["MANAGER_ADDED", "MANAGER_UPDATED", "MANAGER_DELETED"]),
// 		},
// 	},

// 	Manager: {
// 		createdAt: (manager) => manager.createdAt.toISOString(),
// 		updatedAt: (manager) => manager.updatedAt.toISOString(),
// 	},
// };

// module.exports = { managerResolvers };
