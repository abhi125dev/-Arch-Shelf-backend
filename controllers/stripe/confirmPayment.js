const createError = require("http-errors");
const { secretKey } = require("../../config/keys").stripe;
const stripe = require("stripe")(secretKey);

const Transaction = require("../../models/Transaction.model");

const confirmPayment = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    //extract payment type from the client request
    const paymentType = String(req.body.payment_type);

    //handle confirmed stripe transaction
    if (paymentType === "stripe") {
      //get payment id for stripe
      const clientid = String(req.body.payment_id);

      //get the transaction based on the provided id
      stripe.paymentIntents.retrieve(
        clientid,
        async function (err, paymentIntent) {
          //handle errors
          if (err) {
            console.log(err);
          }

          //respond to the client that the server confirmed the transaction
          if (paymentIntent.status === "succeeded") {
            const transaction = new Transaction({
              user: userId,
              token: clientid,
            });

            await transaction.save();

            res.json({ success: true, clientId: clientid });
          } else {
            res.json({ success: false });
          }
        }
      );
    }
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = confirmPayment;
