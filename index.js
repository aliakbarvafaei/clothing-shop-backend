//jshint esversion:6
const express = require("express");
const dotenv = require("dotenv")
dotenv.config();
const md5 = require("md5");
const cors = require('cors');
const http = require("http");
const helmet = require("helmet");
const compression = require("compression");
const logger = require('morgan'); 
const { allowedDomains, port } = require("./config/config");
const mysql = require('mysql');
const { insertDataProduct } = require("./public/database/methodMysql");

const app = express();

app.use( cors({ origin: allowedDomains}) );
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var connectMysql = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "Vafa2012#",
  database: "clothing-shoppig"
});

connectMysql.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql database...");
});

app.route('/isincart/:emailUser')
  .get(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    connectMysql.query("SELECT * FROM `carts` WHERE email ='"+email+"' AND code ="+code+";"
      , function (err, result) {
      if (err) throw err;
      if (result.length>0) {
        res.send(String(result[0].quantity));
      } else {
        res.status(404);
        console.log("data not exist in cart");
        res.send('not exist');
      }
    });
  })

app.route('/cart/:emailUser')
  .post(async function(req, res){
    connectMysql.query("SELECT * FROM `carts` WHERE email ='"+req.params.emailUser+"' AND code ="+req.body.code+";"
      , function (err, result) {
      if (err) throw err;
      console.log(result)
      if (result.length>0) {
        res.status(409);
        console.log("data exist...");
        res.send('exist');
      } else {
        connectMysql.query("INSERT INTO `carts` (email,code,quantity) VALUES ('"+req.params.emailUser+"',"+req.body.code+","+req.body.quantity+")"
        ,function(err, result){
          if (err) throw err;
          res.send('New product add to cart');
        })
      }
    });
  })
  .get(async function(req, res){
    connectMysql.query(`SELECT * FROM carts INNER JOIN products
    ON carts.code=products.code
    WHERE email = '${req.params.emailUser}';`
        ,function(err, result){
          if (err) throw err;
          res.send(result);
        })
  })
  .delete(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    connectMysql.query(`DELETE FROM carts WHERE email='${email}' AND code=${code};`
        ,function(err, result){
          if (err) throw err;
          res.send("deleted product from cart");
        })
  })
  .patch(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];

    connectMysql.query(`UPDATE carts
    SET quantity = ${req.body.quantity}
    WHERE email = '${email}' AND code = ${code} ;`
        ,function(err, result){
          if (err) throw err;
          res.send("updated product in cart");
        })
  });

app.route('/wishlist/:emailUser')
  .post(async function(req, res){
    connectMysql.query("SELECT * FROM `wishlists` WHERE email ='"+req.params.emailUser+"' AND code ="+req.body.code+";"
      , function (err, result) {
      if (err) throw err;
      console.log(result)
      if (result.length>0) {
        res.status(409);
        console.log("data exist...");
        res.send('exist');
      } else {
        connectMysql.query("INSERT INTO `wishlists` (email,code) VALUES ('"+req.params.emailUser+"',"+req.body.code+")"
        ,function(err, result){
          if (err) throw err;
          res.send('New product add to wishlists');
        })
      }
    });
  })
  .get(async function(req, res){
    connectMysql.query(`SELECT * FROM wishlists INNER JOIN products
    ON wishlists.code=products.code
    WHERE email = '${req.params.emailUser}';`
        ,function(err, result){
          if (err) throw err;
          res.send(result);
        })
  })
  .delete(async function(req, res){
    var email = req.params.emailUser.split('!')[0];
    var code = req.params.emailUser.split('!')[1];
    
    connectMysql.query(`DELETE FROM wishlists WHERE email='${email}' AND code=${code};`
    ,function(err, result){
      if (err) throw err;
      res.send("deleted product from wishlists");
    })

  })

app.post("/register",async function(req , res){

  connectMysql.query("SELECT * FROM users WHERE email ='"+req.body.email+"';"
      , function (err, result) {
      if (err) throw err;
      if(result.length>0){
        res.status(409);
        console.log("data exist...");
        res.send('exist');
      } else {
        connectMysql.query(`INSERT INTO users (email,fname,lname,password) 
        VALUES ('${req.body.email}','${req.body.fname}','${req.body.lname}','${md5(req.body.password)}')`
        ,function(err, result){
          if (err) throw err;
          res.status(201);
          console.log('registered...');
          res.send("registered");
        })
      }
  })

});

app.post("/login",async function(req , res){
  connectMysql.query(`SELECT * FROM users WHERE email ='${req.body.email}';`
      , function (err, result) {
      if (err) throw err;
      if(result.length>0){
        if(result[0].password === md5(req.body.password)){
          res.status(200);
          console.log('Login success...');
          res.send(result[0]);
        }
        else{
          res.status(401);
          console.log('Login unsuccess: password notCorrect...');
          res.send('Password not correct');
        }
      } else {
        res.status(404);
        console.log('User not found...');
        res.send('User not found');
      }
  })
});

app.route('/products')
  .post(async function (req , res) {
    const NewProduct = {
      code: req.body.code,
      name: req.body.name,
      price: req.body.price,
      off: req.body.off,
      size: req.body.size,
      description: req.body.description,
      gender: req.body.gender,
      category: req.body.category,
      images: req.body.images,
      date: req.body.date,
      rating: req.body.rating,
      colors: req.body.colors,
      stock: req.body.stock,
      details: req.body.details,
      review: req.body.review,
      video: req.body.video,
    };
    insertDataProduct(connectMysql, NewProduct, "products");
    res.send("New product added.")
  })
  .get(async function ( req , res){
    connectMysql.query(`SELECT * FROM products LIMIT 8;`
        ,function(err, result){
          if (err) throw err;
          res.send(result);
        })
  });

app.route('/user/:emailUser')
  .get(async function (req, res){
    connectMysql.query(`SELECT * FROM users WHERE email='${req.params.emailUser}'`
      ,function(err, result){
        if (err) throw err;
        res.send(result[0]);
      })
  })
  .patch(async function (req, res){
    connectMysql.query(`SELECT * FROM users WHERE email ='${req.params.emailUser}';`
      , function (err, result) {
      if (err) throw err;
      if(result.length>0){
        if(result[0].password === md5(req.body.LastPassword)){
          connectMysql.query(`UPDATE users
          SET password = '${md5(req.body.NewPassword)}'
          WHERE email = '${req.params.emailUser}';`
              ,function(err, result2){
                if (err) throw err;
                res.status(200);
                console.log('Change Password success...');
                res.send(result[0]);
              })
        }
        else{
          res.status(401);
          console.log('Change Password unsuccess: password notCorrect...');
          res.send('Password not correct');
        }
      } else {
        res.status(404);
        console.log('User not found...');
        res.send('User not found');
      }
  })

  })

app.route('/productsFilter')
  .post(async function (req, res){
    var filter = req.body.filters;  
    filter.category.map((item,index)=>{
      filter.category[index]="'"+item+"'";
    })
    filter.gender.map((item,index)=>{
      filter.gender[index]="'"+item+"'";
    })
    function checkArrayInArray(arr1,arr2){
      for(let i=0;i<arr1.length;i++)
        if(arr2.includes(arr1[i]))
          return true;
      return false;
    }
    connectMysql.query(`SELECT * FROM products
    WHERE category IN (${filter.category}) AND gender IN (${filter.gender}) 
    AND priceDiscounted >= ${parseInt(filter.priceRange.from)}
    AND priceDiscounted <= ${parseInt(filter.priceRange.to)}
    AND stock >= ${filter.inStock===true ? 1:0}
    AND ( code LIKE '%${filter.searchInput}%' 
    OR name LIKE '%${filter.searchInput.toUpperCase()}%'
    OR name LIKE '%${filter.searchInput.toLowerCase()}%');`
        ,function(err, result){
          result = result.filter((item)=>{
            return checkArrayInArray(item.colors.split(','),filter.color) && checkArrayInArray(item.size.split(','),filter.size);
          })
          if (err) throw err;
          const startIndex =(parseInt(req.body.pageNumber)-1)*(parseInt(req.body.pageSize))
          res.send(result.slice(startIndex,startIndex+parseInt(req.body.pageSize)));
        })
    // const result =await findListing(client, req.body.filters, "products", { pageNumber: parseInt(req.body.pageNumber), size: parseInt(req.body.pageSize) });
  });

app.route("/product/:idProduct")
  .get(async function(req , res){
    connectMysql.query(`SELECT * FROM products WHERE code ='${req.params.idProduct}';`
      , function (err, result) {
      if (err) throw err;
      if(result.length>0){
        console.log('Product found...');
        res.send(result[0]);
      }else{
        res.status(404);
        console.log('Product not found...');
        res.send('Product not found');
      }
    })
  })

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/../client/build', 'index.html'));
// });

// app.use(express.static(path.join(__dirname + "/pub")));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/pub' + '/index.html'));
// });

// const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
