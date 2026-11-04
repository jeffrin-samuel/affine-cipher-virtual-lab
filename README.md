# Affine Cipher Virtual Laboratory

## Project Information

**Topic:** Affine Cipher\
**Project Type:** Virtual Cryptography Laboratory\
**Technology Stack:** HTML, CSS and JavaScript

### Group Members

  Name              Roll Number
  --------------- -------------
  Jeffrin Nadar           10677
  Smith Mendes            10674
  Yug Mhatre              10675
  Umar Modak              10676

------------------------------------------------------------------------

## 1. Introduction

The **Affine Cipher Virtual Laboratory** is an interactive web-based
learning tool designed to demonstrate the working of the Affine Cipher,
a classical substitution cipher based on modular arithmetic.

The lab allows users to explore the theory behind the cipher, encrypt
plaintext, decrypt ciphertext, and perform brute-force cryptanalysis. It
also explains the security limitations of the Affine Cipher and provides
an assessment quiz to test the user's understanding.

The application runs in a web browser and uses HTML for structure, CSS
for presentation, and JavaScript for interactive functionality and
cipher calculations.

## 2. Objectives

-   Understand the basic concept and mathematical foundation of the
    Affine Cipher.
-   Perform encryption and decryption using valid keys.
-   Understand the role of modular arithmetic and modular multiplicative
    inverses.
-   Identify valid and invalid encryption keys.
-   Explore brute-force cryptanalysis by testing all possible valid
    keys.
-   Understand how English n-gram frequency scoring can help rank
    possible plaintexts.
-   Analyze the security limitations of a classical substitution cipher.

## 3. Features and Modules

The virtual laboratory is organized into seven interactive sections.

### 3.1 Experiment Overview

-   Displays the aim and learning objectives of the experiment.
-   Explains the three main activities: encryption, decryption and
    cryptanalysis.
-   Provides a quick-start example using plaintext `HELLO` with `a = 5`
    and `b = 8`.
-   Shows the total number of possible valid keys: **312**.

### 3.2 Theory

-   Introduces the Affine Cipher as a monoalphabetic substitution
    cipher.
-   Explains the encryption and decryption formulas.
-   Describes the valid-key condition `gcd(a, 26) = 1`.
-   Provides an interactive alphabet substitution mapping.
-   Allows users to change the values of `a` and `b` and observe the
    resulting mapping.
-   Explains modular multiplicative inverse with a worked example.

### 3.3 Encryption

-   Accepts plaintext entered by the user.
-   Allows selection of the encryption keys `a` and `b`.
-   Validates the selected key.
-   Encrypts the message using the Affine Cipher formula.
-   Displays the resulting ciphertext.
-   Provides a character-by-character calculation table showing the
    input character, numerical value, calculation, output value and
    encrypted character.
-   Includes **Load Example**, **Clear** and **Copy Result** controls.

**Input handling:** Alphabetic characters are transformed. Spaces and
punctuation are preserved. Input is treated case-insensitively, and the
output is displayed in uppercase.

### 3.4 Decryption

-   Accepts ciphertext entered by the user.
-   Allows selection of the keys `a` and `b`.
-   Calculates and displays the modular multiplicative inverse of `a`.
-   Decrypts the ciphertext using the inverse key.
-   Displays the recovered plaintext.
-   Shows the inverse calculation and a character-by-character
    decryption table.
-   Includes **Load Example**, **Clear** and **Copy Result** controls.

### 3.5 Cryptanalysis

-   Attempts to recover plaintext without being given the original key.
-   Uses a brute-force approach to test all **312 valid Affine Cipher
    keys**.
-   Decrypts the ciphertext using each candidate key.
-   Uses English n-gram scoring to evaluate and rank the resulting
    plaintext candidates.
-   Displays attack progress, the number of keys tested, the top
    candidate, the best key and its score.
-   Presents ranked candidates in a table.
-   Allows users to view all 312 candidates and inspect an individual
    candidate.
-   Provides n-gram scoring evidence and an option to view the selected
    candidate's decryption steps.

**N-gram scoring:** The application compares character sequences in each
candidate plaintext with an embedded English n-gram frequency dataset.
Common English sequences receive higher scores, while unlikely sequences
receive lower scores. The highest-scoring candidate is the most likely
result according to the scoring model; it is not guaranteed to be the
correct plaintext.

### 3.6 Security Insights

Explains the security weaknesses demonstrated by the experiment:

-   **Small keyspace:** Only 312 valid keys are available, making
    exhaustive search practical.
-   **Monoalphabetic substitution:** Each plaintext letter maps
    consistently to one ciphertext letter for a given key.
-   **Statistical weakness:** English letter and n-gram patterns can
    help identify likely plaintexts.
-   **Classical cipher limitation:** The Affine Cipher is useful for
    learning cryptography but is not suitable for modern secure
    communication.

### 3.7 Assessment

-   Includes a 10-question quiz based on the concepts covered in the
    lab.
-   Displays question progress and the user's score.
-   Provides feedback after an answer is submitted.
-   Allows the user to move through the questions.
-   Displays the final score and a completion message.
-   Provides an option to retake the quiz.

## 4. Affine Cipher: Mathematical Background

The Affine Cipher converts each letter into a number from `0` to `25`,
applies a mathematical transformation, and converts the result back into
a letter.

Using the mapping `A = 0, B = 1, ..., Z = 25`:

**Encryption formula**

``` text
E(x) = (a × x + b) mod 26
```

Where: - `x` is the numerical value of the plaintext letter. - `a` is
the multiplicative key. - `b` is the additive key. - `mod 26` keeps the
result within the alphabet range.

**Decryption formula**

``` text
D(y) = a⁻¹ × (y − b) mod 26
```

Where: - `y` is the numerical value of the ciphertext letter. - `a⁻¹` is
the modular multiplicative inverse of `a` modulo 26.

**Valid-key condition**

``` text
gcd(a, 26) = 1
```

The value of `a` must be relatively prime to 26 so that its modular
multiplicative inverse exists.

The valid values of `a` are:

``` text
1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25
```

The value of `b` can be any integer from `0` to `25`.

Therefore:

``` text
Number of valid keys = 12 × 26 = 312
```

**Example**

For plaintext `HELLO`, with `a = 5` and `b = 8`, the expected ciphertext
is:

``` text
RCLLW
```

For `a = 5`, the modular inverse is `21`, because:

``` text
5 × 21 = 105
105 mod 26 = 1

Therefore, 5⁻¹ mod 26 = 21
```

## 5. Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  HTML5                               Structures the laboratory
                                      interface, sections, forms,
                                      buttons, tables and content.

  CSS3                                Handles the visual design, layout,
                                      styling, responsive presentation
                                      and interface components.

  JavaScript                          Implements cipher operations, key
                                      validation, modular inverse
                                      calculations, interactive
                                      navigation, cryptanalysis, n-gram
                                      scoring, progress updates and quiz
                                      functionality.
  -----------------------------------------------------------------------

The project is a browser-based frontend application. The supplied HTML
references `style.css` for styling and `script.js` for interactive
functionality.

## 6. Project Structure

The application is organized around the following files:

``` text
Affine-Cipher-Virtual-Lab/
│
├── index.html      # Main page structure and laboratory sections
├── style.css      # Styling and responsive layout
├── script.js      # Cipher logic and interactive functionality
└── README.md      # Project documentation
```

Keep all three application files in the same project folder so that the
stylesheet and JavaScript file are loaded correctly by the HTML page.

## 7. How to Run the Project

No installation of a backend server or package dependencies is required
for the described frontend application.

1.  Download or clone the project folder.
2.  Make sure `index.html`, `style.css` and `script.js` are present in
    the same folder.
3.  Open the `index.html` file in a modern web browser.
4.  Use the navigation tabs to explore the Overview, Theory, Encryption,
    Decryption, Cryptanalysis, Security Insights and Assessment
    sections.

## 8. How to Use the Virtual Lab

1.  Open **Overview** to understand the experiment's aim and workflow.
2.  Visit **Theory** to learn the formulas, key conditions and alphabet
    mapping.
3.  Open **Encryption**, enter plaintext, choose valid values of `a` and
    `b`, and click **Encrypt**.
4.  Check the ciphertext and the step-by-step calculation table.
5.  Open **Decryption**, enter ciphertext and the same key values, and
    click **Decrypt** to recover the plaintext.
6.  Open **Cryptanalysis**, enter ciphertext and click **Start
    Cryptanalysis** to test all 312 valid keys and rank the candidates.
7.  Visit **Security Insights** to understand why the cipher can be
    attacked.
8.  Complete the **Assessment** quiz to test your understanding.

## 9. Learning Outcomes

After completing the experiment, users should be able to:

-   Explain how the Affine Cipher works.
-   Apply modular arithmetic to encrypt and decrypt messages.
-   Determine whether a key is valid using the GCD condition.
-   Calculate a modular multiplicative inverse.
-   Explain how brute-force cryptanalysis tests possible keys.
-   Describe how n-gram scoring helps rank candidate plaintexts.
-   Identify why the Affine Cipher is not secure for modern
    communication.

## 10. Limitations

-   The Affine Cipher has a small keyspace of only 312 valid keys,
    making brute-force attacks practical.
-   It is a monoalphabetic substitution cipher and preserves statistical
    patterns in the underlying language.
-   N-gram scoring ranks candidates based on an English-language
    frequency model; the top-ranked result is not guaranteed to be
    correct.
-   The Affine Cipher is intended here for educational demonstration and
    should not be used to protect real-world sensitive information.

## 11. References

1.  William Stallings, *Cryptography and Network Security*.
2.  Douglas Stinson, *Cryptography: Theory and Practice*.

------------------------------------------------------------------------

**Developed as an interactive virtual laboratory for studying the Affine
Cipher and its cryptographic properties.**
