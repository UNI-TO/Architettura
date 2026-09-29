import { Link } from 'react-router-dom';
import { esercizi } from '../data/assembly';
import '../styles/Assembly.css';

function Assembly() {
  return (
    <div className="assembly-container">
      <h1>Esercizi Assembly RISC-V</h1>
      <p className="descrizione">Analizza funzioni assembly reali tratte dagli esami e rispondi alle domande</p>

      <div className="assembly-grid">
        {esercizi.map(esercizio => (
          <div key={esercizio.id} className="assembly-card">
            <div className="assembly-card-info">
              <h3>{esercizio.titolo}</h3>
              <p>{esercizio.descrizione}</p>
            </div>
            <div className="assembly-card-meta">
              <span className={`tipo-badge ${esercizio.tipo}`}>
                {esercizio.tipo === 'foglia' ? '🍃 Foglia' : '🌿 Non-foglia'}
              </span>
              <Link to={`/assembly/${esercizio.id}`} className="apri-btn">
                Apri esercizio →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assembly;
