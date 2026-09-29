export const esercizi = [
  {
    id: 'to-upper',
    titolo: 'to_upper — Funzione Foglia',
    tipo: 'foglia',
    descrizione: "Converte una stringa in maiuscolo. Riceve l'indirizzo della stringa sorgente in a0 e destinazione in a1.",
    codice: `################################################################################
# Function: to_upper
# Arguments:
#   a0 - address of the source string
#   a1 - address of the destination string
################################################################################
to_upper:
    add  t0, zero, zero   # i = 0
    li   t3, 'a'          # t3 = 'a' (97)
    li   t4, 'z'          # t4 = 'z' (122)

to_upper_loop:
    add  t1, t0, a0       # t1 = &src[i]
    lbu  t2, 0(t1)        # t2 = src[i]
    beq  t2, zero, to_upper_end  # if src[i] == '\\0' -> fine

    blt  t2, t3, to_upper_copy   # if src[i] < 'a' -> copia invariato
    bgt  t2, t4, to_upper_copy   # if src[i] > 'z' -> copia invariato
    addi t2, t2, -32             # converti in maiuscolo (sottrai 32)

to_upper_copy:
    add  t1, t0, a1       # t1 = &dst[i]
    sb   t2, 0(t1)        # dst[i] = t2
    addi t0, t0, 1        # i++
    j    to_upper_loop

to_upper_end:
    add  t1, t0, a1       # t1 = &dst[i]
    sb   zero, 0(t1)      # dst[i] = '\\0' (terminatore)
    ret`,
    domande: [
      { id: 1, domanda: "to_upper usa lbu perché i caratteri ASCII sono unsigned (0-255)", risposta: true },
      { id: 2, domanda: "to_upper deve salvare ra sullo stack prima di eseguire", risposta: false, spiegazione: "to_upper è una funzione foglia: non chiama altre funzioni, quindi non modifica ra e non ha bisogno di salvarlo." },
      { id: 3, domanda: "La differenza ASCII tra 'a' e 'A' è 32", risposta: true },
      { id: 4, domanda: "L'istruzione sb salva un byte (8 bit) in memoria", risposta: true },
      { id: 5, domanda: "Il terminatore null '\\0' viene aggiunto automaticamente da lbu", risposta: false, spiegazione: "Il terminatore viene aggiunto manualmente con 'sb zero, 0(t1)' alla fine del loop." },
    ],
  },
  {
    id: 'space-underscore',
    titolo: 'space_underscore — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Copia una stringa sostituendo ogni spazio con underscore. a0 = sorgente, a1 = destinazione.',
    codice: `################################################################################
# Function: space_underscore
# Arguments:
#   a0 - address of the source string
#   a1 - address of the destination string
################################################################################
space_underscore:
    add  t0, zero, zero   # i = 0
    li   t3, ' '          # t3 = spazio (32)

space_underscore_loop:
    add  t1, t0, a0       # t1 = &src[i]
    lbu  t2, 0(t1)        # t2 = src[i]
    beq  t2, zero, space_underscore_end  # if '\\0' -> fine

    bne  t2, t3, space_underscore_copy  # if src[i] != ' ' -> copia
    li   t2, '_'                         # altrimenti sostituisci con '_'

space_underscore_copy:
    add  t1, t0, a1       # t1 = &dst[i]
    sb   t2, 0(t1)        # dst[i] = t2
    addi t0, t0, 1        # i++
    j    space_underscore_loop

space_underscore_end:
    add  t1, t0, a1
    sb   zero, 0(t1)      # dst[i] = '\\0'
    ret`,
    domande: [
      { id: 1, domanda: "space_underscore è una funzione foglia perché non chiama altre funzioni", risposta: true },
      { id: 2, domanda: "L'istruzione bne salta se i due registri sono uguali", risposta: false, spiegazione: "bne salta se i registri sono DIVERSI (Branch if Not Equal)." },
      { id: 3, domanda: "Il valore ASCII del carattere spazio ' ' è 32", risposta: true },
      { id: 4, domanda: "Questa funzione usa lbu perché i caratteri possono avere il bit più significativo a 1", risposta: true },
      { id: 5, domanda: "Dopo il loop bisogna aggiungere il terminatore '\\0' manualmente", risposta: true },
    ],
  },
  {
    id: 'normalize-grades',
    titolo: 'normalize_grades — Funzione Non Foglia',
    tipo: 'non-foglia',
    descrizione: 'Normalizza i voti in un array a scala 0-100 chiamando scale_to_100(grade, max). a0 = array, a1 = n, a2 = max_grade.',
    codice: `################################################################################
# Procedure normalize_grades(grades, n, max_grade)
# a0 -> array address
# a1 -> number of elements
# a2 -> maximum grade
################################################################################
normalize_grades:
    addi sp, sp, -16      # alloca 16 byte sullo stack
    sw   ra, 0(sp)        # salva ra
    sw   s0, 4(sp)        # salva s0
    sw   s1, 8(sp)        # salva s1
    sw   s2, 12(sp)       # salva s2

    mv   s0, a0           # s0 = indirizzo array
    slli s1, a1, 2        # s1 = n * 4 (offset finale)
    add  s1, s1, s0       # s1 = indirizzo fine array
    mv   s2, a2           # s2 = max_grade

normalize_loop:
    bge  s0, s1, normalize_end   # if ptr >= end -> esci

    lw   a0, 0(s0)        # a0 = grades[i]
    mv   a1, s2           # a1 = max_grade
    jal  ra, scale_to_100 # chiama scale_to_100(grades[i], max_grade)

    sw   a0, 0(s0)        # grades[i] = risultato
    addi s0, s0, 4        # ptr++ (elemento successivo)
    j    normalize_loop

normalize_end:
    lw   ra, 0(sp)
    lw   s0, 4(sp)
    lw   s1, 8(sp)
    lw   s2, 12(sp)
    addi sp, sp, 16       # dealloca stack
    ret`,
    domande: [
      { id: 1, domanda: "normalize_grades deve salvare ra perché chiama scale_to_100", risposta: true, spiegazione: "jal sovrascrive ra con l'indirizzo di ritorno. Senza salvarlo, perderemmo come tornare al chiamante." },
      { id: 2, domanda: "slli s1, a1, 2 calcola n * 4 per trovare l'offset finale dell'array (ogni int = 4 byte)", risposta: true },
      { id: 3, domanda: "I registri s0-s2 vengono usati perché sopravvivono alla chiamata di scale_to_100", risposta: true, spiegazione: "I registri saved (s0-s11) devono essere preservati dal chiamato. Usando s0-s2 e salvandoli, i valori restano validi dopo jal." },
      { id: 4, domanda: "a0 e a1 possono essere usati liberamente senza salvarli, anche tra le chiamate nel loop", risposta: false, spiegazione: "a0-a7 sono caller-saved: vengono sovrascritti dalle chiamate. Per questo i valori importanti vengono spostati in s0-s2 prima del loop." },
      { id: 5, domanda: "addi sp, sp, 16 alla fine dealloca lo spazio sullo stack allocato all'inizio", risposta: true },
    ],
  },
  {
    id: 'bothshort',
    titolo: 'bothshort — Funzione Non Foglia',
    tipo: 'non-foglia',
    descrizione: 'Ritorna 1 se entrambe le stringhe hanno lunghezza ≤ N, 0 altrimenti. Chiama strlen. a0=str1, a1=str2, a2=N.',
    codice: `################################################################################
# Procedure bothshort(str1, str2, N)
# a0 -> str1, a1 -> str2, a2 -> N
# return: 1 if both strings have length <= N, 0 otherwise
################################################################################
bothshort:
    addi sp, sp, -16
    sw   ra, 0(sp)
    sw   s1, 4(sp)
    sw   s2, 8(sp)
    sw   s3, 12(sp)

    mv   s1, a1           # salva str2
    mv   s2, a2           # salva N

    jal  ra, strlen       # strlen(str1) -> a0
    mv   s3, a0           # s3 = len(str1)

    mv   a0, s1           # a0 = str2
    jal  ra, strlen       # strlen(str2) -> a0

    bgt  s3, s2, bothshort_ret0  # if len(str1) > N -> return 0
    bgt  a0, s2, bothshort_ret0  # if len(str2) > N -> return 0
    li   a0, 1
    j    bothshort_end
bothshort_ret0:
    li   a0, 0
bothshort_end:
    lw   ra, 0(sp)
    lw   s1, 4(sp)
    lw   s2, 8(sp)
    lw   s3, 12(sp)
    addi sp, sp, 16
    jr   ra`,
    domande: [
      { id: 1, domanda: "bothshort chiama strlen due volte, quindi deve essere non-foglia", risposta: true },
      { id: 2, domanda: "s1 viene usato per salvare str2 perché a1 verrebbe sovrascritto dalla chiamata a strlen", risposta: true },
      { id: 3, domanda: "jr ra è equivalente a ret", risposta: true, spiegazione: "jr ra = jalr x0, ra, 0 = ret. Tutte e tre saltano all'indirizzo in ra." },
      { id: 4, domanda: "Se len(str1) > N la funzione ritorna immediatamente senza calcolare len(str2)", risposta: true },
      { id: 5, domanda: "bgt salta se il primo registro è minore del secondo", risposta: false, spiegazione: "bgt salta se rs1 > rs2 (Branch if Greater Than). Per minore si usa blt." },
    ],
  },
  {
    id: 'dotproduct',
    titolo: 'dotproduct — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Calcola il prodotto scalare di due array. a0=arr1, a1=arr2, a2=size. Ritorna il risultato in a0.',
    codice: `################################################################################
# Procedure dotproduct(arr1, arr2, size)
# a0 -> arr1, a1 -> arr2, a2 -> size
# return dot product
################################################################################
dotproduct:
    li   t0, 0            # i = 0
    li   t1, 0            # result = 0

loop_start:
    bge  t0, a2, loop_end # if i >= size -> esci

    slli t2, t0, 2        # t2 = i * 4
    add  t2, t2, a0       # t2 = &arr1[i]
    lw   t2, 0(t2)        # t2 = arr1[i]

    slli t3, t0, 2        # t3 = i * 4
    add  t3, t3, a1       # t3 = &arr2[i]
    lw   t3, 0(t3)        # t3 = arr2[i]

    mul  t2, t2, t3       # t2 = arr1[i] * arr2[i]
    add  t1, t1, t2       # result += t2

    addi t0, t0, 1        # i++
    j    loop_start

loop_end:
    mv   a0, t1           # return result
    ret`,
    domande: [
      { id: 1, domanda: "dotproduct è una funzione foglia perché non chiama altre funzioni", risposta: true },
      { id: 2, domanda: "slli t2, t0, 2 calcola i*4 per accedere all'elemento i-esimo di un array di int (4 byte)", risposta: true },
      { id: 3, domanda: "dotproduct deve salvare ra sullo stack", risposta: false, spiegazione: "Essendo foglia, dotproduct non sovrascrive mai ra, quindi non ha bisogno di salvarlo." },
      { id: 4, domanda: "L'istruzione mul esegue la moltiplicazione tra due registri interi", risposta: true },
      { id: 5, domanda: "Il risultato viene messo in a0 prima di ret perché a0 è il registro di ritorno", risposta: true },
    ],
  },
  {
    id: 'strlen',
    titolo: 'strlen — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Calcola la lunghezza di una stringa (numero di caratteri prima del terminatore \\0). a0 = indirizzo stringa. Ritorna lunghezza in a0.',
    codice: `################################################################################
# Function: strlen(str)
# a0 -> indirizzo stringa
# return: lunghezza stringa (non conta il '\\0')
################################################################################
strlen:
    mv   t0, a0           # t0 = ptr = &str[0]

strlen_loop:
    lbu  t1, 0(t0)        # t1 = *ptr
    beq  t1, zero, strlen_end  # if *ptr == '\\0' -> fine
    addi t0, t0, 1        # ptr++
    j    strlen_loop

strlen_end:
    sub  a0, t0, a0       # lunghezza = ptr - &str[0]
    ret`,
    domande: [
      { id: 1, domanda: "strlen è una funzione foglia perché non chiama altre funzioni", risposta: true },
      { id: 2, domanda: "La lunghezza viene calcolata con la differenza tra il puntatore finale e quello iniziale (ptr - base)", risposta: true, spiegazione: "Quando il loop trova \\0, t0 punta al terminatore. La distanza da a0 (inizio) è la lunghezza." },
      { id: 3, domanda: "lbu è necessario perché i caratteri ASCII possono avere il bit più significativo a 1 (es. caratteri accentati)", risposta: true },
      { id: 4, domanda: "Il terminatore \\0 è incluso nel conteggio della lunghezza", risposta: false, spiegazione: "strlen non conta il terminatore. Il loop si ferma quando trova \\0, senza incrementare." },
      { id: 5, domanda: "beq t1, zero, strlen_end controlla se il carattere letto è il terminatore null", risposta: true },
    ],
  },
  {
    id: 'array-sum',
    titolo: 'array_sum — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Calcola la somma degli elementi di un array di interi. a0 = indirizzo array, a1 = numero elementi. Ritorna somma in a0.',
    codice: `################################################################################
# Function: array_sum(arr, n)
# a0 -> indirizzo array
# a1 -> numero elementi
# return: somma di tutti gli elementi
################################################################################
array_sum:
    li   t0, 0            # i = 0
    li   t1, 0            # sum = 0

array_sum_loop:
    bge  t0, a1, array_sum_end  # if i >= n -> esci

    slli t2, t0, 2        # t2 = i * 4 (offset in byte)
    add  t2, t2, a0       # t2 = &arr[i]
    lw   t3, 0(t2)        # t3 = arr[i]

    add  t1, t1, t3       # sum += arr[i]
    addi t0, t0, 1        # i++
    j    array_sum_loop

array_sum_end:
    mv   a0, t1           # return sum
    ret`,
    domande: [
      { id: 1, domanda: "array_sum usa lw perché l'array contiene interi a 32 bit (4 byte)", risposta: true },
      { id: 2, domanda: "slli t2, t0, 2 equivale a t2 = t0 * 4 per calcolare l'offset in byte dell'elemento i", risposta: true, spiegazione: "Shift left di 2 posizioni = moltiplicazione per 4. Ogni int occupa 4 byte." },
      { id: 3, domanda: "bge t0, a1 controlla se l'indice i ha raggiunto n (fine array)", risposta: true },
      { id: 4, domanda: "array_sum deve salvare ra perché chiama altre funzioni", risposta: false, spiegazione: "È una funzione foglia: non chiama nessuna funzione, quindi ra non viene mai sovrascritto." },
      { id: 5, domanda: "Il risultato è messo in a0 perché è il registro di ritorno per valori interi in RISC-V", risposta: true },
    ],
  },
  {
    id: 'fact',
    titolo: 'fact — Funzione Ricorsiva (Non Foglia)',
    tipo: 'non-foglia',
    descrizione: 'Calcola il fattoriale n! in modo ricorsivo. a0 = n. Ritorna n! in a0. Questa funzione appare nell\'estratto del compilatore dell\'esame (Simulazione II).',
    note: 'Attenzione agli offset esadecimali: 0xc = 12 decimal = 3 istruzioni. Ogni istruzione = 4 byte.',
    codice: `################################################################################
# Function: fact(n)
# a0 -> n
# return: n! (n fattoriale)
#
# Estratto tipico del compilatore (Simulazione II):
# 00000000 <fact>:
#    0: fd010113   addi sp, sp, -48
#    4: 02112623   sw ra, 44(sp)
#    8: 02812423   sw s0, 40(sp)
#    c: 03010413   addi s0, sp, 48
#   10: fea42623   sw a0, -20(s0)
#   14: fec42703   lw a4, -20(s0)
#   18: 00100793   li a5, 1
#   1c: 00e7d663   bge a4, a5, 0x28    # offset hex 0x28-0x1c = 0xc = 12 byte = 3 istr.
#   20: 00100793   li a5, 1
#   24: 00078513   mv a0, a5
#   28: 0280006f   j  0x50             # fine
#   2c: fec42783   lw a5, -20(s0)
#   30: fff78793   addi a5, a5, -1
#   34: 00078513   mv a0, a5
#   38: fc9ff0ef   jal ra, fact        # chiamata ricorsiva
#   ...
################################################################################
fact:
    addi sp, sp, -8       # alloca 8 byte sullo stack
    sw   ra, 4(sp)        # salva ra (verrà sovrascritto da jal)
    sw   a0, 0(sp)        # salva n

    li   t0, 1
    bge  a0, t0, fact_else  # if n >= 1 -> caso ricorsivo
    li   a0, 1              # caso base: fact(0) = 1
    j    fact_end

fact_else:
    addi a0, a0, -1       # a0 = n - 1
    jal  ra, fact         # fact(n-1) -> risultato in a0

    lw   t0, 0(sp)        # ripristina n
    mul  a0, a0, t0       # a0 = fact(n-1) * n

fact_end:
    lw   ra, 4(sp)        # ripristina ra
    addi sp, sp, 8        # dealloca stack
    ret`,
    domande: [
      { id: 1, domanda: "fact è ricorsiva quindi deve essere non-foglia e salvare ra prima di jal ra, fact", risposta: true, spiegazione: "jal ra, fact sovrascrive ra con il PC+4 corrente. Senza salvarlo prima, non si riesce a tornare al chiamante originale." },
      { id: 2, domanda: "Nell'estratto del compilatore, l'offset 0xc in un branch corrisponde a 12 byte = 3 istruzioni avanti", risposta: true, spiegazione: "0xc hex = 12 decimal. Dividendo per 4 (byte per istruzione) = 3 istruzioni." },
      { id: 3, domanda: "Nell'output del compilatore, gli indirizzi come 0x1c, 0x20 sono in decimale", risposta: false, spiegazione: "Gli indirizzi nell'estratto del compilatore sono in ESADECIMALE. 0x1c = 28 decimal, 0x20 = 32 decimal." },
      { id: 4, domanda: "fact salva n sullo stack perché dopo jal ra, fact il registro a0 contiene il risultato di fact(n-1), non più n", risposta: true, spiegazione: "a0 è caller-saved: viene sovrascritto dalla chiamata ricorsiva. Bisogna salvare n prima della chiamata." },
      { id: 5, domanda: "Il caso base di fact è n=0 (o n=1) che ritorna 1 senza chiamate ricorsive", risposta: true },
      { id: 6, domanda: "addi sp, sp, -8 alloca spazio per salvare 2 word (ra e a0) nello stack, crescendo verso indirizzi più bassi", risposta: true, spiegazione: "Lo stack in RISC-V cresce verso il basso (indirizzi decrescenti). -8 = 2 × 4 byte." },
    ],
  },
  {
    id: 'countequal',
    titolo: 'countequal — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Conta quante posizioni hanno valori identici nei due array. a0=arr1, a1=arr2, a2=size. Ritorna il conteggio in a0. (Esame 8 Giugno 2026, Turno 1)',
    codice: `################################################################################
# Function: countequal(arr1, arr2, size)
# a0 -> arr1 (indirizzo array di word)
# a1 -> arr2 (indirizzo array di word)
# a2 -> size (numero di elementi)
# return: numero di posizioni i dove arr1[i] == arr2[i]
#
# Codice C di riferimento:
#   int countequal(int arr1[], int arr2[], int size) {
#       int count = 0;
#       for (int i = 0; i < size; i++)
#           if (arr1[i] == arr2[i]) count++;
#       return count;
#   }
################################################################################
countequal:
    li   t0, 0            # i = 0
    li   t1, 0            # count = 0

countequal_loop:
    bge  t0, a2, countequal_end  # if i >= size -> esci

    slli t2, t0, 2        # t2 = i * 4 (offset byte per word)
    add  t3, a0, t2       # t3 = &arr1[i]
    lw   t3, 0(t3)        # t3 = arr1[i]
    add  t4, a1, t2       # t4 = &arr2[i]
    lw   t4, 0(t4)        # t4 = arr2[i]

    bne  t3, t4, countequal_next  # if arr1[i] != arr2[i] -> prossimo
    addi t1, t1, 1        # count++

countequal_next:
    addi t0, t0, 1        # i++
    j    countequal_loop

countequal_end:
    mv   a0, t1           # return count
    ret`,
    domande: [
      { id: 1, domanda: "countequal è una funzione foglia perché non chiama altre funzioni", risposta: true, spiegazione: "countequal non usa jal per chiamare nessuna funzione. Quindi non modifica ra e non ha bisogno di salvarlo sullo stack." },
      { id: 2, domanda: "slli t2, t0, 2 calcola i*4 perché ogni elemento dell'array è una word (int) da 4 byte", risposta: true, spiegazione: "Shift left di 2 = moltiplicazione per 4. Gli array sono di word (int), ogni elemento occupa 4 byte." },
      { id: 3, domanda: "countequal deve salvare ra sullo stack prima di eseguire", risposta: false, spiegazione: "Essendo foglia, countequal non chiama altre funzioni, quindi ra non viene mai modificato. Non è necessario salvarlo." },
      { id: 4, domanda: "bge t0, a2, countequal_end controlla se l'indice i ha raggiunto la fine dell'array", risposta: true, spiegazione: "La condizione i >= size termina il ciclo. bge (Branch if Greater or Equal) controlla esattamente questa condizione." },
      { id: 5, domanda: "Il valore di ritorno viene posto in a0 prima di ret perché a0 è il registro di ritorno", risposta: true, spiegazione: "Per convenzione RISC-V, il valore di ritorno di una funzione va nel registro a0 (x10)." },
      { id: 6, domanda: "bne t3, t4 salta se arr1[i] è diverso da arr2[i], evitando di incrementare il contatore", risposta: true, spiegazione: "Se i due valori sono diversi, saltiamo countequal_next senza eseguire addi t1, t1, 1. Solo quando sono uguali il contatore viene incrementato." },
    ],
  },
  {
    id: 'mystery-swap',
    titolo: 'mystery (swap_array) — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Scambia gli elementi di indici a1 e a2 dell\'array di word puntato da a0. (Esame ArchElab 2025/2026 Turno 1)',
    codice: `################################################################################
# Function: mystery(int *arr, int a, int b)
# a0 -> arr (puntatore all'array di int)
# a1 -> indice a
# a2 -> indice b
# Scambia arr[a] e arr[b]
#
# Codice C di riferimento:
#   void mystery(int *arr, int a, int b) {
#       int tmp = arr[a];
#       arr[a] = arr[b];
#       arr[b] = tmp;
#   }
################################################################################
mystery:
    slli a1, a1, 2      # a1 = a1 * 4 (offset in byte per indice a)
    slli a2, a2, 2      # a2 = a2 * 4 (offset in byte per indice b)
    add  t0, a0, a1     # t0 = &arr[a]
    add  t1, a0, a2     # t1 = &arr[b]
    lw   t2, 0(t0)      # t2 = arr[a]
    lw   t3, 0(t1)      # t3 = arr[b]
    sw   t3, 0(t0)      # arr[a] = arr[b]
    sw   t2, 0(t1)      # arr[b] = tmp
    ret`,
    domande: [
      { id: 1, domanda: "mystery è una funzione foglia perché non chiama altre funzioni (non usa jal)", risposta: true, spiegazione: "Una funzione foglia non chiama altre funzioni, quindi ra non viene mai sovrascritto. Non serve salvarlo sullo stack." },
      { id: 2, domanda: "slli a1,a1,2 moltiplica l'indice a1 per 4 per ottenere l'offset in byte in un array di int (word da 4 byte)", risposta: true, spiegazione: "Ogni elemento dell'array occupa 4 byte (word a 32 bit). Spostamento logico sinistro di 2 bit equivale a moltiplicare per 4: index × 4 = byte offset." },
      { id: 3, domanda: "mystery usa t2 e t3 come variabili temporanee perché sono callee-saved e verranno preservati", risposta: false, spiegazione: "t2 e t3 sono CALLER-saved (temporanei): possono essere modificati liberamente dalla funzione chiamata. Vengono usati qui come variabili locali temporanee, non perché siano preservati." },
      { id: 4, domanda: "Dopo 'add t0,a0,a1', il registro t0 contiene l'indirizzo in memoria dell'elemento arr[a]", risposta: true, spiegazione: "a0 è il puntatore base dell'array, a1 è l'offset in byte (già moltiplicato per 4). t0 = base + offset = &arr[a]." },
      { id: 5, domanda: "Se a1=2 e a2=3, la funzione swap scambia arr[2] con arr[3]. Dopo lo swap, arr[2] contiene il vecchio arr[3]", risposta: true, spiegazione: "slli a1,a1,2 = 8, slli a2,a2,2 = 12. t0=&arr[2], t1=&arr[3]. lw t2=arr[2], lw t3=arr[3]. sw t3,0(t0)=arr[2]=arr[3], sw t2,0(t1)=arr[3]=vecchio arr[2]." },
      { id: 6, domanda: "Sarebbe corretto usare 'add t0,a0,a1' PRIMA di 'slli a1,a1,2' per calcolare &arr[a]", risposta: false, spiegazione: "No: a1 deve essere prima moltiplicato per 4 (slli). Se si usa add prima di slli, t0=a0+indice (non a0+byte_offset). Bisogna sempre convertire l'indice in byte offset prima di sommare al puntatore base." },
    ],
  },
  {
    id: 'find-first-digit',
    titolo: 'find_first_digit — Funzione Foglia',
    tipo: 'foglia',
    descrizione: 'Cerca il primo carattere cifra (da \'0\' a \'9\') in una stringa e restituisce la sua posizione (indice). Se non trovata, restituisce -1. (Esame ArchElab 2025/2026 Turno 1)',
    codice: `################################################################################
# Function: find_first_digit(char *str)
# a0 -> puntatore alla stringa
# return: indice del primo carattere cifra, oppure -1 se non trovata
#
# Codice C di riferimento:
#   int find_first_digit(char *str) {
#       int i = 0;
#       while (str[i] != '\\0') {
#           if (str[i] >= '0' && str[i] <= '9')
#               return i;
#           i++;
#       }
#       return -1;
#   }
# ASCII: '0' = 48, '9' = 57
################################################################################
find_first_digit:
    li   t0, 0          # i = 0
    li   t1, '0'        # t1 = 48 (ASCII '0')
    li   t2, '9'        # t2 = 57 (ASCII '9')

ffd_loop:
    add  t3, a0, t0     # t3 = &str[i]
    lbu  t4, 0(t3)      # t4 = str[i] (byte unsigned)
    beqz t4, ffd_not_found   # if str[i] == '\\0' -> non trovata
    blt  t4, t1, ffd_next    # if str[i] < '0' -> prossimo carattere
    bgt  t4, t2, ffd_next    # if str[i] > '9' -> prossimo carattere
    mv   a0, t0              # return i (trovato!)
    ret

ffd_next:
    addi t0, t0, 1      # i++
    j    ffd_loop

ffd_not_found:
    li   a0, -1         # return -1
    ret`,
    domande: [
      { id: 1, domanda: "find_first_digit è una funzione foglia: non chiama altre funzioni, quindi non salva ra sullo stack", risposta: true, spiegazione: "Nessuna istruzione jal/jalr (eccetto ret che è jalr x0,ra,0). ra non viene mai modificato, quindi non serve salvarlo." },
      { id: 2, domanda: "lbu legge un carattere come byte unsigned (0-255), il che è corretto per caratteri ASCII", risposta: true, spiegazione: "I caratteri ASCII vanno da 0 a 127 (7 bit). lbu fa zero-extension: il bit di segno non viene propagato. Usare lb (signed) potrebbe dare problemi con caratteri > 127." },
      { id: 3, domanda: "La condizione str[i] >= '0' && str[i] <= '9' viene verificata con una sola istruzione branch in RISC-V", risposta: false, spiegazione: "Servono due branch separati: blt per controllare < '0' (salta se minore) e bgt per controllare > '9' (salta se maggiore). Solo se entrambe le condizioni falliscono, il carattere è una cifra." },
      { id: 4, domanda: "Se la stringa è 'hello123world', la funzione restituisce 5 (posizione del primo '1')", risposta: true, spiegazione: "Caratteri: h(0), e(1), l(2), l(3), o(4), 1(5). '1' ha ASCII=49, che soddisfa 48≤49≤57. Indice 5 viene restituito." },
      { id: 5, domanda: "La funzione usa 'mv a0, t0; ret' per ritornare l'indice trovato, sovrascrivendo a0 (che era il puntatore alla stringa)", risposta: true, spiegazione: "a0 è sia l'argomento di input (puntatore) che il registro di ritorno. Al momento della restituzione, a0 viene sovrascritto con t0 (l'indice trovato). Questo è corretto per la RISC-V ABI." },
      { id: 6, domanda: "Se la stringa è 'no digits here', la funzione esegue esattamente 14 iterazioni del loop prima di restituire -1", risposta: true, spiegazione: "'no digits here' ha 14 caratteri + terminatore '\\0'. Il loop scorre tutti i 14 caratteri senza trovare cifre, poi al 15° accesso trova '\\0' e salta a ffd_not_found → return -1." },
    ],
  },
  {
    id: 'bothcontain',
    titolo: 'bothcontain — Funzione Non Foglia',
    tipo: 'non-foglia',
    descrizione: 'Ritorna 1 se entrambe le stringhe contengono il carattere ch, 0 altrimenti. Chiama contains(str, ch). a0=str1, a1=str2, a2=ch. (Esame 8 Giugno 2026, Turno 1)',
    codice: `################################################################################
# Function: bothcontain(str1, str2, ch)
# a0 -> str1, a1 -> str2, a2 -> ch (carattere)
# return: 1 se entrambe le stringhe contengono ch, 0 altrimenti
#
# Codice C di riferimento:
#   int bothcontain(char *str1, char *str2, char ch) {
#       if (contains(str1, ch) && contains(str2, ch))
#           return 1;
#       else
#           return 0;
#   }
#
# contains(str, ch) e' gia' implementata: ritorna 1 se str contiene ch, 0 altrimenti
################################################################################
bothcontain:
    addi sp, sp, -16      # alloca frame sullo stack
    sw   ra, 12(sp)       # salva ra (jal lo sovrascrive)
    sw   s0, 8(sp)        # salva s0
    sw   s1, 4(sp)        # salva s1
    sw   s2, 0(sp)        # salva s2

    mv   s0, a1           # s0 = str2 (a1 verra' sovrascritto)
    mv   s1, a2           # s1 = ch   (a2 verra' sovrascritto)

    mv   a1, s1           # a1 = ch (a0 = str1 gia' impostato)
    jal  ra, contains     # contains(str1, ch) -> a0
    mv   s2, a0           # s2 = risultato di contains(str1, ch)

    mv   a0, s0           # a0 = str2
    mv   a1, s1           # a1 = ch
    jal  ra, contains     # contains(str2, ch) -> a0

    beqz a0, bothcontain_ret0   # se contains(str2,ch)==0 -> return 0
    beqz s2, bothcontain_ret0   # se contains(str1,ch)==0 -> return 0
    li   a0, 1
    j    bothcontain_end

bothcontain_ret0:
    li   a0, 0

bothcontain_end:
    lw   ra, 12(sp)
    lw   s0, 8(sp)
    lw   s1, 4(sp)
    lw   s2, 0(sp)
    addi sp, sp, 16       # dealloca stack
    ret`,
    domande: [
      { id: 1, domanda: "bothcontain è non-foglia perché chiama contains con jal, sovrascrivendo ra", risposta: true, spiegazione: "jal ra, contains sovrascrive ra con l'indirizzo di ritorno. Senza salvarlo prima, non si riuscirebbe a tornare al chiamante." },
      { id: 2, domanda: "s0, s1, s2 vengono usati per preservare str2, ch e il primo risultato across le chiamate a contains", risposta: true, spiegazione: "I registri a0-a2 e t0-t6 sono caller-saved: vengono distrutti dalla chiamata. Si usano s0-s2 (callee-saved) per preservare i valori tra le due chiamate a contains." },
      { id: 3, domanda: "Sarebbe sbagliato usare t0, t1, t2 invece di s0, s1, s2 per preservare i valori tra le chiamate", risposta: true, spiegazione: "I registri temporanei t0-t6 sono caller-saved: la funzione contains può modificarli liberamente. Solo i registri s0-s11 sono garantiti preserved dalle funzioni chiamate." },
      { id: 4, domanda: "beqz a0, bothcontain_ret0 controlla se il secondo risultato (contains str2) è 0", risposta: true, spiegazione: "Dopo la seconda chiamata a contains, il risultato è in a0. Se è 0 (str2 non contiene ch), si salta direttamente a bothcontain_ret0." },
      { id: 5, domanda: "Se contains(str1, ch)=1 e contains(str2, ch)=0, la funzione ritorna 0", risposta: true, spiegazione: "bothcontain richiede che ENTRAMBE le condizioni siano vere. Se una sola è vera, ritorna 0." },
      { id: 6, domanda: "addi sp, sp, 16 alla fine dealloca esattamente i 16 byte allocati all'inizio con addi sp, sp, -16", risposta: true, spiegazione: "Lo stack RISC-V cresce verso il basso. -16 all'inizio alloca, +16 alla fine ripristina il puntatore." },
    ],
  },
];

export const getEsercizioById = (id) => esercizi.find(e => e.id === id);
