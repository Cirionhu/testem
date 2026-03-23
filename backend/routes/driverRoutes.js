const express = require('express');
const { Driver, DriverStanding, Constructor } = require('../models');

const router = express.Router();

// Összes driver
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [['family_name', 'ASC'], ['given_name', 'ASC']],
    });

    res.json(drivers);
  } catch (error) {
    console.error('Hiba a driverek lekérésekor:', error);
    res.status(500).json({ error: 'Nem sikerült lekérni a versenyzőket.' });
  }
});

// Aktuális driver standings
router.get('/standings/drivers', async (req, res) => {
  try {
    const standings = await DriverStanding.findAll({
      include: [
        {
          model: Driver,
          as: 'driver',
        },
        {
          model: Constructor,
          as: 'constructor',
        },
      ],
      order: [['position', 'ASC']],
    });

    res.json(standings);
  } catch (error) {
    console.error('Hiba a driver standings lekérésekor:', error);
    res.status(500).json({ error: 'Nem sikerült lekérni a pilóta tabellát.' });
  }
});

module.exports = router;