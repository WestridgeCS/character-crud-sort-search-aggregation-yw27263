import express from 'express';
import { Character } from '../models/Character.js';

export const router = express.Router();

// TODO A1: Move types and traits to global variables


// TODO A2: Add this helper to safely use user input in a regex search.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// TODO A3: Add this helper to translate a sort dropdown value into a Mongo sort object.
function buildSort(sortKey) {
  switch (sortKey) {
    case 'name_asc': return {  };
    case 'name_desc': return {  };
    case 'type_asc': return {  };
    case 'trait_asc': return {  };
    case 'oldest': return {  };
    case 'newest':
    default:
      return {  };
  }
}

// Home page: form + table
router.get('/', async (req, res, next) => {
  try {
    // TODO A4: Read query params with defaults
    const q = ( || '').trim();
    const type = ( || '').trim();
    const trait = ( || '').trim();
    const sort = ( || 'newest').trim();

    // TODO A5: Build Mongo filter based on q/type/trait
    const filter = {};
    if (q) filter.name = { $regex: escapeRegex(q), $options: 'i' };
    if () ;
    if () ;

    // TODO A6: Query Mongo using filter + sort
    const characters = await Character.find().sort();

    // TODO A7: Add aggregation counts that respect the SAME filter
    const byType = await Character.aggregate([
      { $match: filter },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const byTrait = await Character.aggregate([
      
    ]);

    // TODO A8: Pass query + summary to the template
    res.render('index', {
      
    });
  } catch (err) {
    next(err);
  }
});

// Create character
router.post('/characters', async (req, res, next) => {
  try {
    const { name, type, trait } = req.body;

    await Character.create({ name, type, trait });

    // After creating, go back to home page (PRG pattern)
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Show character page
router.get('/characters/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      res.status(404).send('Character not found');
      return;
    }

    res.render('character', {
      title: character.name,
      character
    });
  } catch (err) {
    next(err);
  }
});

// TODO A9: GET edit page


// TODO A10: POST update (save edits)


// TODO A11: POST delete

