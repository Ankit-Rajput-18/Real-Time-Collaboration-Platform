import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['task_created', 'task_updated', 'task_completed', 'message_sent', 'user_joined', 'file_uploaded', 'workspace_created'],
    required: true 
  },
  description: String,
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', activitySchema);
