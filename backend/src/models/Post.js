import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
