const express = require('express');
const router = express.Router();
const { Pilot } = require('../models');
const syncPilots = require('../services/pilotSyncService');

router.get('/', async (req, res) => {
  try {
    const pilots = await Pilot.findAll({
      order: [['id', 'ASC']]
    });
    res.json(pilots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pilot = await Pilot.findByPk(req.params.id);

    if (!pilot) {
      return res.status(404).json({ message: 'Pilóta nem található' });
    }

    res.json(pilot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const result = await syncPilots();
    res.json({
      message: 'Pilóta szinkron sikeres',
      ...result
    });
  } catch (err) {
    res.status(500).json({
      error: 'Hiba történt a szinkron során',
      details: err.message
    });
  }
});

module.exports = router;