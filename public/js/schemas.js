    const usersSchema ={
    fname: String,
    lname: String,
    email: String,
    password: String,
    // cart: [{
    //   product:productsSchema,
    //   count:String
    // }]
  };
  const productsSchema ={
    code: String,
    name: String,
    price: String,
    off: String,
    size: [],
    gender: String,
    category: String,
    images: [],
    date: String,
    rating: String,
    colors: [],
    stock: String,
    description: String,
    details: String,
    video: String,
    review: String,
  };
  const wishlistSchema ={
    email: String,
    code: String,
  };
  module.exports = {
      usersSchema: usersSchema,
      productsSchema: productsSchema,
      wishlistSchema: wishlistSchema
  };
  