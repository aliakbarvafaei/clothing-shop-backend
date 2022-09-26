//jshint esversion:6
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { findOneListing,
  findListing,
  createMultipleListings,
  deleteOneListing,
  updateOneListing
} = require("./public/database/method")
const md5 = require("md5");
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);  

try {
    client.connect();
} catch (e) {
    console.error(e);
}

app.route('/isincart/:emailUser')
  .get(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];
    const result =await findOneListing(client, { email: email, code:code }, "carts");
  
    if (result) {
      res.send(result.quantity);
    } else {
      res.status(404);
      console.log("data not exist in cart");
      res.send('not exist');
    }
  })

app.route('/cart/:emailUser')
  .post(async function(req, res){
    const result =await findListing(client, {email: req.params.emailUser, code:req.body.code}, "carts");
    if(result.length>0){
      res.status(409);
      console.log("data exist...");
      res.send('exist');
    }else{
      const NewCart = [{
        email: req.params.emailUser,
        code: req.body.code,
        quantity: req.body.quantity,
      }];
      const answer = await createMultipleListings(client, NewCart, "carts");
      res.send(answer);
    } 
  })
  .get(async function(req, res){
    const result =await findListing(client, {email: req.params.emailUser}, "carts");
    var productsCode=[];
    result.forEach(item=>productsCode.push(item.code));

    const result2 =await findListing(client, {code :{ $in: productsCode }}, "products");

    var productWithQuantity = [];
    for(let i=0;i<result.length;i++){
      for(let k=0;k<result2.length;k++){
        if(result[i].code===result2[k].code){
          productWithQuantity = [...productWithQuantity,{product:result2[k], quantity:result[i].quantity}];
          break;
        }
      }
    }
    res.send(productWithQuantity);  
  })
  .delete(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    const result =await deleteOneListing(client, { email: email, code:code }, "carts");
    res.send(result);
  })
  .patch(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    const result = await updateOneListing(client, {email: email,code: code}, req.body, "carts");
    res.send(result);
  });

app.route('/wishlist/:emailUser')
  .post(async function(req, res){
    const result =await findListing(client, {email: req.params.emailUser, code:req.body.code}, "wishlists");
    if(result.length>0){
      res.status(409);
      console.log("data exist...");
      res.send('exist');
    }else{
      const NewWishlist = [{
        email: req.params.emailUser,
        code: req.body.code
      }];
      const answer = await createMultipleListings(client, NewWishlist, "wishlists");
      res.send(answer);
    }
  })
  .get(async function(req, res){
    const result =await findListing(client, {email: req.params.emailUser}, "wishlists");
    var productsCode=[];
    result.forEach(item=>productsCode.push(item.code));

    const result2 =await findListing(client, {code :{ $in: productsCode }}, "products");

    res.send(result2);
  })
  .delete(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    const result =await deleteOneListing(client, { email: email, code:code }, "wishlists");
    res.send(result);
  })

app.post("/register",async function(req , res){

  const result =await findOneListing(client, { email: req.body.email }, "users");
  if(result){
    res.status(409);
    console.log("data exist...");
    res.send('exist');
  }else{
    const NewUser = [{
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: md5(req.body.password),
    }];
    const answer = await createMultipleListings(client, NewUser, "users");
    res.status(201);
    console.log('registered...');
    res.send("registered");
  }

});

app.post("/login",async function(req , res){
  const result =await findOneListing(client, { email: req.body.email }, "users");
  if(result){
    if(result.password === md5(req.body.password)){
      res.status(200);
      console.log('Login success...');
      res.send(result);
    }
    else{
      res.status(401);
      console.log('Login unsuccess: password notCorrect...');
      res.send('Password not correct');
    }
  }else{
    res.status(404);
    console.log('User not found...');
    res.send('User not found');
  }
});

app.route('/products')
  .post(async function (req , res) {
    const NewProduct = [{
      code: req.body.code,
      name: req.body.name,
      price: req.body.price,
      off: req.body.off,
      size: (req.body.size).split(","),
      description: req.body.description,
      gender: req.body.gender,
      category: req.body.category,
      images: (req.body.images).split(","),
      date: req.body.date,
      rating: req.body.rating,
      colors: (req.body.colors).split(","),
      stock: req.body.stock,
      details: req.body.details,
      review: req.body.review,
      video: req.body.video,
    }];
    const answer = await createMultipleListings(client, NewProduct, "products");
    res.send(answer);
  })
  .get(async function ( req , res){
    const result =await findListing(client, {}, "products");
    res.send(result);
  });


app.route("/product/:idProduct")
  .get(async function(req , res){
    const result =await findOneListing(client, { code: req.params.idProduct }, "products");
    if(result){
      console.log('Product found...');
      res.send(result);
    }else{
      res.status(404);
      console.log('Product not found...');
      res.send('Product not found');
    }
  })
  .patch(async function(req, res){
    const result = await updateOneListing(client, {code: req.params.idProduct}, req.body, "products");
    res.send("changed");
  });


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
// });

app.use(express.static(path.join(__dirname + "/pub")));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/pub' + '/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
