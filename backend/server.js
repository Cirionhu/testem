const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./models');
const syncPilots = require('./services/pilotSyncService');

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const pilotRoutes = require('./routes/pilotRoutes');

app.use('/api/users', userRoutes);
app.use('/api/pilots', pilotRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false })
  .then(async () => {
    console.log('Siker: Kapcsolódva a MariaDB-hez.');

    try {
      const result = await syncPilots();
      console.log('Kezdő pilot sync kész:', result);
    } catch (err) {
      console.error('Kezdő pilot sync hiba:', err.message);
    }

    cron.schedule('0 2 * * *', async () => {
      try {
        const result = await syncPilots();
        console.log('Napi pilot sync kész:', result);
      } catch (err) {
        console.error('Automatikus pilot sync hiba:', err.message);
      }
    });

    app.listen(PORT, () => {
      console.log(`A szerver fut a http://localhost:${PORT} címen.`);
    });
  })
  .catch(err => {
    console.error('Hiba:', err);
  });