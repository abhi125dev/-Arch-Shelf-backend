const createError = require("http-errors");
// import post model
const Questions = require("../../models/Question.model");
const convertParams = require("../../helpers/convertParams");

const AddQuestion = async (req, res, next) => {
  try {  
    if(!req.body.name){
      next(createError.Conflict("Name is required."));
    }
    if(!req.body.email){
      next(createError.Conflict("Email is required."));
    }
    if(!req.body.phone){
      next(createError.Conflict("Phone number is required."));
    }
     const question = new Questions({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });
  
    question.save();
    res.json({ message: "success", data: question });
  } catch (error) {
    next(error);
  }
};

module.exports = AddQuestion;
