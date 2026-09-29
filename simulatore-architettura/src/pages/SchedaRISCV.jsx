import '../styles/SchedaRISCV.css';

const registri = [
  { x: 'x0',      abi: 'zero',   uso: 'Costante zero — non modificabile', tipo: 'speciale' },
  { x: 'x1',      abi: 'ra',     uso: 'Return address — indirizzo di ritorno', tipo: 'speciale' },
  { x: 'x2',      abi: 'sp',     uso: 'Stack pointer — punta al top dello stack', tipo: 'speciale' },
  { x: 'x3',      abi: 'gp',     uso: 'Global pointer', tipo: 'speciale' },
  { x: 'x4',      abi: 'tp',     uso: 'Thread pointer', tipo: 'speciale' },
  { x: 'x5–x7',   abi: 't0–t2',  uso: 'Temporanei — caller-saved (non preservati dal chiamato)', tipo: 'temporaneo' },
  { x: 'x8',      abi: 's0/fp',  uso: 'Saved / Frame pointer — callee-saved', tipo: 'saved' },
  { x: 'x9',      abi: 's1',     uso: 'Saved — callee-saved', tipo: 'saved' },
  { x: 'x10–x11', abi: 'a0–a1',  uso: 'Argomenti funzione e valori di ritorno', tipo: 'argomento' },
  { x: 'x12–x17', abi: 'a2–a7',  uso: 'Argomenti funzione', tipo: 'argomento' },
  { x: 'x18–x27', abi: 's2–s11', uso: 'Saved — callee-saved (preservati dal chiamato)', tipo: 'saved' },
  { x: 'x28–x31', abi: 't3–t6',  uso: 'Temporanei — caller-saved', tipo: 'temporaneo' },
];

const istruzioni = [
  { cat: 'Aritmetiche R-type', items: [
    { istr: 'add  rd, rs1, rs2',   desc: 'rd = rs1 + rs2' },
    { istr: 'sub  rd, rs1, rs2',   desc: 'rd = rs1 - rs2' },
    { istr: 'mul  rd, rs1, rs2',   desc: 'rd = rs1 × rs2' },
    { istr: 'and  rd, rs1, rs2',   desc: 'rd = rs1 AND rs2' },
    { istr: 'or   rd, rs1, rs2',   desc: 'rd = rs1 OR rs2' },
    { istr: 'xor  rd, rs1, rs2',   desc: 'rd = rs1 XOR rs2' },
    { istr: 'slt  rd, rs1, rs2',   desc: 'rd = (rs1 < rs2) ? 1 : 0  (con segno)' },
    { istr: 'sll  rd, rs1, rs2',   desc: 'rd = rs1 << rs2' },
    { istr: 'srl  rd, rs1, rs2',   desc: 'rd = rs1 >> rs2  (logico)' },
  ]},
  { cat: 'Aritmetiche I-type (immediato)', items: [
    { istr: 'addi rd, rs1, imm',   desc: 'rd = rs1 + imm  (imm: -2048..+2047)' },
    { istr: 'slli rd, rs1, shamt', desc: 'rd = rs1 << shamt  (×2^shamt)' },
    { istr: 'srli rd, rs1, shamt', desc: 'rd = rs1 >> shamt  (logico)' },
    { istr: 'slti rd, rs1, imm',   desc: 'rd = (rs1 < imm) ? 1 : 0' },
    { istr: 'xori rd, rs1, imm',   desc: 'rd = rs1 XOR imm' },
    { istr: 'ori  rd, rs1, imm',   desc: 'rd = rs1 OR imm' },
    { istr: 'andi rd, rs1, imm',   desc: 'rd = rs1 AND imm' },
    { istr: 'li   rd, imm',        desc: 'rd = imm  (pseudo: addi rd, x0, imm)' },
    { istr: 'mv   rd, rs1',        desc: 'rd = rs1  (pseudo: addi rd, rs1, 0)' },
  ]},
  { cat: 'Load (I-type)', items: [
    { istr: 'lw   rd, imm(rs1)', desc: 'rd = M[rs1+imm][31:0]  — carica 4 byte' },
    { istr: 'lh   rd, imm(rs1)', desc: 'rd = sign_ext(M[rs1+imm][15:0])  — 2 byte con segno' },
    { istr: 'lb   rd, imm(rs1)', desc: 'rd = sign_ext(M[rs1+imm][7:0])   — 1 byte con segno' },
    { istr: 'lhu  rd, imm(rs1)', desc: 'rd = zero_ext(M[rs1+imm][15:0])  — 2 byte senza segno' },
    { istr: 'lbu  rd, imm(rs1)', desc: 'rd = zero_ext(M[rs1+imm][7:0])   — 1 byte senza segno' },
  ]},
  { cat: 'Store (S-type)', items: [
    { istr: 'sw   rs2, imm(rs1)', desc: 'M[rs1+imm] = rs2[31:0]  — salva 4 byte' },
    { istr: 'sh   rs2, imm(rs1)', desc: 'M[rs1+imm] = rs2[15:0]  — salva 2 byte' },
    { istr: 'sb   rs2, imm(rs1)', desc: 'M[rs1+imm] = rs2[7:0]   — salva 1 byte' },
  ]},
  { cat: 'Branch (SB-type)', items: [
    { istr: 'beq  rs1, rs2, label', desc: 'if rs1 == rs2 → salta a label' },
    { istr: 'bne  rs1, rs2, label', desc: 'if rs1 != rs2 → salta a label' },
    { istr: 'blt  rs1, rs2, label', desc: 'if rs1 < rs2  → salta a label  (con segno)' },
    { istr: 'bge  rs1, rs2, label', desc: 'if rs1 >= rs2 → salta a label  (con segno)' },
    { istr: 'bgt  rs1, rs2, label', desc: 'if rs1 > rs2  → salta a label  (pseudo: blt rs2,rs1,label)' },
    { istr: 'ble  rs1, rs2, label', desc: 'if rs1 <= rs2 → salta a label  (pseudo)' },
  ]},
  { cat: 'Salti (UJ/I-type)', items: [
    { istr: 'jal  rd, label',      desc: 'rd = PC+4; PC = label  (call function)' },
    { istr: 'jalr rd, rs1, imm',   desc: 'rd = PC+4; PC = rs1+imm' },
    { istr: 'j    label',          desc: 'PC = label  (pseudo: jal x0, label)' },
    { istr: 'ret',                 desc: 'PC = ra  (pseudo: jalr x0, ra, 0)' },
    { istr: 'jr   rs1',            desc: 'PC = rs1  (pseudo: jalr x0, rs1, 0)' },
  ]},
];

const formati = [
  { nome: 'R-type',  campi: ['funct7 (7)', 'rs2 (5)', 'rs1 (5)', 'funct3 (3)', 'rd (5)', 'opcode (7)'],    uso: 'add, sub, and, or, xor, slt, sll, srl' },
  { nome: 'I-type',  campi: ['immediato[11:0] (12)', 'rs1 (5)', 'funct3 (3)', 'rd (5)', 'opcode (7)'],       uso: 'addi, lw, lbu, jalr' },
  { nome: 'S-type',  campi: ['imm[11:5] (7)', 'rs2 (5)', 'rs1 (5)', 'funct3 (3)', 'imm[4:0] (5)', 'opcode (7)'], uso: 'sw, sh, sb' },
  { nome: 'SB-type', campi: ['imm[12|10:5] (7)', 'rs2 (5)', 'rs1 (5)', 'funct3 (3)', 'imm[4:1|11] (5)', 'opcode (7)'], uso: 'beq, bne, blt, bge' },
  { nome: 'U-type',  campi: ['immediato[31:12] (20)', 'rd (5)', 'opcode (7)'],                               uso: 'lui, auipc' },
  { nome: 'UJ-type', campi: ['imm[20|10:1|11|19:12] (20)', 'rd (5)', 'opcode (7)'],                         uso: 'jal' },
];

export default function SchedaRISCV() {
  return (
    <div className="scheda-container">
      <h1>Scheda RISC-V</h1>
      <p className="scheda-sottotitolo">Riferimento rapido per l'esame — registri, istruzioni, formati</p>

      <section className="scheda-sezione">
        <h2>Registri</h2>
        <table className="scheda-table">
          <thead>
            <tr><th>Registro</th><th>Nome ABI</th><th>Utilizzo</th></tr>
          </thead>
          <tbody>
            {registri.map((r, i) => (
              <tr key={i} className={`reg-${r.tipo}`}>
                <td><code>{r.x}</code></td>
                <td><strong>{r.abi}</strong></td>
                <td>{r.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legenda">
          <span className="legenda-item reg-speciale">Speciali</span>
          <span className="legenda-item reg-temporaneo">Caller-saved (t)</span>
          <span className="legenda-item reg-saved">Callee-saved (s)</span>
          <span className="legenda-item reg-argomento">Argomenti/Ritorno (a)</span>
        </div>
      </section>

      <section className="scheda-sezione">
        <h2>Formati Istruzioni (32 bit)</h2>
        <div className="formati-grid">
          {formati.map((f, i) => (
            <div key={i} className="formato-card">
              <div className="formato-nome">{f.nome}</div>
              <div className="formato-campi">
                {f.campi.map((c, j) => (
                  <span key={j} className="formato-campo">{c}</span>
                ))}
              </div>
              <div className="formato-uso"><em>Usato da:</em> {f.uso}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="scheda-sezione">
        <h2>Istruzioni Principali</h2>
        {istruzioni.map((cat, ci) => (
          <div key={ci} className="istr-categoria">
            <h3>{cat.cat}</h3>
            <table className="scheda-table istr-table">
              <tbody>
                {cat.items.map((it, ii) => (
                  <tr key={ii}>
                    <td><code>{it.istr}</code></td>
                    <td>{it.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="scheda-sezione">
        <h2>Convenzioni di Chiamata</h2>
        <div className="convenzioni-grid">
          <div className="convenzione-box caller">
            <h4>Caller (chiamante) deve:</h4>
            <ul>
              <li>Salvare <code>t0-t6</code>, <code>a0-a7</code> se li usa dopo la chiamata</li>
              <li>Mettere gli argomenti in <code>a0-a7</code></li>
              <li>Usare <code>jal ra, funzione</code></li>
              <li>Leggere il valore di ritorno da <code>a0</code> (e <code>a1</code>)</li>
            </ul>
          </div>
          <div className="convenzione-box callee">
            <h4>Callee (chiamato) deve:</h4>
            <ul>
              <li>Salvare <code>ra</code> se chiama altre funzioni</li>
              <li>Salvare/ripristinare <code>s0-s11</code> se li usa</li>
              <li>Mettere il risultato in <code>a0</code></li>
              <li>Terminare con <code>ret</code></li>
            </ul>
          </div>
          <div className="convenzione-box stack">
            <h4>Stack (grow-down, last-full):</h4>
            <ul>
              <li><code>addi sp, sp, -N</code> → alloca N byte</li>
              <li><code>sw ra, (N-4)(sp)</code> → salva ra</li>
              <li><code>lw ra, (N-4)(sp)</code> → ripristina ra</li>
              <li><code>addi sp, sp, N</code> → dealloca</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="scheda-sezione">
        <h2>Calcolo Indirizzi</h2>
        <div className="formule-grid">
          <div className="formula-box">
            <div className="formula-titolo">Array di int (4 byte)</div>
            <code>addr[i] = base + i*4</code>
            <div className="formula-asm">slli t0, i, 2 → add t0, t0, base → lw rd, 0(t0)</div>
          </div>
          <div className="formula-box">
            <div className="formula-titolo">Array di char (1 byte)</div>
            <code>addr[i] = base + i</code>
            <div className="formula-asm">add t0, i, base → lbu rd, 0(t0)</div>
          </div>
          <div className="formula-box">
            <div className="formula-titolo">Offset branch (PC-relative)</div>
            <code>offset = target - PC</code>
            <div className="formula-asm">0xc = 12 byte = 3 istruzioni avanti</div>
          </div>
          <div className="formula-box">
            <div className="formula-titolo">Cache mappatura diretta</div>
            <code>index = addr mod N_blocchi</code>
            <div className="formula-asm">tag = bit rimanenti. HIT se valid AND tag match</div>
          </div>
        </div>
      </section>
    </div>
  );
}
