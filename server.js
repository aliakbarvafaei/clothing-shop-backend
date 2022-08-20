//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const schemas = require("./public/js/schemas");
const md5 = require("md5");
const cors = require('cors');
const logger = require('morgan');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/ClothingShopping",{useNewUrlParser : true});

// const Products = mongoose.model("products" ,schemas.productsSchema);
const Users = mongoose.model("users" ,schemas.usersSchema);

app.post("/register", function(req , res){
  Users.findOne({ email: req.body.email }, function(err,findUser){
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
      if(findUser){
        res.status(409);
        console.log("data exist...");
        res.send('exist');
      }
      else{
      const NewUser = new Users({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: md5(req.body.password),
      });
      NewUser.save(function(err){
        if(err){
          res.send(err);
        }
        else{
          res.status(201);
          console.log('registered...');
          res.send("registered");
          }
      });
      }
    }
  });

});

app.post("/login", function(req , res){
  Users.findOne({ email: req.body.email }, function(err,findUser){
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
      if(findUser){
        if(findUser.password === md5(req.body.password)){
          res.status(200);
          console.log('Login success...');
          res.send(findUser);
        }
        else{
          res.status(401);
          console.log('Login unsuccess: password notCorrect...');
          res.send('Password not correct');
        }
      }
      else{
        res.status(404);
        console.log('User not found...');
        res.send('User not found');
      }
    }
  });
});
// app.post("/products",function (req , res) {
//   const NewProduct = new products({
//     id: req.body.id,
//     title: req.body.title,
//     price: req.body.price,
//     description: req.body.description,
//     category: req.body.category,
//     image: req.body.image,
//     rating: {
//     rate: req.body.rate,
//     count: req.body.count
//     }
//   });
//   NewProduct.save(function(err){
//     if(err){
//       res.send(err);
//     }
//     else{
//       res.send("success");
//     }
//   });
// });

// var positionScroll=0;
// var stateToast="";
// var user_log="";

// app.get("/login", function(req , res){
//   if(user_log!=""){
//     user_log="";
//     stateToast="Logout";
//   }
//   res.render("login" , {stateToast: stateToast,positionScroll: positionScroll});
//   stateToast="";
// });
// app.post("/login", function(req , res){
//   Users.findOne({ email: req.body.email }, function(err,findUser){
//     if(err){
//       console.log(err);
//       res.redirect("/login");
//     }
//     else{
//       if(findUser && findUser.password === md5(req.body.password)){
//         stateToast="login";
//         user_log=findUser;
//         res.redirect("/");
//       }
//       else{
//         stateToast="errorLogin";
//         res.redirect("/login");
//       }
//     }
//   });
// });
// app.get("/signup", function(req , res){
//   res.render("signup",{positionScroll: positionScroll});
// });
// app.post("/signup", function(req , res){
//   Users.findOne({ email: req.body.email }, function(err,findUser){
//     if(err){
//       console.log(err);
//       res.send(err);
//     }
//     else{
//       if(findUser){
//         stateToast="repeat";
//         res.redirect("/login");
//       }
//       else{
//       const NewUser = new Users({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         password: md5(req.body.password),
//         cart: []
//       });
//       NewUser.save(function(err){
//         if(err){
//           res.send(err);
//         }
//         else{
//           stateToast="Register";
//           res.redirect("/login");
//           }
//       });
//       }
//     }
//   });

// });

// app.get("/", function ( req , res){
//   Products.find(function (err , productsDetails){
//     if(err){
//       res.send(err);
//     }
//     else{
//       var statePre="disabled",stateNext="";
//       res.render("frame" , {postsinf: productsDetails , indexProduct: 1, statePre: statePre, stateNext: stateNext,
//       stateToast: stateToast ,user_log: user_log,positionScroll: positionScroll});
//       positionScroll=0;
//       stateToast="";
//     }
//   });
// });
// app.post("/posts/:postid/:action/:positionScroll", function ( req , res){
//   positionScroll=parseFloat(req.params.positionScroll);
//   if(user_log==""){
//     stateToast="pleaseLogin";
//     res.redirect("/");
//   }
//   else {
//       if(user_log.cart.length==0){
//         var product;
//         Products.findOne({ id: req.params.postid }, function(err,findProduct){
//           if(err){
//             console.log(err);
//             res.redirect("/login");
//           }
//           else{
//             product= findProduct;
//             const product_cart={ product: product ,count:'1' };
//             user_log.cart.push(product_cart);
//             Users.updateOne(
//               { email: user_log.email },
//               { $set : { cart : user_log.cart } },
//               function(err,findUser){
//               if(err){
//                 console.log(err);
//                 res.redirect("/login");
//               }
//               else{
//                 res.redirect("/");
//               }
//             });
//           }
//         });
//       }
//       else{
//         for(let i=0;i<user_log.cart.length;i++)
//         {
//           if(user_log.cart[i].product.id==req.params.postid){
//             if(req.params.action=="add"){
//               user_log.cart[i].count=String(parseInt(user_log.cart[i].count)+1);
//               Users.updateOne(
//                 { email: user_log.email },
//                 { $set : { cart : user_log.cart } },
//                 function(err,findUser){
//                 if(err){
//                   console.log(err);
//                   res.redirect("/login");
//                 }
//                 else{
//                   res.redirect("/");
//                 }
//               });
//             }
//             else{
//               user_log.cart[i].count=String(parseInt(user_log.cart[i].count)-1);
//               if(user_log.cart[i].count=='0')
//               {
//                 user_log.cart.splice(i, 1);
//               }
//               Users.updateOne(
//                 { email: user_log.email },
//                 { $set : { cart : user_log.cart } },
//                 function(err,findUser){
//                 if(err){
//                   console.log(err);
//                   res.redirect("/login");
//                 }
//                 else{
//                   res.redirect("/");
//                 }
//               });
//             }
//             break;
//           }
//           else if(i==user_log.cart.length-1)
//           {
//             var product;
//             Products.findOne({ id: req.params.postid }, function(err,findProduct){
//               if(err){
//                 console.log(err);
//                 res.redirect("/login");
//               }
//               else{
//                 product= findProduct;
//                 const product_cart={ product: product ,count:'1' };
//                 user_log.cart.push(product_cart);
//                 Users.updateOne(
//                   { email: user_log.email },
//                   { $set : { cart : user_log.cart } },
//                   function(err,findUser){
//                   if(err){
//                     console.log(err);
//                     res.redirect("/login");
//                   }
//                   else{
//                     res.redirect("/");
//                   }
//                 });
//               }
//             });
//           }
//         }
//       }
//     }
// });
// app.get("/pages/:pageid", function ( req , res){
//   Products.find(function (err , productsDetails){
//     if(err){
//       res.send(err);
//     }
//     else{
//       var statePre="",stateNext="";
//       if(req.params.pageid==1 || (10*(req.params.pageid-2)>=productsDetails.length)){
//         statePre="disabled";
//       }
//       if(10*parseInt(req.params.pageid)>=productsDetails.length){
//         stateNext="disabled";
//       }
//       res.render("frame" , {postsinf: productsDetails , indexProduct: req.params.pageid, statePre: statePre, stateNext: stateNext});
//     }
//   });

// });

// app.get("/home", function ( req , res){
//   Products.find(function (err , productsDetails){
//     if(err){
//       res.send(err);
//     }
//     else{
//       var statePre="disabled",stateNext="";
//       res.render("frame" , {postsinf: productsDetails , indexProduct: 1, statePre: statePre, stateNext: stateNext,
//       stateToast: stateToast ,user_log: user_log,positionScroll: positionScroll});
//       positionScroll=0;
//       stateToast="";
//     }
//   });
// });

// // app.post("/", function(req , res){
// //   const title = req.body.Title;
// //   const postDetail = req.body.postDetails;
// //   posts.push( { title : title, detail : postDetail, limit : postDetail.substring(0,100) } );
// //   res.redirect("/");
// // });
// // app.get("/about", function ( req , res){
// //   res.render("about" , {textAbout: aboutContent});
// // });
// // app.get("/contact", function ( req , res){
// //   res.render("contact" , {textContact: contactContent});
// // });
// // app.get("/posts/:titlePost", function ( req , res){
// //   res.render("post" , {postsinf: posts, titlePost : req.params.titlePost});
// // });
// // app.get("/compose", function ( req , res){
// //   res.render("compose");
// // });
// // const URL ="https://fakestoreapi.com/products/";
// //
// // for(let i=1;i<=20;i++){
// //   https.get( URL + i, function(response){
// //     response.on('data', (data) => {
// //       try {
// //         posts.push( JSON.parse(data) );
// //       } catch (error) {
// //           return null;
// //       }
// //     });
// //   });
// // }


app.listen(5000, function() {
  console.log("Server started on port 5000");
});
