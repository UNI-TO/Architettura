import { useParams, Link } from 'react-router-dom';
import { getEsameById } from '../data/esami';
import Esame from '../components/Esame';
import { updateEsameProgress } from '../utils/progressManager';
import '../styles/Esame.css';

function DettaglioEsame() {
  const { id } = useParams();
  const esame = getEsameById(id);

  if (!esame) {
    return (
      <div className="errore-container">
        <h2>Esame non trovato</h2>
        <Link to="/esami">Torna agli esami</Link>
      </div>
    );
  }

  const handleCompletamento = (risposte, tempo) => {
    const corrette = risposte.filter(r => r).length;
    const punteggio = Math.round((corrette / risposte.length) * 100);

    updateEsameProgress(id, {
      punteggio,
      tempo,
      corrette,
      totale: risposte.length,
    });
  };

  return (
    <div className="dettaglio-esame-container">
      <Link to="/esami" className="back-link">← Torna agli esami</Link>
      <Esame
        titolo={esame.titolo}
        domande={esame.domande}
        durata={esame.durata}
        onCompletamento={handleCompletamento}
      />
    </div>
  );
}

export default DettaglioEsame;
