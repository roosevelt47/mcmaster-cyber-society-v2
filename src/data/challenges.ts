// Daily challenges. Answers are stored as salted SHA-256 hashes so view-source does not spoil them.
// TO ADD ONE: pick a unique id, then run `node scripts/hash-answer.mjs <id> "<answer>"` and paste the hash.
// Note: hashing deters casual spoilers. A determined person can still brute-force short answers.

export interface Challenge {
  id: string;
  title: string;
  category: string;
  /** 1 (easiest) to 3. */
  difficulty: 1 | 2 | 3;
  prompt: string;
  /** The puzzle itself: ciphertext, encoded string, etc. */
  data: string;
  hint: string;
  /** sha256(`${id}|${normalizedAnswer}`) as lowercase hex. */
  answerHash: string;
}

export const CHALLENGES: readonly Challenge[] = [
  {
    "id": "base64-welcome",
    "title": "Hello, Base64",
    "category": "Encoding",
    "difficulty": 1,
    "prompt": "This message was encoded with Base64. Decode it.",
    "data": "d2VsY29tZSB0byBtYWMgY3liZXI=",
    "hint": "Base64 text often ends in = signs. Try CyberChef's 'From Base64'.",
    "answerHash": "01f3bc7681707592c0d6145a76710f392f297f5ef65d74a6a991f79b0104cd7f"
  },
  {
    "id": "caesar-3",
    "title": "Caesar's Secret",
    "category": "Classical crypto",
    "difficulty": 1,
    "prompt": "Julius Caesar shifted every letter by 3. Shift them back.",
    "data": "khoor kdfnhuv",
    "hint": "Move each letter 3 places backwards in the alphabet. k becomes h.",
    "answerHash": "553da7a85b651d6e20166aada09f0da9607a281991cae82a7d2a19fbc6f660fc"
  },
  {
    "id": "hex-flag",
    "title": "Hex Appeal",
    "category": "Encoding",
    "difficulty": 1,
    "prompt": "Every pair of hex digits is one ASCII character. What does this say?",
    "data": "666c61677b6865785f69735f656173797d",
    "hint": "66 is 'f'. Use 'From Hex' in CyberChef or an ASCII table.",
    "answerHash": "4ddc8938a9b69101c5d99ca2c408f835a277cff97e67d83d4107e328bb139fef"
  },
  {
    "id": "reversed",
    "title": "Backwards",
    "category": "Warm-up",
    "difficulty": 1,
    "prompt": "Somebody wrote the flag backwards. Read it the right way round.",
    "data": "}txet_desrever{galf",
    "hint": "Reverse the string. Python: s[::-1].",
    "answerHash": "43f48f98938c264306ef7c0ac5b0a5944f74f18b69abba15ba75a98852d112d5"
  },
  {
    "id": "binary-cyber",
    "title": "Ones and Zeros",
    "category": "Encoding",
    "difficulty": 1,
    "prompt": "Each group of 8 bits is one ASCII letter. Which word is this?",
    "data": "01100011 01111001 01100010 01100101 01110010",
    "hint": "01100011 is 99 in decimal, which is 'c'.",
    "answerHash": "1329fd50754141e72c7ec2d8f94ebe6b887d874ee53023ea99210e0e71289776"
  },
  {
    "id": "rot13-flag",
    "title": "Rot Thirteen",
    "category": "Classical crypto",
    "difficulty": 1,
    "prompt": "ROT13 shifts every letter by 13. Applying it twice gives the original.",
    "data": "synt{ebg13_pynffvp}",
    "hint": "Apply ROT13 again. Braces and digits are unchanged.",
    "answerHash": "86261b0c78e9ddf18c3746a746dd21c44ab09b2618d004445135911c73a4696a"
  },
  {
    "id": "morse-security",
    "title": "Dots and Dashes",
    "category": "Encoding",
    "difficulty": 2,
    "prompt": "Decode this Morse code. Letters are separated by spaces.",
    "data": "... . -.-. ..- .-. .. - -.--",
    "hint": "... is S, . is E, -.-. is C. Enter the word in lowercase letters.",
    "answerHash": "bceb97e1c32a967ce68b68dd3fa8a3e5557f4c1b823477ca9c72ae5f68586ea7"
  },
  {
    "id": "url-decode",
    "title": "Percent Encoded",
    "category": "Web",
    "difficulty": 1,
    "prompt": "Browsers encode special characters in URLs like this. Decode it.",
    "data": "flag%7Burl%20encoded%20%26%20safe%7D",
    "hint": "%20 is a space, %7B and %7D are braces. Try CyberChef's 'URL Decode'.",
    "answerHash": "b7cbb2b9dae033e8e503a277ad4d0287143fe0c5f98005695a3ca0278e9b2616"
  },
  {
    "id": "atbash-mac",
    "title": "Mirror, Mirror",
    "category": "Classical crypto",
    "difficulty": 2,
    "prompt": "In Atbash the alphabet is reversed: a becomes z, b becomes y, and so on.",
    "data": "nxnzhgvi",
    "hint": "Write the alphabet forwards and backwards on two lines and swap letters.",
    "answerHash": "d468799bc8c13051b0c7777cef5a26afd5ffa2d707141b042d591ad25c17fd9e"
  },
  {
    "id": "ascii-decimal",
    "title": "Decimal Codes",
    "category": "Encoding",
    "difficulty": 1,
    "prompt": "These are ASCII codes in decimal. What word do they spell?",
    "data": "104 97 99 107",
    "hint": "65 is 'A', 97 is 'a'. Python: chr(104).",
    "answerHash": "cee19c4c17fc33687f7696544e1c13424bb05ea80e43a69d0256ac50a9fbd426"
  },
  {
    "id": "double-base64",
    "title": "Layers",
    "category": "Encoding",
    "difficulty": 2,
    "prompt": "This was encoded more than once. Keep decoding until it makes sense.",
    "data": "Wm14aFozdHNZWGxsY25OZmIyWmZkR2hsWDI5dWFXOXVmUT09",
    "hint": "Decode it. If the result still looks like Base64, decode again.",
    "answerHash": "5dc31703854bd01ce427c84cac127fffe59a0fa37db9a7f19d4801a6a9452dec"
  },
  {
    "id": "caesar-brute",
    "title": "Unknown Shift",
    "category": "Classical crypto",
    "difficulty": 2,
    "prompt": "A Caesar cipher, but this time nobody told you the shift. There are only 25 options.",
    "data": "mshn{iybal_mvyjl_pa}",
    "hint": "Try every shift. CyberChef's 'ROT13' operation lets you set the amount.",
    "answerHash": "6c3242a0e9bad15f1e886259922ab648953b1a97f2bc6ece3f6e9e4792bed7ff"
  },
  {
    "id": "vigenere-lemon",
    "title": "Vigenère",
    "category": "Classical crypto",
    "difficulty": 3,
    "prompt": "A Vigenère cipher with the key LEMON. Decrypt it. Letters only, no spaces.",
    "data": "lxfopvefrnhr",
    "hint": "Each letter is shifted by the matching letter of the repeating key: L=11, E=4, M=12, O=14, N=13.",
    "answerHash": "83aeee12a6f8b7c01be68d8ee635d41c5c6787db446fd0bcfa4a625deb4fb83a"
  },
  {
    "id": "leetspeak",
    "title": "1337",
    "category": "Warm-up",
    "difficulty": 1,
    "prompt": "Translate from leetspeak back to plain English.",
    "data": "h4ck th3 pl4n3t",
    "hint": "4 is a, 3 is e, 1 is l or i, 0 is o.",
    "answerHash": "930132686927b72d708c4a92cf05fc277b2b6a4234d468264356234e6f330b6a"
  }
];
