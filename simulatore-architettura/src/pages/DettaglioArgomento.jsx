import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getArgomentoById } from '../data/argomenti';
import DomandaVeroFalso from '../components/DomandaVeroFalso';
import { updateArgomentoProgress, getArgomentoStats } from '../utils/progressManager';
import '../styles/DettaglioArgomento.css';

function DettaglioArgomento() {
  const { id } = useParams();
  const argomento = getArgomentoById(id);
  const [stats, setStats] = useState(null);
  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [risultati, setRisultati] = useState([]);
  const [quizTerminato, setQuizTerminato] = useState(false);

  useEffect(() => {
    if (id) setStats(getArgomentoStats(id));
  }, [id]);

  const handleRisposta = (corretta) => {
    updateArgomentoProgress(id, corretta);
    setStats(getArgomentoStats(id));
    setRisultati(prev => [...prev, corretta]);
  };

  const handleProssima = () => {
    if (indiceDomanda < argomento.domande.length - 1) {
      setIndiceDomanda(i => i + 1);
    } else {
      setQuizTerminato(true);
    }
  };

  const handleRiavvia = () => {
    setIndiceDomanda(0);
    setRisultati([]);
    setQuizTerminato(false);
  };

  if (!argomento) {
    return (
      <div className="errore-container">
        <h2>Argomento non trovato</h2>
        <Link to="/argomenti">Torna agli argomenti</Link>
      </div>
    );
  }

  const corrette = risultati.filter(r => r).length;
  const percentuale = risultati.length > 0
    ? Math.round((corrette / risultati.length) * 100)
    : 0;

  return (
    <div className="dettaglio-argomento-container">
      <Link to="/argomenti" className="back-link">← Torna agli argomenti</Link>

      <header className="argomento-header">
        <h1>{argomento.icona} {argomento.titolo}</h1>
        <p>{argomento.descrizione}</p>
        {stats && stats.domandeRisposte > 0 && (
          <div className="stats-badge">
            <span>Accuratezza: {Math.round((stats.domandeCorrette / stats.domandeRisposte) * 100)}%</span>
            <span>Domande risposte: {stats.domandeRisposte}</span>
          </div>
        )}
      </header>

      <div className="sezione">
        <h2>Domande Vero/Falso</h2>

        {quizTerminato ? (
          <div className="quiz-risultati">
            <div className="quiz-risultati-score">
              {percentuale >= 60 ? '🎉' : '📖'}
            </div>
            <h3>Quiz completato!</h3>
            <p className="quiz-score">{corrette} / {argomento.domande.length} corrette</p>
            <p className={`quiz-percentuale ${percentuale >= 60 ? 'positivo' : 'negativo'}`}>
              {percentuale}%
            </p>
            <p className="quiz-esito">
              {percentuale >= 60 ? 'Ottimo lavoro! Continua così.' : 'Riprova, puoi migliorare!'}
            </p>
            <button className="riavvia-btn" onClick={handleRiavvia}>
              Ricomincia quiz
            </button>
          </div>
        ) : argomento.domande && argomento.domande.length > 0 ? (
          <div className="quiz-wrapper">
            <div className="quiz-nav">
              <span className="quiz-contatore">
                {indiceDomanda + 1} / {argomento.domande.length}
              </span>
              <div className="quiz-barra">
                <div
                  className="quiz-barra-fill"
                  style={{ width: `${((indiceDomanda + 1) / argomento.domande.length) * 100}%` }}
                />
              </div>
            </div>
            <DomandaVeroFalso
              key={indiceDomanda}
              domanda={argomento.domande[indiceDomanda].domanda}
              risposta={argomento.domande[indiceDomanda].risposta}
              spiegazione={argomento.domande[indiceDomanda].spiegazione}
              onRisposta={handleRisposta}
              onNext={handleProssima}
              isUltima={indiceDomanda === argomento.domande.length - 1}
            />
          </div>
        ) : (
          <p className="vuoto">Nessuna domanda disponibile per questo argomento.</p>
        )}
      </div>
    </div>
  );
}

export default DettaglioArgomento;
