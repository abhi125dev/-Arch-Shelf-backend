const createError = require("http-errors");
const { secretKey } = require("../../config/keys").stripe;
const stripe = require("stripe")(secretKey);

const generatePayment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    //user sends price along with request
    const userPrice = parseInt(req.body.price) * 100;

    //create a payment intent
    const intent = await stripe.paymentIntents.create({
      //use the specified price
      amount: userPrice,
      currency: "usd",
    });

    //respond with the client secret and id of the new payment intent
    res.json({ client_secret: intent.client_secret, intent_id: intent.id });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = generatePayment;
