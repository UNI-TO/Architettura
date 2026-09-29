// Gestione del progresso dell'utente con localStorage

const STORAGE_KEY = 'architettura-simulator-progress';

// Struttura dati del progresso
const defaultProgress = {
  argomenti: {},
  esami: {},
  assembly: {},
  statistiche: {
    totaleDomande: 0,
    domandeCorrette: 0,
    totaleEsercizi: 0,
    eserciziCompletati: 0,
  },
  ultimaAttivita: null,
};

export const getProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultProgress };
    return JSON.parse(stored);
  } catch (error) {
    console.error('Errore nel caricamento del progresso:', error);
    return { ...defaultProgress };
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Errore nel salvataggio del progresso:', error);
  }
};

export const updateArgomentoProgress = (argomentoId, rispostaCorretta) => {
  const progress = getProgress();

  if (!progress.argomenti[argomentoId]) {
    progress.argomenti[argomentoId] = {
      domandeRisposte: 0,
      domandeCorrette: 0,
      ultimaVisita: new Date().toISOString(),
    };
  }

  progress.argomenti[argomentoId].domandeRisposte++;
  if (rispostaCorretta) {
    progress.argomenti[argomentoId].domandeCorrette++;
    progress.statistiche.domandeCorrette++;
  }
  progress.statistiche.totaleDomande++;
  progress.argomenti[argomentoId].ultimaVisita = new Date().toISOString();
  progress.ultimaAttivita = new Date().toISOString();

  saveProgress(progress);
  return progress;
};

export const updateEsameProgress = (esameId, risultato) => {
  const progress = getProgress();

  if (!progress.esami[esameId]) {
    progress.esami[esameId] = {
      tentativiFatti: 0,
      migliorPunteggio: 0,
      ultimoTentativo: null,
      tempoMigliore: null,
    };
  }

  progress.esami[esameId].tentativiFatti++;
  progress.esami[esameId].ultimoTentativo = {
    data: new Date().toISOString(),
    punteggio: risultato.punteggio,
    tempo: risultato.tempo,
    risposteCorrette: risultato.corrette,
    totaleDomande: risultato.totale,
  };

  if (risultato.punteggio > progress.esami[esameId].migliorPunteggio) {
    progress.esami[esameId].migliorPunteggio = risultato.punteggio;
  }

  if (!progress.esami[esameId].tempoMigliore || risultato.tempo < progress.esami[esameId].tempoMigliore) {
    progress.esami[esameId].tempoMigliore = risultato.tempo;
  }

  progress.ultimaAttivita = new Date().toISOString();
  saveProgress(progress);
  return progress;
};

export const updateAssemblyProgress = (esercizioId, rispostaCorretta) => {
  const progress = getProgress();

  if (!progress.assembly[esercizioId]) {
    progress.assembly[esercizioId] = {
      domandeRisposte: 0,
      domandeCorrette: 0,
      ultimaVisita: new Date().toISOString(),
    };
  }

  progress.assembly[esercizioId].domandeRisposte++;
  if (rispostaCorretta) {
    progress.assembly[esercizioId].domandeCorrette++;
    progress.statistiche.domandeCorrette++;
  }
  progress.statistiche.totaleDomande++;
  progress.assembly[esercizioId].ultimaVisita = new Date().toISOString();
  progress.ultimaAttivita = new Date().toISOString();

  saveProgress(progress);
  return progress;
};

export const getArgomentoStats = (argomentoId) => {
  const progress = getProgress();
  return progress.argomenti[argomentoId] || {
    domandeRisposte: 0,
    domandeCorrette: 0,
    ultimaVisita: null,
  };
};

export const getEsameStats = (esameId) => {
  const progress = getProgress();
  return progress.esami[esameId] || {
    tentativiFatti: 0,
    migliorPunteggio: 0,
    ultimoTentativo: null,
    tempoMigliore: null,
  };
};

export const getAssemblyStats = (esercizioId) => {
  const progress = getProgress();
  return progress.assembly[esercizioId] || {
    domandeRisposte: 0,
    domandeCorrette: 0,
    ultimaVisita: null,
  };
};

export const getGlobalStats = () => {
  const progress = getProgress();
  return progress.statistiche;
};

export const resetProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultProgress };
};

export const calculateAccuracy = (corrette, totale) => {
  if (totale === 0) return 0;
  return Math.round((corrette / totale) * 100);
};
