import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Simulatore Esami</h1>
        <p className="sottotitolo">Architettura degli Elaboratori</p>
      </header>

      <div className="menu-principale">
        <Link to="/argomenti" className="menu-card">
          <div className="icona">📚</div>
          <h2>Argomenti</h2>
          <p>Studia per argomento con domande vero/falso</p>
        </Link>

        <Link to="/esami" className="menu-card">
          <div className="icona">📝</div>
          <h2>Esami Simulati</h2>
          <p>Mettiti alla prova con simulazioni d'esame complete</p>
        </Link>

        <Link to="/assembly" className="menu-card">
          <div className="icona">💻</div>
          <h2>Esercizi Assembly</h2>
          <p>Analizza funzioni RISC-V reali con quiz integrato</p>
        </Link>

        <Link to="/alu" className="menu-card">
          <div className="icona">🔢</div>
          <h2>Calcolatrice ALU</h2>
          <p>Simula operazioni ALU a 4 bit: ADD, SUB, SLT, AND, OR con flag Zero e Overflow</p>
        </Link>

        <Link to="/scheda" className="menu-card">
          <div className="icona">📋</div>
          <h2>Scheda RISC-V</h2>
          <p>Tabella registri, istruzioni, formati R/I/S/SB/U e convenzioni di chiamata</p>
        </Link>

        <Link to="/statistiche" className="menu-card">
          <div className="icona">📊</div>
          <h2>Statistiche</h2>
          <p>Monitora i tuoi progressi e risultati</p>
        </Link>
      </div>

      <div className="info-sezione">
        <h3>Come funziona?</h3>
        <ul>
          <li>Scegli un argomento (logica digitale, memoria, ISA RISC-V, ALU, assembler, prestazioni, bus, load/store, Von Neumann, formati istruzioni, cache diretta, unità di controllo, codifica numerica)</li>
          <li>Rispondi alle domande vero/falso con spiegazione immediata dopo ogni risposta</li>
          <li>Analizza codice assembly RISC-V reale tratto dagli esami (to_upper, space_underscore, mystery/swap, find_first_digit, contains, count_even, sum_until, countequal, bothcontain…)</li>
          <li>Usa la Calcolatrice ALU per simulare operazioni con flag Zero e Overflow</li>
          <li>Simula esami completi con timer e punteggio finale (Giugno 2026 T1, T2 — Luglio 2026 — Settembre 2026)</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
