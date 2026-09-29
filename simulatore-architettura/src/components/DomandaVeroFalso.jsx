import { useState } from 'react';
import '../styles/Domanda.css';

function DomandaVeroFalso({ domanda, risposta, spiegazione, onRisposta, onNext, isUltima }) {
  const [selezionata, setSelezionata] = useState(null);
  const [mostraRisposta, setMostraRisposta] = useState(false);

  const handleRisposta = (valore) => {
    if (mostraRisposta) return;
    setSelezionata(valore);
    setMostraRisposta(true);
    if (onRisposta) {
      onRisposta(valore === risposta);
    }
  };

  const corretta = selezionata === risposta;

  return (
    <div className="domanda-container">
      <h3 className="domanda-testo">{domanda}</h3>
      <div className="opzioni-container">
        <button
          className={`opzione-btn ${selezionata === true ? 'selezionata' : ''} ${
            mostraRisposta ? (risposta === true ? 'corretta' : selezionata === true ? 'errata' : '') : ''
          }`}
          onClick={() => handleRisposta(true)}
          disabled={mostraRisposta}
        >
          Vero
        </button>
        <button
          className={`opzione-btn ${selezionata === false ? 'selezionata' : ''} ${
            mostraRisposta ? (risposta === false ? 'corretta' : selezionata === false ? 'errata' : '') : ''
          }`}
          onClick={() => handleRisposta(false)}
          disabled={mostraRisposta}
        >
          Falso
        </button>
      </div>
      {mostraRisposta && (
        <div className="feedback-area">
          <div className={`feedback ${corretta ? 'corretto' : 'sbagliato'}`}>
            {corretta ? '✓ Corretto!' : `✗ Sbagliato! La risposta corretta è: ${risposta ? 'Vero' : 'Falso'}`}
          </div>
          {spiegazione && (
            <div className="spiegazione">
              <strong>Spiegazione:</strong> {spiegazione}
            </div>
          )}
          {onNext && (
            <button className="prossima-btn" onClick={onNext}>
              {isUltima ? 'Vedi risultati →' : 'Prossima domanda →'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DomandaVeroFalso;
