import Post from '../models/Post.js';

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error fetching post' });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const author = req.user.userId;

    const post = new Post({
      content,
      image,
      author
    });

    await post.save();
    await post.populate('author', 'name avatar');

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId, author: req.user.userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not authorized' });
    }

    post.content = content || post.content;
    post.image = image || post.image;
    await post.save();

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error updating post' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOneAndDelete({ _id: postId, author: req.user.userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not authorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    res.json({ message: 'Post liked successfully', likes: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error liking post' });
  }
};

// Unlike post
export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: 'Post not liked' });
    }

    post.likes = post.likes.filter(id => id.toString() !== userId);
    await post.save();

    res.json({ message: 'Post unliked successfully', likes: post.likes.length });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error unliking post' });
  }
};
