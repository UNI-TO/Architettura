import { Link } from 'react-router-dom';
import '../styles/CardArgomento.css';

function CardArgomento({ id, titolo, descrizione, icona, numDomande }) {
  return (
    <Link to={`/argomento/${id}`} className="card-link">
      <div className="card-argomento">
        <div className="card-icona">{icona}</div>
        <h3>{titolo}</h3>
        <p className="descrizione">{descrizione}</p>
        <div className="statistiche">
          <span className="stat">📝 {numDomande} domande</span>
        </div>
      </div>
    </Link>
  );
}

export default CardArgomento;
