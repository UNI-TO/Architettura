import { useState } from 'react';
import '../styles/Domanda.css';

function DomandaMultipla({ domanda, opzioni, risposta, spiegazione, onRisposta, onNext, isUltima }) {
  const [selezionata, setSelezionata] = useState(null);
  const [mostrata, setMostrata] = useState(false);

  const handleRisposta = (idx) => {
    if (mostrata) return;
    setSelezionata(idx);
    setMostrata(true);
    if (onRisposta) onRisposta(idx === risposta);
  };

  return (
    <div className="domanda-container">
      <h3 className="domanda-testo">{domanda}</h3>
      <div className="opzioni-multipla">
        {opzioni.map((op, idx) => {
          let cls = 'opzione-multipla-btn';
          if (mostrata) {
            if (idx === risposta) cls += ' corretta';
            else if (idx === selezionata) cls += ' errata';
          } else if (idx === selezionata) {
            cls += ' selezionata';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleRisposta(idx)} disabled={mostrata}>
              <span className="opzione-lettera">{String.fromCharCode(65 + idx)}.</span> {op}
            </button>
          );
        })}
      </div>
      {mostrata && (
        <div className="feedback-area">
          <div className={`feedback ${selezionata === risposta ? 'corretto' : 'sbagliato'}`}>
            {selezionata === risposta
              ? '✓ Corretto!'
              : `✗ Sbagliato! Risposta corretta: ${String.fromCharCode(65 + risposta)}. ${opzioni[risposta]}`}
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

export default DomandaMultipla;
