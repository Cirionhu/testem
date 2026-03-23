const axios = require('axios');
const { Op } = require('sequelize');
const { Pilot } = require('../models');

async function fetchAllDrivers() {
  const allDrivers = [];
  let offset = 0;
  const limit = 100;
  let total = 0;

  do {
    const url = `https://api.jolpi.ca/ergast/f1/drivers.json?limit=${limit}&offset=${offset}`;
    const response = await axios.get(url);

    const data = response.data?.MRData;
    const drivers = data?.DriverTable?.Drivers || [];

    total = Number(data?.total || 0);
    allDrivers.push(...drivers);
    offset += limit;
  } while (offset < total);

  return allDrivers;
}

async function fetchCurrentDrivers() {
  const response = await axios.get('https://api.jolpi.ca/ergast/f1/current/drivers.json?limit=100');
  return response.data?.MRData?.DriverTable?.Drivers || [];
}

async function syncPilots() {
  const allDrivers = await fetchAllDrivers();
  const currentDrivers = await fetchCurrentDrivers();

  const activeDriverIds = new Set(currentDrivers.map(driver => driver.driverId));
  const syncedIds = [];

  let created = 0;
  let updated = 0;

  for (const driver of allDrivers) {
    const driverId = driver.driverId;
    const fullName = `${driver.givenName} ${driver.familyName}`.trim();

    syncedIds.push(driverId);

    const [pilot, wasCreated] = await Pilot.findOrCreate({
      where: { driver_id: driverId },
      defaults: {
        driver_id: driverId,
        given_name: driver.givenName,
        family_name: driver.familyName,
        full_name: fullName,
        code: driver.code || null,
        permanent_number: driver.permanentNumber || null,
        nationality: driver.nationality || null,
        date_of_birth: driver.dateOfBirth || null,
        wiki_url: driver.url || null,
        is_active: activeDriverIds.has(driverId),
        last_synced_at: new Date()
      }
    });

    if (wasCreated) {
      created++;
    } else {
      await pilot.update({
        given_name: driver.givenName,
        family_name: driver.familyName,
        full_name: fullName,
        code: driver.code || null,
        permanent_number: driver.permanentNumber || null,
        nationality: driver.nationality || null,
        date_of_birth: driver.dateOfBirth || null,
        wiki_url: driver.url || null,
        is_active: activeDriverIds.has(driverId),
        last_synced_at: new Date()
      });
      updated++;
    }
  }

  await Pilot.update(
    {
      is_active: false,
      last_synced_at: new Date()
    },
    {
      where: {
        driver_id: {
          [Op.notIn]: syncedIds
        }
      }
    }
  );

  return {
    totalFromApi: allDrivers.length,
    currentActive: currentDrivers.length,
    created,
    updated
  };
}

module.exports = syncPilots;