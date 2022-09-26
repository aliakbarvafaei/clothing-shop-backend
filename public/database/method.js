async function findOneListingByEmail(client, emailOfListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection).findOne({ email: emailOfListing });
  
    if (result) {
        console.log(`Found a listing in the collection with the Email '${emailOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${emailOfListing}'`);
    }
  }

async function createMultipleListings(client, newListings,collection){
    const result = await client.db("clothing-shopping-app").collection(collection).insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);       
    }

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
  
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  };

async function updateListingByEmail(client, emailOfListing, updatedListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateOne({ email: emailOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    };

async function upsertListingByEmail(client, emailOfListing, updatedListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateOne({ email: emailOfListing }, 
                                    { $set: updatedListing }, 
                                    { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

async function updateAllListingsToHavePropertyType(client,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateMany({ property_type: { $exists: false } }, 
                                    { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function deleteListingByEmail(client, emailOfListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
            .deleteOne({ email: emailOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function deleteListingsScrapedBeforeDate(client, date,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
        .deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

  module.exports = {
    findOneListingByEmail: findOneListingByEmail,
    createMultipleListings: createMultipleListings,
    listDatabases: listDatabases,
    updateListingByEmail: updateListingByEmail,
    upsertListingByEmail: upsertListingByEmail,
    updateAllListingsToHavePropertyType: updateAllListingsToHavePropertyType,
    deleteListingByEmail: deleteListingByEmail,
    deleteListingsScrapedBeforeDate: deleteListingsScrapedBeforeDate,
};