async function findOneListingByEmail(client, emailOfListing) {
    const result = await client.db("clothing-shopping-app").collection("users").findOne({ email: emailOfListing });
  
    if (result) {
        console.log(`Found a listing in the collection with the name '${emailOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${emailOfListing}'`);
    }
  }

  module.exports = {
    findOneListingByEmail: findOneListingByEmail,
};