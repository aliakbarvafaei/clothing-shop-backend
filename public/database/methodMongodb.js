//const { MongoClient } = require('mongodb');
// const uri = process.env.MONGO_URI;
// const client = new MongoClient(uri);  

// try {
//     client.connect();
// } catch (e) {
//     console.error(e);
// }


async function findOneListing(client, filter,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection).findOne(filter);
  
    if (result) {
        return result;
    } else {
        return "";
    }
  }

async function findListing(client, filter, collection, limited=false) {
    if(!limited)
        result = await client.db("clothing-shopping-app").collection(collection).find(filter);
    else{
        result = await client.db("clothing-shopping-app").collection(collection)
        .find( {
            "colors" : { $in : filter.color},
            "size" : { $in : filter.size},
            "gender" : { $in : filter.gender},
            "category" : { $in : filter.category},
            "priceDiscounted" : { $gt : parseInt(filter.priceRange.from), $lt : parseInt(filter.priceRange.to) },
            $or : [
                {"code" : {$regex : filter.searchInput}},
                {"name" : {$regex : filter.searchInput}},
                {"name" : {$regex : (filter.searchInput).toUpperCase()}},
            ],
            "stock" : filter.inStock===true ? { $gt : 0 } : { $gt : -1 } ,
        }
        )
        .skip((limited.pageNumber-1)*limited.size).limit(limited.size);
    }

    if (result) {
        const array = await result.toArray();
        return array;
    } else {
        return [];
    }
  }

async function createMultipleListings(client, newListings,collection){
    const result = await client.db("clothing-shopping-app").collection(collection).insertMany(newListings);

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

    return `${result.modifiedCount} document(s) was/were updated.`;
    };

async function upsertListingByEmail(client, emailOfListing, updatedListing,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateOne({ email: emailOfListing }, 
                                    { $set: updatedListing }, 
                                    { upsert: true });
}

async function updateAllListingsToHavePropertyType(client,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
                        .updateMany({ property_type: { $exists: false } }, 
                                    { $set: { property_type: "Unknown" } });
}

async function deleteOneListing(client, filter, collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
            .deleteOne(filter);
    return `${result.deletedCount} document(s) was/were deleted.`;
}

async function deleteListingsScrapedBeforeDate(client, date,collection) {
    const result = await client.db("clothing-shopping-app").collection(collection)
        .deleteMany({ "last_scraped": { $lt: date } });
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