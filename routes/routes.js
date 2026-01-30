import express from 'express';
import { Character } from '../models/Character.js';

export const router = express.Router();

// TODO A1: Move types and traits to global variables
const TYPES = ['fighter', 'ninja turtle', 'egg', 'waterfowl'];
const TRAITS = ['toasted', 'scrambled', 'awesome', 'blue'];
const WEAPONS = ['sword','ak47','toaster','potted plant', 'banana'];

// TODO A2: Add this helper to safely use user input in a regex search.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// TODO A3: Add this helper to translate a sort dropdown value into a Mongo sort object.
function buildSort(sortKey) {
  switch (sortKey) {
    case 'name_asc': return { name: 1 };
    case 'name_desc': return { name: -1 };
    case 'type_asc': return { type: 1, name: 1 };
    case 'trait_asc': return { trait: 1, name: 1  };
    case 'oldest': return { createdAt: 1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

// Home page: form + table
router.get('/', async (req, res, next) => {
  try {
    // TODO A4: Read query params with defaults
    const q = ( req.query.q || '').trim();
    const type = ( req.query.type || '').trim();
    const trait = ( req.query.trait || '').trim();
    const sort = ( req.query.sort|| 'newest').trim();

    // TODO A5: Build Mongo filter based on q/type/trait
    const filter = {};
    if (q) filter.name = { $regex: escapeRegex(q), $options: 'i' };
    if (TYPES.includes(type)) filter.type = type;
    if (TRAITS.includes(trait)) filter.trait = trait;

    // TODO A6: Query Mongo using filter + sort
    const characters = await Character.find(filter).sort(buildSort(sort));

    // TODO A7: Add aggregation counts that respect the SAME filter
    const byType = await Character.aggregate([
      { $match: filter },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const byTrait = await Character.aggregate([
      { $match: filter },
      { $group: { _id: '$trait', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const commonTypeAgg = await Character.aggregate([
      { $match: filter },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // most common first
      { $limit: 1 }
    ]);

    const commonType = commonTypeAgg.length > 0 ? commonTypeAgg[0]._id : 'none';

    const commonTraitAgg = await Character.aggregate([
      { $match: filter },
      { $group: { _id: '$trait', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // most common first
      { $limit: 1 }
    ]);

    const commonTrait = commonTraitAgg.length > 0 ? commonTraitAgg[0]._id : 'none';

    // TODO A8: Pass query + summary to the template
    res.render('index', {
      characters,
      title:"Characeter Cereator",
      types: TYPES,
      traits: TRAITS,
      query: {q, type, trait, sort},
      summary: {
        total:characters.length,
        byType,
        byTrait,
        commonType,
        commonTrait
      }
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
router.get('/characters/:id/edit', async (req,res,next) => {
  try {
    const character = await Character.findById(req.params.id);

    if(!character) {
      res.status(404).send('Character not found');
    }

    res.render('edit', {
      title: character.name,
      character,
      types: TYPES,
      traits: TRAITS
    })

  } catch (err) {
    next(err)
  }

})

// TODO A10: POST update (save edits)
router.post('/characters/:id', async (req, res,next) =>{
  try {
    const {name, type, trait} = req.body;

    const updated = await Character.findByIdAndUpdate(
      req.params.id,
      {name, type, trait},
      {new: true, runValidators: true}
    );

    if (!updated) return res.status(404).send("Character not upadted");

    res.redirect(`/characters/${updated._id}`);
  } catch (err) {
    next(err);
  }
})

// TODO A11: POST delete
router.post('/characters/:id/delete', async (req,res,next) => {
  try {
    await Character.findByIdAndDelete(req.params.id);

    res.redirect('/');

  } catch (err) {
    next(err)
  }

})
