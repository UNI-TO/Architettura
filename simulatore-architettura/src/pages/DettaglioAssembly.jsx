import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEsercizioById } from '../data/assembly';
import DomandaVeroFalso from '../components/DomandaVeroFalso';
import { updateAssemblyProgress, getAssemblyStats } from '../utils/progressManager';
import '../styles/Assembly.css';

function DettaglioAssembly() {
  const { id } = useParams();
  const esercizio = getEsercizioById(id);
  const [stats, setStats] = useState(null);
  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [risultati, setRisultati] = useState([]);
  const [quizTerminato, setQuizTerminato] = useState(false);

  useEffect(() => {
    if (id) setStats(getAssemblyStats(id));
  }, [id]);

  const handleRisposta = (corretta) => {
    updateAssemblyProgress(id, corretta);
    setStats(getAssemblyStats(id));
    setRisultati(prev => [...prev, corretta]);
  };

  const handleProssima = () => {
    if (indiceDomanda < esercizio.domande.length - 1) {
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

  if (!esercizio) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: 50, borderRadius: 15, textAlign: 'center' }}>
        <h2 style={{ color: '#f44336', marginBottom: 20 }}>Esercizio non trovato</h2>
        <Link to="/assembly" style={{ color: '#1e40af' }}>Torna agli esercizi</Link>
      </div>
    );
  }

  const corrette = risultati.filter(r => r).length;
  const percentuale = risultati.length > 0
    ? Math.round((corrette / risultati.length) * 100)
    : 0;

  return (
    <div className="dettaglio-assembly-container">
      <Link to="/assembly" className="back-link">← Torna agli esercizi</Link>

      <div className="assembly-header">
        <div className="assembly-header-top">
          <h1>{esercizio.titolo}</h1>
          <span className={`tipo-badge ${esercizio.tipo}`}>
            {esercizio.tipo === 'foglia' ? '🍃 Foglia' : '🌿 Non-foglia'}
          </span>
        </div>
        <p className="descrizione-header">{esercizio.descrizione}</p>
        {stats && stats.domandeRisposte > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>
              Accuratezza: {Math.round((stats.domandeCorrette / stats.domandeRisposte) * 100)}%
            </span>
            <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>
              Domande risposte: {stats.domandeRisposte}
            </span>
          </div>
        )}
      </div>

      <div className="codice-sezione">
        <h2>Codice Assembly</h2>
        <pre className="codice-assembly">{esercizio.codice}</pre>
      </div>

      <div className="quiz-assembly-sezione">
        <h2>Quiz sul Codice</h2>

        {quizTerminato ? (
          <div className="quiz-assembly-risultati">
            <div className="quiz-assembly-risultati-score">
              {percentuale >= 60 ? '🎉' : '📖'}
            </div>
            <h3>Quiz completato!</h3>
            <p className="quiz-assembly-score">{corrette} / {esercizio.domande.length} corrette</p>
            <p className={`quiz-assembly-percentuale ${percentuale >= 60 ? 'positivo' : 'negativo'}`}>
              {percentuale}%
            </p>
            <p className="quiz-assembly-esito">
              {percentuale >= 60 ? 'Ottimo! Hai capito bene il codice.' : 'Rileggi il codice e riprova!'}
            </p>
            <button className="riavvia-assembly-btn" onClick={handleRiavvia}>
              Ricomincia quiz
            </button>
          </div>
        ) : (
          <div className="quiz-assembly-wrapper">
            <div className="quiz-assembly-nav">
              <span className="quiz-assembly-contatore">
                {indiceDomanda + 1} / {esercizio.domande.length}
              </span>
              <div className="quiz-assembly-barra">
                <div
                  className="quiz-assembly-barra-fill"
                  style={{ width: `${((indiceDomanda + 1) / esercizio.domande.length) * 100}%` }}
                />
              </div>
            </div>
            <DomandaVeroFalso
              key={indiceDomanda}
              domanda={esercizio.domande[indiceDomanda].domanda}
              risposta={esercizio.domande[indiceDomanda].risposta}
              spiegazione={esercizio.domande[indiceDomanda].spiegazione}
              onRisposta={handleRisposta}
              onNext={handleProssima}
              isUltima={indiceDomanda === esercizio.domande.length - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DettaglioAssembly;
