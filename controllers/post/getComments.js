const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

// import post model
const PostComment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const convertParams = require("../../helpers/convertParams");

const getComments = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const { query } = req;
    // const decodedtoken = decodetoken(req);
    // const userId = decodedtoken.data._id;
    const filters = await convertParams(PostComment, query);
    const startIndex = (query._start && parseInt(query._start)) || 0;
    const viewSize = (query._limit && parseInt(query._limit)) || 10;
    const searchCriteria = filters.where;
    if (query.isVerified && query.isVerified === "false") {
      searchCriteria.isVerified = false;
    }
    if (query.isVerified && query.isVerified === "true") {
      searchCriteria.isVerified = true;
    }
    searchCriteria.post_id = req.params.id;

    const allComments = await PostComment.aggregate([
      { $match: { post_id: ObjectId(req.params.id) } },
      { $skip: startIndex },
      { $limit: parseInt(viewSize) },
      { $sort: { created_at: -1 } },
    ]);
    const comments = await PostComment.populate(allComments, "user");
    const count = await PostComment.countDocuments({
      post_id: ObjectId(req.params.id),
    });
    const filteredData = comments.map((item) => {
      return {
        _id: item?._id,
        post_id: item?.post_id,
        user: {
          _id: item?.user?._id,
          name: item?.user?.name,
          user_handle: item?.user?.user_handle,
          avatar_url: item?.user?.avatar_url,
        },
        comment: item?.comment,
        created_at: item?.created_at,
        updated_at: item?.updated_at,
      };
    });
    res.json({
      message: "success",
      data: {
        comments: filteredData,
        count: comments?.length,
        total_count: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getComments;
