import { useState } from 'react';
import '../styles/CalcolatoreALU.css';

const ALU_OPS = [
  { codice: '0000', nome: 'AND',  simbolo: 'A AND B' },
  { codice: '0001', nome: 'OR',   simbolo: 'A OR B' },
  { codice: '0010', nome: 'ADD',  simbolo: 'A + B' },
  { codice: '0110', nome: 'SUB',  simbolo: 'A - B' },
  { codice: '0111', nome: 'SLT',  simbolo: 'A < B ? 1 : 0' },
  { codice: '1100', nome: 'NOR',  simbolo: 'NOT (A OR B)' },
];

const ESEMPI = [
  { label: 'Esame: SLT 0010 vs 1000', a: '0010', b: '1000', op: '0111' },
  { label: 'ADD: 3 + 5 (4 bit)', a: '0011', b: '0101', op: '0010' },
  { label: 'SUB con overflow: 7 - (-1)', a: '0111', b: '1111', op: '0110' },
  { label: 'SLT: -1 < 1?', a: '1111', b: '0001', op: '0111' },
  { label: 'AND: 1010 & 1100', a: '1010', b: '1100', op: '0000' },
];

function toBin4(n) {
  return ((n & 0xf) >>> 0).toString(2).padStart(4, '0');
}

function toSigned4(bits) {
  const n = parseInt(bits, 2);
  return n >= 8 ? n - 16 : n;
}

function computeALU(aBits, bBits, opCode) {
  const a = toSigned4(aBits);
  const b = toSigned4(bBits);
  const aU = parseInt(aBits, 2);
  const bU = parseInt(bBits, 2);

  let result4 = null;
  let overflow = false;
  let description = '';

  switch (opCode) {
    case '0000': {
      result4 = aU & bU;
      description = `${aBits} AND ${bBits}`;
      break;
    }
    case '0001': {
      result4 = aU | bU;
      description = `${aBits} OR ${bBits}`;
      break;
    }
    case '0010': {
      const raw = a + b;
      result4 = raw & 0xf;
      overflow = (a >= 0 && b >= 0 && toSigned4(toBin4(raw)) < 0) ||
                 (a < 0  && b < 0  && toSigned4(toBin4(raw)) >= 0);
      description = `${a} + ${b} = ${raw}`;
      break;
    }
    case '0110': {
      const raw = a - b;
      result4 = raw & 0xf;
      overflow = (a >= 0 && b < 0  && toSigned4(toBin4(raw)) < 0) ||
                 (a < 0  && b >= 0 && toSigned4(toBin4(raw)) >= 0);
      description = `${a} - (${b}) = ${raw}`;
      break;
    }
    case '0111': {
      const diff = a - b;
      const signBit = ((diff & 0xf) >> 3) & 1;
      overflow = (a >= 0 && b < 0  && toSigned4(toBin4(diff & 0xf)) < 0) ||
                 (a < 0  && b >= 0 && toSigned4(toBin4(diff & 0xf)) >= 0);
      const sltResult = signBit ^ (overflow ? 1 : 0);
      result4 = sltResult;
      description = `SLT: ${a} < ${b}? → ${a} - (${b}) = ${diff}. sign=${signBit}, overflow=${overflow ? 1 : 0}, SLT=${sltResult}`;
      break;
    }
    case '1100': {
      result4 = (~(aU | bU)) & 0xf;
      description = `NOT(${aBits} OR ${bBits})`;
      break;
    }
    default:
      return null;
  }

  const resultBits = toBin4(result4);
  const zero = result4 === 0;
  const signedResult = toSigned4(resultBits);

  return { resultBits, result4, zero, overflow, signedResult, description };
}

function validateBits(s) {
  return /^[01]{0,4}$/.test(s);
}

export default function CalcolatoreALU() {
  const [a, setA] = useState('0010');
  const [b, setB] = useState('1000');
  const [op, setOp] = useState('0111');
  const [shown, setShown] = useState(false);

  const aValid = /^[01]{4}$/.test(a);
  const bValid = /^[01]{4}$/.test(b);
  const result = aValid && bValid ? computeALU(a, b, op) : null;

  function caricaEsempio(es) {
    setA(es.a);
    setB(es.b);
    setOp(es.op);
    setShown(false);
  }

  const opInfo = ALU_OPS.find(o => o.codice === op);

  return (
    <div className="alu-container">
      <h1>Calcolatrice ALU</h1>
      <p className="alu-sottotitolo">
        Simula le operazioni dell'ALU a 4 bit con segno (complemento a 2). Inserisci i valori binari e scegli l'operazione.
      </p>

      <div className="esempi-rapidi">
        <span className="esempi-label">Esempi:</span>
        {ESEMPI.map((es, i) => (
          <button key={i} className="esempio-btn" onClick={() => caricaEsempio(es)}>
            {es.label}
          </button>
        ))}
      </div>

      <div className="alu-card">
        <div className="alu-inputs">
          <div className="alu-input-group">
            <label>a (4 bit binario)</label>
            <input
              className={`alu-input ${aValid ? 'valid' : 'invalid'}`}
              value={a}
              maxLength={4}
              onChange={e => { if (validateBits(e.target.value)) { setA(e.target.value); setShown(false); } }}
              placeholder="es. 0010"
            />
            {aValid && <span className="alu-decimal">= {toSigned4(a)} (decimale con segno)</span>}
          </div>

          <div className="alu-op-group">
            <label>ALU_operation</label>
            <select className="alu-select" value={op} onChange={e => { setOp(e.target.value); setShown(false); }}>
              {ALU_OPS.map(o => (
                <option key={o.codice} value={o.codice}>{o.codice} — {o.nome} ({o.simbolo})</option>
              ))}
            </select>
          </div>

          <div className="alu-input-group">
            <label>b (4 bit binario)</label>
            <input
              className={`alu-input ${bValid ? 'valid' : 'invalid'}`}
              value={b}
              maxLength={4}
              onChange={e => { if (validateBits(e.target.value)) { setB(e.target.value); setShown(false); } }}
              placeholder="es. 1000"
            />
            {bValid && <span className="alu-decimal">= {toSigned4(b)} (decimale con segno)</span>}
          </div>
        </div>

        <button
          className="calcola-btn"
          disabled={!aValid || !bValid}
          onClick={() => setShown(true)}
        >
          Calcola
        </button>

        {shown && result && (
          <div className="alu-result">
            <h3>Risultato</h3>
            <div className="result-grid">
              <div className="result-box">
                <span className="result-label">Result</span>
                <span className="result-value">{result.resultBits}</span>
                <span className="result-sub">{result.signedResult} (con segno)</span>
              </div>
              <div className={`result-box flag ${result.zero ? 'flag-on' : 'flag-off'}`}>
                <span className="result-label">Zero</span>
                <span className="result-value">{result.zero ? '1' : '0'}</span>
                <span className="result-sub">{result.zero ? 'Result = 0' : 'Result ≠ 0'}</span>
              </div>
              <div className={`result-box flag ${result.overflow ? 'flag-on' : 'flag-off'}`}>
                <span className="result-label">Overflow</span>
                <span className="result-value">{result.overflow ? '1' : '0'}</span>
                <span className="result-sub">{result.overflow ? 'Fuori range!' : 'Nessun overflow'}</span>
              </div>
            </div>

            <div className="result-spiegazione">
              <strong>Calcolo:</strong> {result.description}
            </div>

            {op === '0111' && (
              <div className="result-nota">
                <strong>SLT:</strong> result = sign_bit XOR overflow. Il valore 1 significa che a &lt; b, il valore 0 significa a ≥ b.
                {result.overflow && <span> Con overflow il segno del risultato grezzo è invertito — il XOR corregge.</span>}
              </div>
            )}

            {result.overflow && op !== '0111' && (
              <div className="result-nota overflow-nota">
                <strong>Overflow!</strong> Il risultato esatto ({result.description.split('= ').pop()}) non è rappresentabile in 4 bit con segno (range -8..+7).
              </div>
            )}
          </div>
        )}
      </div>

      <div className="alu-reference">
        <h3>Tabella operazioni ALU</h3>
        <table className="alu-table">
          <thead>
            <tr><th>ALU_operation</th><th>Operazione</th><th>Descrizione</th></tr>
          </thead>
          <tbody>
            {ALU_OPS.map(o => (
              <tr key={o.codice} className={o.codice === op ? 'row-selected' : ''}>
                <td><code>{o.codice}</code></td>
                <td><strong>{o.nome}</strong></td>
                <td>{o.simbolo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="range-reference">
        <h3>Range valori con segno (complemento a 2)</h3>
        <div className="range-grid">
          {[4, 8, 16, 32].map(n => (
            <div key={n} className="range-box">
              <span className="range-n">{n} bit</span>
              <span className="range-val">da -{Math.pow(2, n-1)} a {Math.pow(2, n-1)-1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
