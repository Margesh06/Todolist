const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin-Margesh:margesh@cluster0.dgnbguu.mongodb.net/todolistDB", { useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
});
const item2 = new Item({
  name: "Hit the + button to add a new title"
});
const item3 = new Item({
  name: "<-- hit this to delete item"
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/",function(req, res){

  async function myitems() {
    const items = await Item.find({});
    if (items.length === 0) {
      await Item.insertMany(defaultItem);
      const displayItems = await Item.find({});
      res.render("list", { listTittle: "Today", newlistitems: displayItems });
    } else {
      const displayItems = await Item.find({});
      res.render("list", { listTittle: "Today", newlistitems: displayItems });
    }
  }

myitems();

});


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  async function fl() {
    const foundlist = await List.findOne({ name: customListName }).exec();
    if(foundlist === null){
      const list = new List({
        name: customListName,
        items: defaultItem
      });
      list.save();
      res.redirect("/" + customListName);
    }
    else{
      res.render("list",{ listTittle: foundlist.name, newlistitems: foundlist.items } )
    }
  }
fl();

})
app.post("/",function(req,res){
  const itemName = req.body.newitem;
  const listN = req.body.list;

   const item = new Item({
     name: itemName,
   });

     item.save();
     res.redirect("/");


});

app.post("/delete",function(req,res){
  const checkitemid = req.body.checkbox;
  const listName = req.body.listName;

    async function remitems() {
      const remove = await Item.findByIdAndRemove(checkitemid);
      res.redirect("/");
    }
    remitems();

});

app.listen(3000,function(req,res){
  console.log("Server started on port 3000");
})
