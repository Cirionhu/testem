import { useEffect, useState } from 'react';
import axios from 'axios';

function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get('http://localhost:5000/api/pilots');
      setPilots(res.data);
    } catch (err) {
      console.error(err);
      setError('Nem sikerült betölteni a pilótákat.');
    } finally {
      setLoading(false);
    }
  };

  // 👉 születési év kiszedése
  const getBirthYear = (date) => {
    if (!date) return '-';
    return date.split('-')[0];
  };

  return (
    <div className="page-container">
      <h1>Pilóták</h1>
      <p>Az adatbázis API-ból szinkronizált pilótákat jelenít meg.</p>

      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Teljes név</th>
                <th>Nemzetiség</th>
                <th>Születési év</th>
                <th>Státusz</th>
                <th>Részletek</th>
              </tr>
            </thead>
            <tbody>
              {pilots.length > 0 ? (
                pilots.map((pilot) => (
                  <tr key={pilot.id}>
                    <td>{pilot.full_name}</td>
                    <td>{pilot.nationality || '-'}</td>
                    <td>{getBirthYear(pilot.date_of_birth)}</td>
                    <td>{pilot.is_active ? 'Aktív' : 'Nem aktív'}</td>
                    <td>
                      {pilot.wiki_url ? (
                        <a
                          href={pilot.wiki_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button small"
                        >
                          Bővebben
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nincs megjeleníthető pilóta.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Pilots;