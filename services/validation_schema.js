const Joi = require("joi");

const registerValidation = Joi.object({
  email: Joi.string().trim().email().lowercase(),
  phone: Joi.string()
    .trim()
    .regex(/^[0-9]{7,10}$/),
  name: Joi.string().min(3).max(255).required(),
  password: Joi.string().alphanum().min(2).required(),
  role: Joi.string().valid("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_EMPLOYEE"),
  website: Joi.string().alphanum().min(2),
  bio: Joi.string().min(2).max(1000),
  gender: Joi.string().valid("male", "female", "others"),
});

const updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(255),
  userHandle: Joi.string().min(3).max(30).required(),
  website: Joi.string().uri(),
  bio: Joi.string().min(2).max(1000),
  gender: Joi.string().valid("male", "female", "others"),
});

const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().alphanum().min(2).required(),
});

const emailValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const passwordValidation = Joi.object({
  password: Joi.string().alphanum().min(2).required(),
});

const createPostValidation = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  type: Joi.string().valid("open", "subscription", "premium").required(),
});

const feedValidation = Joi.object({
  title: Joi.string().required(),
  type: Joi.string().valid(
    "resources",
    "products",
    "projects",
    "courses",
    "initiatives",
    "breakfasts"
  ),
  body: Joi.string().required(),
  shortDescription: Joi.string(),
  category: Joi.string(),
  architects: Joi.string(),
  manufacturers: Joi.string(),
  country: Joi.string(),
  area: Joi.number(),
  clients: Joi.string(),
  leadArchitects: Joi.string(),
  photographs: Joi.string(),
  year: Joi.string(),
  url: Joi.string(),
  startDay: Joi.date(),
  submissionDate: Joi.date(),
  materials: Joi.string(),
  organizer: Joi.string(),
  price: Joi.number(),
  status: Joi.string(),
});

const testimonialValidation = Joi.object({
  name: Joi.string().required(),
  testimonial: Joi.string(),
});

const postRatingValidation = Joi.object({
  rating: Joi.number().greater(0).less(6).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  postRatingValidation,
  updateUserValidation,
  createPostValidation,
  feedValidation,
  testimonialValidation,
};
