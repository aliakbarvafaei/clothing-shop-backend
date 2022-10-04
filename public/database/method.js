async function findOneListing(client, filter,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection).findOne(filter);
  
    if (result) {
        // console.log(`Found a listing in the collection with the Email '${filter.email}':`);
        // console.log(result);
        return result;
    } else {
        // console.log(`No listings found with the name '${filter.email}'`);
        return "";
    }
  }

async function findListing(client, filter, collection) {
    const result = await client.db("clothing-shopping-app").collection(collection).find(filter);
  
    if (result) {
        const array = await result.toArray();
        // if(filter.email)
        //     console.log(`Found a listing in the ${collection} collection with the Email '${filter.email}`);
        // else    console.log(`Found a listing in the ${collection} collection`); 
        //     // console.log(array);
        return array;
    } else {
        // console.log(`No listings found with the name '${filter.email}'`);
        return [];
    }
  }

async function createMultipleListings(client, newListings,collection){
    const result = await client.db("clothing-shopping-app").collection(collection).insertMany(newListings);

    // console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    // console.log(result.insertedIds);       
    return `${result.insertedCount} new listing(s) created with the following id(s):`;
    }

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
  
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  };

async function updateOneListing(client, filter, updatedListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateOne(filter, { $set: updatedListing });

    // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    // console.log(`${result.modifiedCount} document(s) was/were updated.`);
    return `${result.modifiedCount} document(s) was/were updated.`;
    };

async function upsertListingByEmail(client, emailOfListing, updatedListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateOne({ email: emailOfListing }, 
                                    { $set: updatedListing }, 
                                    { upsert: true });
    // console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    // if (result.upsertedCount > 0) {
    //     console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    // } else {
    //     console.log(`${result.modifiedCount} document(s) was/were updated.`);
    // }
}

async function updateAllListingsToHavePropertyType(client,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateMany({ property_type: { $exists: false } }, 
                                    { $set: { property_type: "Unknown" } });
    // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    // console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function deleteOneListing(client, filter, collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
            .deleteOne(filter);
    // console.log(`${result.deletedCount} document(s) was/were deleted.`);
    return `${result.deletedCount} document(s) was/were deleted.`;
}

async function deleteListingsScrapedBeforeDate(client, date,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
        .deleteMany({ "last_scraped": { $lt: date } });
    // console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

  module.exports = {
    findOneListing: findOneListing,
    findListing: findListing,
    createMultipleListings: createMultipleListings,
    listDatabases: listDatabases,
    updateOneListing: updateOneListing,
    upsertListingByEmail: upsertListingByEmail,
    updateAllListingsToHavePropertyType: updateAllListingsToHavePropertyType,
    deleteOneListing: deleteOneListing,
    deleteListingsScrapedBeforeDate: deleteListingsScrapedBeforeDate,
};