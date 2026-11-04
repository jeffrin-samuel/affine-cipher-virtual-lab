# 🔐 Affine Cipher CSS Virtual Laboratory

**Topic:** Affine Cipher

---

## 📌 About the Project

An interactive web-based virtual laboratory designed to demonstrate the working of the **Affine Cipher**, a classical encryption technique based on modular arithmetic.

The application provides an interactive environment to understand encryption, decryption, brute-force cryptanalysis and the security limitations of the Affine Cipher.

## ✨ Features

- **Overview:** Experiment aim, objectives and procedure.
- **Theory:** Affine Cipher concepts, formulas and interactive alphabet mapping.
- **Encryption:** Encrypt plaintext using custom keys with step-by-step calculations.
- **Decryption:** Recover plaintext using modular multiplicative inverse.
- **Cryptanalysis:** Brute-force attack on all 312 valid keys using English n-gram scoring.
- **Security Insights:** Understand the vulnerabilities and limitations of the cipher.
- **Assessment:** Interactive 10-question quiz to test understanding.

## 🛠️ Technology Stack

- HTML5 – Structure
- CSS3 – Styling and layout
- JavaScript – Encryption, decryption, cryptanalysis and interactivity

## 🔢 Mathematical Formulas

**Encryption:**

```text
E(x) = (a × x + b) mod 26
```

**Decryption:**

```text
D(y) = a⁻¹ × (y - b) mod 26
```

**Key Condition:**

```text
gcd(a, 26) = 1
```

There are 12 valid values of `a` and 26 possible values of `b`, resulting in **312 valid keys**.

## 🚀 How to Run

1. Clone or download the repository.
2. Keep `index.html`, `style.css` and `script.js` in the same folder.
3. Open `index.html` in any modern web browser.
4. Explore the different laboratory sections.

---

*Developed as part of a Cryptography & System Security virtual laboratory experiment.*