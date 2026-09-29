import { Link } from 'react-router-dom';
import { getProgress, getGlobalStats, calculateAccuracy } from '../utils/progressManager';
import { argomenti } from '../data/argomenti';
import { esami } from '../data/esami';
import { esercizi } from '../data/assembly';
import '../styles/Statistiche.css';

function Statistiche() {
  const progress = getProgress();
  const stats = getGlobalStats();
  const accuracyGlobale = calculateAccuracy(stats.domandeCorrette, stats.totaleDomande);

  return (
    <div className="statistiche-container">
      <Link to="/" className="back-link">← Torna alla home</Link>

      <header className="statistiche-header">
        <h1>Le tue Statistiche</h1>
        <p>Monitora i tuoi progressi nello studio dell'Architettura degli Elaboratori</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Accuratezza Globale</h3>
          <div className="stat-value">{accuracyGlobale}%</div>
          <p className="stat-detail">
            {stats.domandeCorrette} corrette su {stats.totaleDomande}
          </p>
        </div>

        <div className="stat-card">
          <h3>Domande Risposte</h3>
          <div className="stat-value">{stats.totaleDomande}</div>
        </div>

        <div className="stat-card">
          <h3>Esami Sostenuti</h3>
          <div className="stat-value">
            {Object.keys(progress.esami).reduce((sum, key) => sum + (progress.esami[key].tentativiFatti || 0), 0)}
          </div>
        </div>

        <div className="stat-card">
          <h3>Ultima Attività</h3>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {progress.ultimaAttivita
              ? new Date(progress.ultimaAttivita).toLocaleDateString('it-IT')
              : '—'}
          </div>
        </div>
      </div>

      <section className="argomenti-progresso">
        <h2>Progressi per Argomento</h2>
        <div className="argomenti-lista">
          {argomenti.map(argomento => {
            const argStats = progress.argomenti[argomento.id] || {
              domandeRisposte: 0,
              domandeCorrette: 0,
            };
            const accuracy = calculateAccuracy(argStats.domandeCorrette, argStats.domandeRisposte);

            return (
              <div key={argomento.id} className="argomento-progresso-card">
                <h3>{argomento.icona} {argomento.titolo}</h3>
                <div className="progresso-dettagli">
                  <div className="progresso-item">
                    <span className="label">Domande risposte:</span>
                    <span className="value">{argStats.domandeRisposte} / {argomento.domande.length}</span>
                  </div>
                  <div className="progresso-item">
                    <span className="label">Accuratezza:</span>
                    <span className="value">{argStats.domandeRisposte > 0 ? `${accuracy}%` : 'N/A'}</span>
                  </div>
                </div>
                <div className="progresso-barra-container">
                  <div
                    className="progresso-barra-fill"
                    style={{
                      width: `${accuracy}%`,
                      backgroundColor: accuracy >= 75 ? '#4caf50' : accuracy >= 50 ? '#ff9800' : '#f44336',
                    }}
                  />
                </div>
                <Link to={`/argomento/${argomento.id}`} className="studia-btn">
                  Studia
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="esami-storico">
        <h2>Storico Esami</h2>
        <div className="esami-lista">
          {esami.map(esame => {
            const esameStats = progress.esami[esame.id] || {
              tentativiFatti: 0,
              migliorPunteggio: 0,
              ultimoTentativo: null,
            };

            return (
              <div key={esame.id} className="esame-storico-card">
                <h3>{esame.titolo}</h3>
                <div className="esame-stats">
                  <div className="stat-row">
                    <span>Tentativi:</span>
                    <strong>{esameStats.tentativiFatti}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Miglior punteggio:</span>
                    <strong>{esameStats.migliorPunteggio}%</strong>
                  </div>
                  {esameStats.ultimoTentativo && (
                    <div className="stat-row">
                      <span>Ultimo tentativo:</span>
                      <strong>
                        {new Date(esameStats.ultimoTentativo.data).toLocaleDateString('it-IT')}
                        {' '}— {esameStats.ultimoTentativo.punteggio}%
                      </strong>
                    </div>
                  )}
                </div>
                <Link to={`/esame/${esame.id}`} className="rifai-esame-btn">
                  {esameStats.tentativiFatti > 0 ? 'Rifai esame' : 'Inizia esame'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="assembly-storico">
        <h2>Progressi Assembly</h2>
        <div className="argomenti-lista">
          {esercizi.map(esercizio => {
            const asmStats = progress.assembly?.[esercizio.id] || {
              domandeRisposte: 0,
              domandeCorrette: 0,
            };
            const accuracy = calculateAccuracy(asmStats.domandeCorrette, asmStats.domandeRisposte);

            return (
              <div key={esercizio.id} className="argomento-progresso-card">
                <h3>
                  <span className={`tipo-badge ${esercizio.tipo}`} style={{ marginRight: 8 }}>
                    {esercizio.tipo === 'foglia' ? '🍃' : '🌿'}
                  </span>
                  {esercizio.titolo}
                </h3>
                <div className="progresso-dettagli">
                  <div className="progresso-item">
                    <span className="label">Domande risposte:</span>
                    <span className="value">{asmStats.domandeRisposte} / {esercizio.domande.length}</span>
                  </div>
                  <div className="progresso-item">
                    <span className="label">Accuratezza:</span>
                    <span className="value">{asmStats.domandeRisposte > 0 ? `${accuracy}%` : 'N/A'}</span>
                  </div>
                </div>
                <div className="progresso-barra-container">
                  <div
                    className="progresso-barra-fill"
                    style={{
                      width: `${accuracy}%`,
                      backgroundColor: accuracy >= 75 ? '#4caf50' : accuracy >= 50 ? '#ff9800' : '#f44336',
                    }}
                  />
                </div>
                <Link to={`/assembly/${esercizio.id}`} className="studia-btn">
                  Esercita
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Statistiche;
