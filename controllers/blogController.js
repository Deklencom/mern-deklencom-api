//Connect to database / Action database
const slugify = require("slugify");
const Blogs = require("../models/blogs");
const { v4: uuidv4 } = require("uuid");
//Insert data
exports.create = (req, res) => {
  const { title, content, author } = req.body;
  let slug = slugify(title);

  //validate
  if (!slug) slug = uuidv4();

  switch (true) {
    case !title:
      return res.status(400).json({ error: "Please insert name" });
      break;
    case !content:
      return res.status(400).json({ error: "Please insert results" });
      break;
  }
  // res.json({
  //     data:{title,content,author,slug}
  // })

  // Insert DB
  // Blogs.create({title,content,author,slug},(err,blog)=>{
  //     if(err){
  //         res.status(400).json({error:err})
  //     }
  //     res.json(blog)
  // })

  Blogs.create({ title, content, author, slug })
    .then((blog) => res.json(blog))
    .catch((err) => res.status(400).json({ error: "Duplicate Data" }));
};
// ================================================

// Get all blogs
// exports.getAllblogs = (req, res) => {
//     Blogs.find({})
//         .then(blogs => res.json(blogs))
//         .catch(err => res.status(400).json({ error: err.message }));
// };

exports.getAllblogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({});
    res.json(blogs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// ================================================

// Get sigle blog by slug
// exports.singleBlog = (req, res) => {
//     const { slug } = req.params; // Fixed typo
//     Blogs.findOne({ slug })
//         .then(blog => res.json(blog))
//         .catch(err => res.status(400).json({ error: err.message }));
// };

exports.singleBlog = async (req, res) => {
  try {
    const { slug } = req.params; // Fixed typo
    const blog = await Blogs.findOne({ slug });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// ================================================

// Delete
// exports.remove = (req, res) => {
//     const { slug } = req.params;
//     Blogs.findOneAndDelete({ slug }) // Changed method name
//       .then(blog => {
//         if (!blog) {
//           return res.status(404).json({ error: "Blog not found" });
//         }
//         res.json({ message: "Delete success" });
//       })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//       });
//   };

exports.remove = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blogs.findOneAndDelete({ slug }); // Updated method name
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Delete success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// ================================================

// Update
// exports.update = (req, res) => {
//   const { slug } = req.params;
//   const { title, content, author } = req.body;

//   Blogs.findOneAndUpdate({ slug }, { title, content, author }, { new: true })
//     .then(updatedBlog => {
//       if (!updatedBlog) {
//         return res.status(404).json({ error: "Blog not found" });
//       }
//       res.json(updatedBlog);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: "Server error" });
//     });
// };

exports.update = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, author } = req.body;
    
    const updatedBlog = await Blogs.findOneAndUpdate(
      { slug },
      { title, content, author },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// ================================================