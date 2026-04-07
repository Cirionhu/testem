const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend működik' });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Siker: kapcsolódva a MariaDB-hez.');
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Adatbázis szinkronizálva.');
    app.listen(PORT, () => {
      console.log(`A szerver fut: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Hiba:', err);
  });