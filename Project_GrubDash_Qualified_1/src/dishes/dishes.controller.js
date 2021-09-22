const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


//CREATE
function create(req, res){//create new dish with id, name, description, price and an image link
    const {data: {id, name, description, price, image_url}}= req.body;

    const newId =nextId();
    const newName = req.body.data.name;
    const newDescription = req.body.data.description;
    const newPrice = req.body.data.price;
    const newImageUrl= req.body.data.image_url;

const newDish = {//this is the details for the new dish
    id: newId,
    name: newName,
    description: newDescription,
    price: newPrice,
    image_url: newImageUrl
};
dishes.push(newDish);//push the newly created dish into the database
res.status(201).json({ data: newDish });
}

function dataIdMatchesDishId(req, res, next) {//validates if the id was entered correctly
    const { data: { id } = {} } = req.body;

    const dishId = req.params.dishId;
    if (id !== undefined && id !== null && id !== "" && id !== dishId) {
      next({
        status: 400,
        message: `id ${id} must match dataId provided in parameters`,
      });
    }
     return next();
  };
  
  function dishExists(req, res, next) {// does it exist validation
    const  dishId  = req.params.dishId;
    const foundDish = dishes.filter((dish) => dish.id === dishId);
    if (foundDish.length > 0) {
      res.locals.dish = foundDish;
      next();
    } else {
      next({ status: 404, message: `Dish ${dishId} not found.` });
    }
  }


//READ
 function read(req, res){//if the dishId is found, read the data
     const foundDish =res.locals.dish;
     if(foundDish){
         res.json({ data: foundDish[0] });
     }
 }

//NOW CHECK TO SEE IF ALL DATA IS VALID

 function isNameValid(req, res, next) {//if the name of the found dishID is valid
    const { data: name } = req.body;
    if (
      req.body.data.name === null ||
      req.body.data.name === "" ||
      req.body.data.name === undefined
    ) {
      next({ status: 400, message: "Dish must include a name." });
    }
    next();
  }
  function isDescriptionValid(req, res, next) {//if the description is valid
    const { data: { description } = {} } = req.body;
    if (
        req.body.data.description === null ||
        req.body.data.description === "" ||
        req.body.data.description === undefined
      ) {
        next({ status: 400, message: "Dish must include a description." });
      }
      next();
    }

    function isPriceValid(req, res, next) {// if the price is valid
        const { data: { price } = {} } = req.body;
         if (
              req.body.data.price === null ||
              req.body.data.price === "" ||
              req.body.data.price === undefined
            ) {
              next({ status: 400, message: "Dish must include a price." });
            }
          if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
          return next();
        } else {
          next({
            status: 400,
            message: `The price must be a number greater than 0.`,
          });
        }
      }

      function isImageUrlValid(req, res, next) {//if the image url is valid
        const { data: { image_url } = {} } = req.body;
       if (
          req.body.data.image_url === null ||
          req.body.data.image_url === undefined ||
          req.body.data.image_url === ""
        ) {
          next({ status: 400, message: "Dish must include an image_url." });
        }
        next();
      }

//UPDATE
function update(req, res) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => (dish.id === dishId));
    const { data: { name, description, price, image_url } = {} } = req.body;
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;
    res.json({ data: foundDish });
  };



//LIST 
function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
    list,
    create: [
      isNameValid,
      isDescriptionValid,
      isPriceValid,
      isImageUrlValid, 
      create
    ],
    read: [dishExists, read],
    update: [
      dishExists,  
      dataIdMatchesDishId,
      isNameValid, 
      isDescriptionValid, 
      isPriceValid, 
      isImageUrlValid, 
      update
    ],
    
  };
