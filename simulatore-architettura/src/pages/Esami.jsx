import { Link } from 'react-router-dom';
import { esami } from '../data/esami';
import '../styles/Esami.css';

function Esami() {
  return (
    <div className="esami-container">
      <h1>Esami Simulati</h1>
      <p className="descrizione">Mettiti alla prova con simulazioni d'esame complete</p>

      <div className="esami-lista">
        {esami.map(esame => (
          <div key={esame.id} className="esame-card">
            <h3>{esame.titolo}</h3>
            <p>{esame.descrizione}</p>
            <div className="esame-info">
              <span>⏱️ Durata: {esame.durata} minuti</span>
              <span>📋 Domande: {esame.domande.length}</span>
            </div>
            <Link to={`/esame/${esame.id}`} className="inizia-esame-btn">
              Inizia Esame
            </Link>
          </div>
        ))}
      </div>

      <div className="info-box">
        <h3>ℹ️ Come funzionano gli esami simulati</h3>
        <ul>
          <li>Ogni esame contiene domande vero/falso su tutti gli argomenti</li>
          <li>Le domande vengono presentate una alla volta con timer</li>
          <li>Il punteggio minimo per superare l'esame è 60%</li>
          <li>Al termine riceverai punteggio e tempo impiegato</li>
        </ul>
      </div>
    </div>
  );
}

export default Esami;
