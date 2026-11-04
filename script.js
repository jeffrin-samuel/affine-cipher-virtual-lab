"use strict";



const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MODULUS = 26;
const VALID_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];


const NGRAM_SCORES = {
  "THE": 8.0, "AND": 7.8, "ING": 7.7, "HER": 7.3, "ERE": 6.8,
  "ENT": 7.4, "THA": 7.2, "NTH": 6.5, "WAS": 6.7, "ETH": 7.1,
  "FOR": 7.2, "DTH": 5.8, "HAT": 6.8, "SHE": 7.0, "ION": 7.3,
  "TIO": 6.4, "VER": 6.7, "EST": 7.1, "ERS": 6.8, "ATI": 6.3,
  "HES": 6.7, "ALL": 6.5, "HIS": 6.6, "OFT": 6.2, "ITH": 7.2,
  "FTH": 5.7, "STH": 6.0, "OTH": 6.5, "REA": 6.4, "EAR": 6.6,
  "OUR": 6.3, "ONE": 6.7, "OUT": 6.5, "ARE": 6.8, "BUT": 6.4,
  "NOT": 6.6, "YOU": 6.8, "ALL": 6.5, "CAN": 6.4, "HAD": 6.1,
  "WIT": 6.0, "WITH": 8.0, "TION": 8.4, "THER": 8.1,
  "THAT": 8.0, "THIS": 7.8, "HERE": 7.4, "MENT": 7.5,
  "IONS": 7.2, "ATIO": 7.1, "EVER": 7.0, "FROM": 7.1,
  "IGHT": 6.8, "TING": 7.0, "ANCE": 6.9, "ENCE": 7.1,
  "OUGH": 6.2, "OUGH": 6.2, "WHIC": 6.8, "WERE": 7.0,
  "HAVE": 7.1, "BEEN": 7.0, "THEY": 7.0, "WILL": 6.9,
  "WOULD": 6.6, "THEN": 7.0, "THEIR": 7.2, "ABOUT": 7.0,
  "THERE": 7.5, "OTHER": 7.0, "AFTER": 6.8, "FIRST": 6.7,
  "WHILE": 6.5, "WHICH": 7.0, "COULD": 6.6, "SHOULD": 6.3,
  "WORLD": 6.4, "HOUSE": 6.6, "WATER": 6.1, "RIGHT": 6.3,
  "UNDER": 6.3, "STAND": 6.1, "PLACE": 6.2, "SMALL": 5.9
};

const BIGRAM_SCORES = {
  TH: 3.8, HE: 4.0, IN: 3.6, ER: 3.5, AN: 3.4,
  RE: 3.3, ON: 3.2, AT: 3.2, EN: 3.1, ND: 3.0,
  TI: 3.0, ES: 3.1, OR: 3.1, TE: 3.0, OF: 3.0,
  ED: 2.9, IS: 3.0, IT: 3.0, AL: 2.9, AR: 2.9,
  ST: 2.9, TO: 3.1, NT: 3.0, NG: 2.8, SE: 2.8,
  HA: 2.8, AS: 2.9, OU: 2.8, IO: 2.6, LE: 2.7,
  VE: 2.7, CO: 2.6, ME: 2.6, DE: 2.5, HI: 2.6,
  RI: 2.5, RO: 2.5, IC: 2.5, NE: 2.5, EA: 2.7
};

let cryptanalysisResults = [];
let showingAllCandidates = false;

function $(id) {
  return document.getElementById(id);
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = a % b;
    a = b;
    b = temp;
  }

  return a;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, m = MODULUS) {
  a = mod(a, m);

  let oldR = a;
  let r = m;
  let oldS = 1;
  let s = 0;

  while (r !== 0) {
    const q = Math.floor(oldR / r);

    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }

  if (oldR !== 1) {
    return null;
  }

  return mod(oldS, m);
}

function isValidA(a) {
  return Number.isInteger(a) && a >= 0 && a < MODULUS && gcd(a, MODULUS) === 1;
}

function populateSelect(selectId, values) {
  const select = $(selectId);
  if (!select) return;

  select.innerHTML = values.map(value =>
    `<option value="${value}">${value}</option>`
  ).join("");
}

function setupSelects() {
  const aIds = [
    "encrypt-a",
    "decrypt-a",
    "theory-a"
  ];

  const bIds = [
    "encrypt-b",
    "decrypt-b",
    "theory-b"
  ];

  aIds.forEach(id => populateSelect(id, VALID_A));
  bIds.forEach(id => populateSelect(id, Array.from({ length: 26 }, (_, i) => i)));

  $("encrypt-a").value = "5";
  $("encrypt-b").value = "8";

  $("decrypt-a").value = "5";
  $("decrypt-b").value = "8";

  $("theory-a").value = "5";
  $("theory-b").value = "8";
}

function showMessage(message, error = false) {
  const box = $("global-message");

  box.textContent = message;
  box.className = "global-message show" + (error ? " error" : "");

  clearTimeout(showMessage.timer);

  showMessage.timer = setTimeout(() => {
    box.className = "global-message";
  }, 2400);
}

function navigateTo(sectionId) {
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.toggle("active", section.id === sectionId);
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.section === sectionId);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setupNavigation() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => navigateTo(tab.dataset.section));
  });

  document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => navigateTo(button.dataset.goto));
  });
}

function getKey(aId, bId) {
  const a = Number($(aId).value);
  const b = Number($(bId).value);

  return { a, b };
}

function validateKey(a, b) {
  if (!Number.isInteger(a) || a < 0 || a >= 26) {
    return {
      valid: false,
      message: "a must be an integer between 0 and 25."
    };
  }

  if (!Number.isInteger(b) || b < 0 || b >= 26) {
    return {
      valid: false,
      message: "b must be an integer between 0 and 25."
    };
  }

  if (!isValidA(a)) {
    return {
      valid: false,
      message: `Invalid a. gcd(${a},26) = ${gcd(a, 26)}. Choose a relatively prime to 26.`
    };
  }

  return {
    valid: true,
    message: `✓ Valid key. gcd(${a},26) = 1.`
  };
}

function updateKeyStatus(aId, bId, statusId) {
  const { a, b } = getKey(aId, bId);
  const result = validateKey(a, b);
  const status = $(statusId);

  status.textContent = result.message;
  status.className = "key-status " + (result.valid ? "valid" : "invalid");

  return result.valid;
}

function normalizeLetter(char) {
  return char.toUpperCase();
}

function encryptAffine(text, a, b) {
  const steps = [];
  let result = "";

  for (const char of text) {
    const upper = normalizeLetter(char);

    if (!ALPHABET.includes(upper)) {
      result += char;
      continue;
    }

    const x = ALPHABET.indexOf(upper);
    const output = mod(a * x + b, MODULUS);
    const cipher = ALPHABET[output];

    result += cipher;

    steps.push({
      character: upper,
      value: x,
      calculation: `(${a} × ${x} + ${b}) mod 26`,
      outputValue: output,
      cipher
    });
  }

  return { result, steps };
}

function decryptAffine(text, a, b) {
  const inverse = modInverse(a);
  const steps = [];
  let result = "";

  if (inverse === null) {
    return {
      result: "",
      inverse: null,
      steps
    };
  }

  for (const char of text) {
    const upper = normalizeLetter(char);

    if (!ALPHABET.includes(upper)) {
      result += char;
      continue;
    }

    const y = ALPHABET.indexOf(upper);
    const recovered = mod(inverse * (y - b), MODULUS);
    const plain = ALPHABET[recovered];

    result += plain;

    steps.push({
      character: upper,
      value: y,
      calculation: `${inverse} × (${y} − ${b}) mod 26`,
      outputValue: recovered,
      plain
    });
  }

  return {
    result,
    inverse,
    steps
  };
}

function renderEncryptionSteps(steps) {
  const tbody = $("encrypt-steps");

  if (!steps.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          No alphabetic characters to process.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = steps.map(step => `
    <tr>
      <td>${escapeHTML(step.character)}</td>
      <td>${step.value}</td>
      <td><code>${escapeHTML(step.calculation)}</code></td>
      <td>${step.outputValue}</td>
      <td><strong>${step.cipher}</strong></td>
    </tr>
  `).join("");
}

function renderDecryptionSteps(steps) {
  const tbody = $("decrypt-steps");

  if (!steps.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          No alphabetic characters to process.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = steps.map(step => `
    <tr>
      <td>${escapeHTML(step.character)}</td>
      <td>${step.value}</td>
      <td><code>${escapeHTML(step.calculation)}</code></td>
      <td>${step.outputValue}</td>
      <td><strong>${step.plain}</strong></td>
    </tr>
  `).join("");
}

function runEncryption() {
  const text = $("encrypt-text").value;
  const { a, b } = getKey("encrypt-a", "encrypt-b");

  if (!text.trim()) {
    showMessage("Please enter a plaintext message.", true);
    return;
  }

  const keyCheck = validateKey(a, b);

  if (!keyCheck.valid) {
    showMessage(keyCheck.message, true);
    return;
  }

  const output = encryptAffine(text, a, b);

  $("encrypt-plain-result").textContent = text;
  $("encrypt-cipher-result").textContent = output.result;

  renderEncryptionSteps(output.steps);

  showMessage("Encryption completed.");
}

function runDecryption() {
  const text = $("decrypt-text").value;
  const { a, b } = getKey("decrypt-a", "decrypt-b");

  if (!text.trim()) {
    showMessage("Please enter a ciphertext message.", true);
    return;
  }

  const keyCheck = validateKey(a, b);

  if (!keyCheck.valid) {
    showMessage(keyCheck.message, true);
    return;
  }

  const output = decryptAffine(text, a, b);

  $("inverse-result").textContent = output.inverse;

  $("decrypt-cipher-result").textContent = text;
  $("decrypt-plain-result").textContent = output.result;

  $("inverse-explanation").innerHTML = `
    Find x such that:
    <br><br>
    ${a} × x ≡ 1 (mod 26)
    <br><br>
    ${a} × ${output.inverse} = ${a * output.inverse}
    <br>
    ${a * output.inverse} mod 26 = 1
    <br><br>
    Therefore:
    <strong>${a}⁻¹ mod 26 = ${output.inverse}</strong>
  `;

  renderDecryptionSteps(output.steps);

  showMessage("Decryption completed.");
}

function renderAlphabetMapping() {
  const a = Number($("theory-a").value);
  const b = Number($("theory-b").value);

  $("alphabet-row").innerHTML = ALPHABET
    .split("")
    .map((letter, index) => `<div>${letter}</div>`)
    .join("");

  $("mapping-row").innerHTML = ALPHABET
    .split("")
    .map((_, index) => {
      const mapped = ALPHABET[mod(a * index + b, MODULUS)];
      return `<div>${mapped}</div>`;
    })
    .join("");
}

function scoreNgrams(text) {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");

  if (clean.length < 2) {
    return -100;
  }

  let score = 0;

  for (let i = 0; i < clean.length - 1; i++) {
    const bigram = clean.slice(i, i + 2);
    score += BIGRAM_SCORES[bigram] ?? -1.2;
  }

  for (let i = 0; i < clean.length - 2; i++) {
    const trigram = clean.slice(i, i + 3);
    score += NGRAM_SCORES[trigram] ?? -2.2;
  }

  for (let i = 0; i < clean.length - 3; i++) {
    const quadgram = clean.slice(i, i + 4);
    score += NGRAM_SCORES[quadgram] ?? -2.8;
  }

  return score;
}

function getNgramDetails(text) {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const values = [];

  for (let i = 0; i < clean.length - 2; i++) {
    const gram = clean.slice(i, i + 3);

    values.push({
      gram,
      score: NGRAM_SCORES[gram] ?? -2.2
    });
  }

  return values;
}

function generateKeys() {
  const keys = [];

  for (const a of VALID_A) {
    for (let b = 0; b < 26; b++) {
      keys.push({
        a,
        b,
        inverse: modInverse(a)
      });
    }
  }

  return keys;
}

function cryptanalyze(ciphertext, progressCallback) {
  const keys = generateKeys();
  const results = [];

  keys.forEach((key, index) => {
    const decrypted = decryptAffine(ciphertext, key.a, key.b);

    const score = scoreNgrams(decrypted.result);

    results.push({
      rank: 0,
      a: key.a,
      b: key.b,
      inverse: key.inverse,
      plaintext: decrypted.result,
      score
    });

    if (progressCallback) {
      progressCallback(index + 1, keys.length);
    }
  });

  results.sort((x, y) => y.score - x.score);

  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
}

function renderAttackResults(showAll = false) {
  const tbody = $("attack-results");

  if (!cryptanalysisResults.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          Run cryptanalysis to generate candidates.
        </td>
      </tr>
    `;
    return;
  }

  const results = showAll
    ? cryptanalysisResults
    : cryptanalysisResults.slice(0, 10);

  tbody.innerHTML = results.map(result => `
    <tr class="candidate-row" data-rank="${result.rank}" tabindex="0">
      <td>#${result.rank}</td>
      <td>${result.a}</td>
      <td>${result.b}</td>
      <td>${result.inverse}</td>
      <td>${escapeHTML(result.plaintext)}</td>
      <td>${result.score.toFixed(2)}</td>
    </tr>
  `).join("");

  tbody.querySelectorAll(".candidate-row").forEach(row => {
    row.addEventListener("click", () => {
      const rank = Number(row.dataset.rank);
      selectCandidate(rank);
    });

    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCandidate(Number(row.dataset.rank));
      }
    });
  });
}

function selectCandidate(rank) {
  const candidate = cryptanalysisResults.find(item => item.rank === rank);

  if (!candidate) return;

  $("candidate-details").classList.remove("hidden");

  $("candidate-title").textContent = `Rank #${candidate.rank}`;
  $("candidate-key").textContent = `a = ${candidate.a}, b = ${candidate.b}`;
  $("candidate-inverse").textContent = candidate.inverse;
  $("candidate-score").textContent = candidate.score.toFixed(2);
  $("candidate-plaintext").textContent = candidate.plaintext;

  const best = cryptanalysisResults[0]?.score ?? 1;
  const minimum = cryptanalysisResults[cryptanalysisResults.length - 1]?.score ?? 0;

  let relative = 0;

  if (best !== minimum) {
    relative = ((candidate.score - minimum) / (best - minimum)) * 100;
  }

  relative = Math.max(0, Math.min(100, relative));

  $("relative-score").textContent = `${relative.toFixed(0)}% relative`;

  const grams = getNgramDetails(candidate.plaintext);

  $("ngram-list").innerHTML = grams.length
    ? grams.slice(0, 50).map(item => `
        <span class="ngram-item ${item.score < 0 ? "low" : ""}">
          ${item.gram}
        </span>
      `).join("")
    : `<span class="muted">Not enough characters for n-gram visualization.</span>`;

  $("candidate-steps").classList.add("hidden");
  $("candidate-steps").innerHTML = "";

  $("candidate-decrypt-steps").onclick = () => {
    const output = decryptAffine(
      $("attack-text").value,
      candidate.a,
      candidate.b
    );

    $("candidate-steps").classList.remove("hidden");

    $("candidate-steps").innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cipher</th>
              <th>Value</th>
              <th>Calculation</th>
              <th>Recovered</th>
              <th>Plaintext</th>
            </tr>
          </thead>
          <tbody>
            ${output.steps.map(step => `
              <tr>
                <td>${step.character}</td>
                <td>${step.value}</td>
                <td><code>${escapeHTML(step.calculation)}</code></td>
                <td>${step.outputValue}</td>
                <td><strong>${step.plain}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  $("candidate-details").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function runCryptanalysis() {
  const ciphertext = $("attack-text").value;

  if (!ciphertext.trim()) {
    showMessage("Please enter ciphertext to analyze.", true);
    return;
  }

  const cleanLength = ciphertext.replace(/[^A-Za-z]/g, "").length;

  if (cleanLength < 8) {
    showMessage("Short ciphertexts may produce unreliable statistical rankings.");
  }

  const button = $("attack-btn");
  button.disabled = true;
  button.textContent = "Analyzing...";

  $("show-all-btn").disabled = true;
  $("candidate-details").classList.add("hidden");

  $("attack-progress-text").textContent = "Testing keys...";
  $("attack-progress-count").textContent = "0 / 312";
  $("attack-progress-bar").style.width = "0%";

  // Allow the UI to render before starting the loop.
  setTimeout(() => {
    cryptanalysisResults = cryptanalyze(ciphertext, (current, total) => {
      const percent = (current / total) * 100;

      $("attack-progress-count").textContent = `${current} / ${total}`;
      $("attack-progress-bar").style.width = `${percent}%`;
    });

    const best = cryptanalysisResults[0];

    $("keys-tested").textContent = "312";
    $("top-candidate").textContent = best?.plaintext || "—";
    $("best-key").textContent = best
      ? `a=${best.a}, b=${best.b}`
      : "—";
    $("best-score").textContent = best
      ? best.score.toFixed(2)
      : "—";

    $("attack-progress-text").textContent = "Analysis complete";

    renderAttackResults(false);

    $("show-all-btn").disabled = false;
    showingAllCandidates = false;
    $("show-all-btn").textContent = "Show All 312";

    button.disabled = false;
    button.textContent = "Start Cryptanalysis";

    if (best) {
      selectCandidate(best.rank);
    }

    showMessage("Cryptanalysis completed: all 312 keys tested.");
  }, 50);
}

function setupAccordion() {
  document.querySelectorAll(".accordion-button").forEach(button => {
    button.addEventListener("click", () => {
      const target = $(button.dataset.accordion);
      const isOpen = target.classList.toggle("open");

      button.lastElementChild.textContent = isOpen ? "−" : "+";
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const target = $(button.dataset.copyTarget);
      const text = target?.textContent;

      if (!text || text === "—") {
        showMessage("There is no result to copy.", true);
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = "Copied!";

        setTimeout(() => {
          button.textContent = original;
        }, 1200);
      } catch {
        showMessage("Copy failed. Please copy the result manually.", true);
      }
    });
  });
}

function clearEncryption() {
  $("encrypt-text").value = "";
  $("encrypt-plain-result").textContent = "—";
  $("encrypt-cipher-result").textContent = "—";

  $("encrypt-steps").innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        Run encryption to see the calculations.
      </td>
    </tr>
  `;
}

function clearDecryption() {
  $("decrypt-text").value = "";
  $("decrypt-cipher-result").textContent = "—";
  $("decrypt-plain-result").textContent = "—";
  $("inverse-result").textContent = "—";

  $("inverse-explanation").textContent =
    "Enter a valid key and decrypt to see the inverse calculation.";

  $("decrypt-steps").innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        Run decryption to see the calculations.
      </td>
    </tr>
  `;
}

function loadEncryptionExample() {
  $("encrypt-text").value = "HELLO";
  $("encrypt-a").value = "5";
  $("encrypt-b").value = "8";
  updateKeyStatus("encrypt-a", "encrypt-b", "encrypt-key-status");
  runEncryption();
}

function loadDecryptionExample() {
  $("decrypt-text").value = "RCLLW";
  $("decrypt-a").value = "5";
  $("decrypt-b").value = "8";
  updateKeyStatus("decrypt-a", "decrypt-b", "decrypt-key-status");
  runDecryption();
}

function loadAttackExample() {
  $("attack-text").value = "RCLLW";
  runCryptanalysis();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------------- QUIZ ---------------- */

const QUIZ = [
  {
    question: "Which formula represents Affine Cipher encryption?",
    options: [
      "E(x) = (a × x + b) mod 26",
      "E(x) = (x − b) × a mod 26",
      "E(x) = (a + x + b) mod 26",
      "E(x) = (x × b) mod 26"
    ],
    answer: 0,
    explanation: "Affine encryption applies the linear transformation (a × x + b) modulo 26."
  },
  {
    question: "Using A=0, what numerical value represents the letter H?",
    options: ["6", "7", "8", "9"],
    answer: 1,
    explanation: "A=0, B=1, ..., so H has value 7."
  },
  {
    question: "What condition must a satisfy for a valid Affine Cipher key?",
    options: [
      "a must be even",
      "a must equal b",
      "gcd(a,26) must equal 1",
      "a must be greater than 13"
    ],
    answer: 2,
    explanation: "a must be relatively prime to 26 so that a modular inverse exists."
  },
  {
    question: "What is the modular inverse of 5 modulo 26?",
    options: ["5", "11", "21", "25"],
    answer: 2,
    explanation: "5 × 21 = 105 and 105 mod 26 = 1, so the inverse is 21."
  },
  {
    question: "How many possible Affine Cipher keys exist for a 26-character alphabet?",
    options: ["26", "52", "156", "312"],
    answer: 3,
    explanation: "There are 12 valid values of a and 26 values of b, giving 12 × 26 = 312 keys."
  },
  {
    question: "What does brute-force cryptanalysis do in this experiment?",
    options: [
      "Changes the alphabet size",
      "Tests every valid key",
      "Deletes punctuation",
      "Generates a random ciphertext"
    ],
    answer: 1,
    explanation: "The attack tests every one of the 312 possible Affine Cipher keys."
  },
  {
    question: "What is an n-gram?",
    options: [
      "A sequence of n consecutive characters",
      "A random encryption key",
      "A modular inverse",
      "A type of alphabet"
    ],
    answer: 0,
    explanation: "An n-gram is a sequence of n consecutive characters, such as THE or TION."
  },
  {
    question: "Why can n-gram scoring help rank Affine Cipher candidates?",
    options: [
      "It makes every candidate identical",
      "It detects whether a key is mathematically valid",
      "English has characteristic letter sequences",
      "It increases the keyspace"
    ],
    answer: 2,
    explanation: "Common English sequences tend to occur more frequently than unlikely random sequences."
  },
  {
    question: "What happens when gcd(a,26) is not 1?",
    options: [
      "The plaintext becomes longer",
      "The modular inverse of a does not exist",
      "b is automatically changed",
      "The alphabet becomes 52 characters"
    ],
    answer: 1,
    explanation: "A modular inverse modulo 26 exists only when a and 26 are relatively prime."
  },
  {
    question: "Why is the Affine Cipher unsuitable for modern secure communication?",
    options: [
      "It has a small keyspace and predictable substitution structure",
      "It cannot represent letters",
      "It requires a database",
      "It only works with numbers"
    ],
    answer: 0,
    explanation: "Its small keyspace and monoalphabetic structure make it vulnerable to systematic cryptanalysis."
  }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let selectedQuizOption = null;

function initializeQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  selectedQuizOption = null;

  $("quiz-container").classList.remove("hidden");
  $("quiz-complete").classList.add("hidden");

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = QUIZ[quizIndex];

  $("quiz-progress").textContent =
    `QUESTION ${quizIndex + 1} / ${QUIZ.length}`;

  $("quiz-score").textContent = quizScore;

  $("quiz-progress-bar").style.width =
    `${(quizIndex / QUIZ.length) * 100}%`;

  $("quiz-question").textContent = question.question;

  $("quiz-options").innerHTML = question.options.map((option, index) => `
    <button class="quiz-option" data-option="${index}">
      <strong>${String.fromCharCode(65 + index)}.</strong>
      ${escapeHTML(option)}
    </button>
  `).join("");

  $("quiz-feedback").className = "quiz-feedback hidden";
  $("quiz-feedback").textContent = "";

  $("quiz-submit").classList.remove("hidden");
  $("quiz-next").classList.add("hidden");

  quizAnswered = false;
  selectedQuizOption = null;

  document.querySelectorAll(".quiz-option").forEach(option => {
    option.addEventListener("click", () => {
      if (quizAnswered) return;

      document.querySelectorAll(".quiz-option")
        .forEach(item => item.classList.remove("selected"));

      option.classList.add("selected");
      selectedQuizOption = Number(option.dataset.option);
    });
  });
}

function submitQuizAnswer() {
  if (quizAnswered) return;

  if (selectedQuizOption === null) {
    showMessage("Please select an answer first.", true);
    return;
  }

  const question = QUIZ[quizIndex];
  const options = document.querySelectorAll(".quiz-option");

  quizAnswered = true;

  options.forEach((option, index) => {
    option.disabled = true;

    if (index === question.answer) {
      option.classList.add("correct");
    }

    if (
      index === selectedQuizOption &&
      selectedQuizOption !== question.answer
    ) {
      option.classList.add("wrong");
    }
  });

  const feedback = $("quiz-feedback");

  if (selectedQuizOption === question.answer) {
    quizScore++;
    feedback.className = "quiz-feedback correct-feedback";
    feedback.textContent = `Correct! ${question.explanation}`;
  } else {
    feedback.className = "quiz-feedback wrong-feedback";
    feedback.textContent = `Review: ${question.explanation}`;
  }

  $("quiz-score").textContent = quizScore;

  $("quiz-submit").classList.add("hidden");
  $("quiz-next").classList.remove("hidden");

  if (quizIndex === QUIZ.length - 1) {
    $("quiz-next").textContent = "View Result";
  } else {
    $("quiz-next").textContent = "Next Question";
  }
}

function nextQuizQuestion() {
  if (!quizAnswered) return;

  if (quizIndex === QUIZ.length - 1) {
    finishQuiz();
    return;
  }

  quizIndex++;
  renderQuizQuestion();
}

function finishQuiz() {
  $("quiz-container").classList.add("hidden");
  $("quiz-complete").classList.remove("hidden");

  const percentage = Math.round((quizScore / QUIZ.length) * 100);

  $("final-score").textContent = `${quizScore} / ${QUIZ.length}`;

  let message;

  if (percentage >= 80) {
    message = `You scored ${percentage}%. You demonstrated a strong understanding of the Affine Cipher concepts.`;
  } else if (percentage >= 60) {
    message = `You scored ${percentage}%. Review the theory and try the experiment again to reinforce the concepts.`;
  } else {
    message = `You scored ${percentage}%. Revisit the Theory, Encryption and Decryption sections before retaking the assessment.`;
  }

  $("final-message").textContent = message;
}


function setupEventListeners() {
  $("encrypt-btn").addEventListener("click", runEncryption);
  $("decrypt-btn").addEventListener("click", runDecryption);
  $("attack-btn").addEventListener("click", runCryptanalysis);

  $("encrypt-example").addEventListener("click", loadEncryptionExample);
  $("decrypt-example").addEventListener("click", loadDecryptionExample);
  $("attack-example").addEventListener("click", loadAttackExample);

  $("encrypt-clear").addEventListener("click", clearEncryption);
  $("decrypt-clear").addEventListener("click", clearDecryption);

  $("show-all-btn").addEventListener("click", () => {
    if (!cryptanalysisResults.length) return;

    showingAllCandidates = !showingAllCandidates;

    renderAttackResults(showingAllCandidates);

    $("show-all-btn").textContent = showingAllCandidates
      ? "Show Top 10"
      : "Show All 312";
  });

  [
    ["encrypt-a", "encrypt-b", "encrypt-key-status"],
    ["decrypt-a", "decrypt-b", "decrypt-key-status"]
  ].forEach(([a, b, status]) => {
    $(a).addEventListener("change", () =>
      updateKeyStatus(a, b, status)
    );

    $(b).addEventListener("change", () =>
      updateKeyStatus(a, b, status)
    );
  });

  $("theory-a").addEventListener("change", renderAlphabetMapping);
  $("theory-b").addEventListener("change", renderAlphabetMapping);

  $("quiz-submit").addEventListener("click", submitQuizAnswer);
  $("quiz-next").addEventListener("click", nextQuizQuestion);
  $("quiz-retake").addEventListener("click", initializeQuiz);
}

function initialize() {
  setupSelects();
  setupNavigation();
  setupEventListeners();
  setupAccordion();
  setupCopyButtons();

  updateKeyStatus(
    "encrypt-a",
    "encrypt-b",
    "encrypt-key-status"
  );

  updateKeyStatus(
    "decrypt-a",
    "decrypt-b",
    "decrypt-key-status"
  );

  renderAlphabetMapping();
  initializeQuiz();


  runEncryption();
  runDecryption();
}

document.addEventListener("DOMContentLoaded", initialize);