import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      trim: true,
      maxlength: 40
    },

    // STEP 3: type must be one of these options (dropdown-friendly)
    type: {
      type: String,
      required:true,
      enum: ['fighter', 'ninja turtle', 'egg', 'waterfowl']
    },

    // STEP 4: trait must be one of these options (dropdown-friendly)
    trait: {
      type: String,
      required:true,
      enum:['toasted', 'scrambled', 'awesome', 'blue']
    },

    //weapon
    //weapon: {
      //type: String,
      //required:true,
      //enum:['sword','ak47','toaster','potted plant', 'banana']
    //}
  },
  { timestamps: true }
);

characterSchema.index()
export const Character = mongoose.model('Character', characterSchema);
