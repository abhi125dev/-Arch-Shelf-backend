const createError = require("http-errors");

// import user model
const User = require("../../models/User.model");
const ContactMech = require("../../models/ContactMech.model");
const UserLoginMech = require("../../models/UserLoginMech.model");

const { updateUserValidation } = require("../../services/validation_schema");

const updateUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const result = await updateUserValidation.validateAsync(req.body);
    const newFields = {
      name: result?.name,
      bio: result?.bio,
      user_handle: result?.userHandle,
      website: result?.website,
      gender: result?.gender,
    };
    const response = await User.findOneAndUpdate({ _id: userId }, newFields, {
      new: true,
    })
      .populate("primary_email")
      .populate("primary_phone");
    if (!response)
      throw createError.InternalServerError(
        "User details can not be updated. Please try again."
      );

    const updatedUserHandle = await UserLoginMech.findOneAndUpdate(
      { user: userId },
      { login_mech_value: response.user_handle }
    );
    if (!updatedUserHandle)
      throw createError.InternalServerError(
        "User details can not be updated. Please try again."
      );

    // if(result?.phone) {
    //   let updatedPhone
    //   if(response?.primary_phone) {
    //      updatedPhone = await ContactMech.findOneAndUpdate({user: userId, contact_mech_type: "phone"}, {contact_mech_value: result.phone})
    //   } else {
    //     updatedPhone = await ContactMech.create({user: userId, contact_mech_type: "phone", contact_mech_value: result.phone});
    //   }
    //   response.primary_phone = updatedPhone._id;
    //   await response.save();
    // }

    const userDetails = {
      _id: response._id,
      name: response.name,
      phone: response.primary_phone?.contact_mech_value,
      email: response.primary_email?.contact_mech_value,
      userHandle: response.user_handle,
      website: response.website,
      bio: response.bio,
      gender: response.gender,
      verified: response.verified,
    };

    res.status(200).json({
      message: "success",
      data: userDetails,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = updateUser;
