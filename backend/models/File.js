import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  fileType: String,
  fileSize: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);
