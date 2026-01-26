import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    type: {
      type: String,
      required: true,
      enum: ['Druid', 'Elf', 'Wizard', 'Warrior', 'Rogue', 'Cleric', 'Bard']
    },
    trait: {
      type: String,
      required: true,
      enum: ['Strong', 'Fast', 'Wise', 'Brave', 'Sneaky', 'Charming']
    }
  },
  { timestamps: true }
);

export const Character = mongoose.model('Character', characterSchema);
