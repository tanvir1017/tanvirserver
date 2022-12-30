const express = require("express");
const blogRouter = express.Router();
const Blogs = require("../model/blogSchema");

// todo : find everythings on the blogs collections
blogRouter.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    const blogsTotal = await Blogs.find().countDocuments();
    if (!blogs) {
      return res.status(404).send({
        success: false,
        message: `The data you are searching for is not available or not found. Sorry! for that issue. Please try again after some time`,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: `blogs route run so well`,
        totalBlogs: blogsTotal,
        blogs: blogs,
      });
    }
  } catch (error) {
    res.status(500).send({
      error: true,
      message: `Internal server error and ${error.message}`,
    });
  }
});

// todo : blog a post
blogRouter.post("/post-a-blog", async (req, res) => {
  try {
    const { title, blogHtml, thumbnail, headerThumb, posterInfo, tag, slug } =
      req.body;
    if (!title || !blogHtml || !thumbnail || !posterInfo || !tag || !slug) {
      return res.status(422).send({
        message: "Please full-fill the required field when you post a blog",
      });
    } else {
      const existBlogWithSameTitle = await Blogs.findOne({ title: title });
      const blog = new Blogs({
        title,
        slug,
        blogHtml,
        thumbnail,
        headerThumb,
        posterInfo,
        tag,
      });
      if (existBlogWithSameTitle) {
        return res.status(422).send({
          success: false,
          message: `A post already exist with the title of ${title}
          `,
          blog: existBlogWithSameTitle,
        });
      } else {
        const isBlogPosted = await blog.save();
        if (!isBlogPosted) {
          return res.status(500).send({
            success: false,
            message: `blog didn't posted successfully`,
          });
        } else {
          return res.status(201).send({
            success: true,
            message: `You just posted a blog with with this title ${isBlogPosted.title}`,
            blog: isBlogPosted,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      error: true,
      message: `Internal server error`,
    });
  }
});

// todo : delete a single blog
blogRouter.delete("/delete-a-blog", async (req, res) => {
  try {
    const { id } = req.body;
    const isDeleted = await Blogs.findByIdAndDelete({ _id: id });
    if (!isDeleted) {
      return res.status(500).send({
        success: false,
        message: `Failed to delete the blog with this id: ${id}`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Blog deleted successfully`,
        deletedBlog: isDeleted,
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: `Internal server error`,
    });
  }
});

module.exports = blogRouter;
