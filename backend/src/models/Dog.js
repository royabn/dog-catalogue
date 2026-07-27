import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true, maxlength: 80 },
    subBreeds: {
      type: [{ type: String, maxlength: 80 }],
      default: [],
      validate: {
        validator: (value) => value.length <= 20 && value.join(',').length <= 500,
        message: 'A breed can have at most 20 sub-breeds and 500 total sub-breed characters',
      },
    },
  },
  { timestamps: true, versionKey: false }
);

dogSchema.index({ name: 1 }, { unique: true });
dogSchema.index({ subBreeds: 1 });
dogSchema.index({ name: 'text', subBreeds: 'text' }, { weights: { name: 10, subBreeds: 3 }, name: 'dog_search' });

export const Dog = mongoose.model('Dog', dogSchema);
