//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

//Account DataBase Creation + Management

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-harsh:oneplus@cluster0.fix4u.mongodb.net/bankDB", { useNewUrlParser: true,  useUnifiedTopology: true});

// var newSender;
// var newReceiver;

var transactionArr = [];

// Creating the Schema - Blueprint
const customerSchema = new mongoose.Schema({

  name: {
  type: String,


  },
  age: {
    type:Number,
    min:18,
  },
  branch: String,
  accountnumber:Number,
  accountbalance:{
    type:Number
  }

});


// Creating the collection with customerSchema

const Bank = mongoose.model("Bank", customerSchema);

// Creating a document in Bank Collection

var customer1 = new Bank ({

name:"Arthur Shelby",
age:35,
branch:"Lancanshire",
accountnumber:1000,
accountbalance:10000

});
var customer2 = new Bank ({

name:"Tommy Shelby",
age:32,
branch:"Lancanshire",
accountnumber:1001,
accountbalance:10000

});
var customer3 = new Bank ({

name:"Grace Burgess",
age:29,
branch:"Lancanshire",
accountnumber:1002,
accountbalance:10000

});

var customer4 = new Bank ({

name:"Sherlock Holmes",
age:38,
branch:"London",
accountnumber:1003,
accountbalance:10000

});

var customer5 = new Bank ({

name:"Mycroft Holmes",
age:44,
branch:"London",
accountnumber:1004,
accountbalance:10000

});

var customer6 = new Bank ({

name:"John Watson",
age:35,
branch:"London",
accountnumber:1005,
accountbalance:10000

});

var customer7 = new Bank ({

name:"Steve Rogers",
age:78,
branch:"Illinois",
accountnumber:1006,
accountbalance:10000

});

var customer8 = new Bank ({

name:"Edward Stark",
age:46,
branch:"Illinois",
accountnumber:1007,
accountbalance:10000

});

var customer9 = new Bank ({

name:"Bruce Banner",
age:48,
branch:"Illinois",
accountnumber:1008,
accountbalance:10000

});




// InsertMany Function with err callback
Bank.find({}, function(err, foundItems){

  if(foundItems.length === 0){


Bank.insertMany([customer1, customer2, customer3, customer4, customer5, customer6, customer7, customer8, customer9], function(err){
  if(err){
    console.log(err);

  }else{
    console.log("Sucessfully entered the Docs in Collection");
  }
});
}
else{
  return;

}
});

// Creating the Schema - BlueprintOfTransactionHistory
const transactionSchema = new mongoose.Schema({

  senderInfo:Number,
  receiverInfo:Number,
  amountTransacted:Number

});









//Main Body Of the Server


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  res.render("home");
});

app.get("/lancanshire", function(req, res){
  res.render("lancanshire");

});

app.get("/london", function(req, res){
  res.render("london");
});

app.get("/chicago", function(req, res){
  res.render("chicago");
});

app.get("/transfer", function(req, res){
  res.render("transfer");
});

app.get("/transact", function(req, res){
  res.render("transact");
});
app.get("/transactiontable", function(req, res){
  res.render("transactiontable",{transactionArr:transactionArr});
});

app.post("/transact", function(req, res){

  var amount = (req.body.amount);
  var sender = (req.body.debitaccount);
  var receiver =(req.body.creditaccount);








  Bank.findOne({accountnumber: sender}, (error, senderData) => {
     var initialamountSender = senderData.accountbalance;
     var newAmount = (parseFloat(initialamountSender) - parseFloat(amount));

     // newSender = (senderData.name).toString();
     Bank.updateOne({accountnumber:sender}, {accountbalance:newAmount}, function(err){
       if(err){
         console.log(err);
       }else{
         console.log("Successfully Debited the Money");
       }
     });

  });

  Bank.findOne({accountnumber: receiver}, (error, receiverData) => {
     var initialamountReceiver = receiverData.accountbalance;
     var newAccountBalance = (parseFloat(initialamountReceiver) + parseFloat(amount));
    // newReceiver = (receiverData.name).toString();

     Bank.updateOne({accountnumber:receiver}, {accountbalance:newAccountBalance}, function(err){
       if(err){
         console.log(err);
       }else{
         console.log("Successfully Credited the Money")
       }
     });



  });



  // Creating the collection with customerSchema

  const Transaction = mongoose.model("Transaction", transactionSchema);


  // Creating a document in Bank Collection
  var transactions= new Transaction({


    senderInfo:sender,
    receiverInfo:receiver,
  amountTransacted:amount,


  });

  transactions.save();

  transactionArr.push(transactions);

  res.render("transactiontable", [{senderT:(transactions.senderInfo), receiverT:(transactions.receiverInfo), amountT:(transactions.amountTransacted)}]);


res.redirect("/transact");




console.log( "Amount - " + (transactions.amountTransacted),"Sender - "+ (transactions.senderInfo), "Reciever - " + (transactions.receiverInfo))




});











app.listen(3000, function(){
  console.log("server is up and running on port 3000");
});
