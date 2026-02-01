import mongoose, { Document, Schema } from 'mongoose';

export interface IClaim extends Document {
  userId: mongoose.Types.ObjectId;
  dealId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user and deal to prevent duplicate claims
ClaimSchema.index({ userId: 1, dealId: 1 }, { unique: true });

export default mongoose.models.Claim || mongoose.model<IClaim>('Claim', ClaimSchema);
