async function insertDataProduct(connectMysql, item, collection){
    connectMysql.query(`INSERT INTO ${collection} \
    VALUES (${item.code},'${item.name}',${item.price},${item.off},'${item.size}','${item.description}',
    '${item.gender}','${item.category}','${item.images}','${item.date}',${item.rating},'${item.colors}',
    ${item.stock},'${item.details}','${item.review}','${item.video}',${parseInt(item.price)*(100-parseInt(item.off))/(100)})`
      , function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
    });
}
// connectMysql.query("INSERT INTO `products` VALUES ("+item.code+",'"+item.name+"',"+item.price+","+item.off+",'"+item.size+"','"+item.description+"','"+item.gender+"','"+item.category+"','"+item.images+"','"+item.date+"',"+item.rating+",'"+item.colors+"',"+item.stock+",'"+item.details+"','"+item.review+"','"+item.video+"',"+item.priceDiscounted+")"
    //   , function (err, result) {
    //   if (err) throw err;
    //   console.log("Result: " + result);
    // });
module.exports = {
    insertDataProduct: insertDataProduct,
};