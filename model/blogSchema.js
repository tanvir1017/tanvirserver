const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  posterInfo: [
    {
      name: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
    },
  ],
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  blogHtml: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  headerThumb: {
    type: String,
    required: false,
  },
  tag: [
    {
      type: String,
      required: true,
    },
  ],
});

// todo : Model define

const blogs = mongoose.model("BLOGS", blogSchema);
module.exports = blogs;
