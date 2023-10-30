import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto";

export class Encrypter {
  algorithm: string;
  key: string;

  constructor(encryptionKey: string) {
    (this.algorithm = "aes-256-ctr"),
      (this.key = createHash("sha256")
        .update(String(encryptionKey))
        .digest("base64")
        .substring(0, 32));
  }

  encrypt(textToEncrypt: string) {
    const iv = randomBytes(16).toString("hex").slice(0, 16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(textToEncrypt, "utf8", "hex");
    return [encrypted + cipher.final("hex"), iv].join("|");
  }

  decrypt(encryptedText: string) {
    const [encrypted, iv] = encryptedText.split("|");

    if (!iv) {
      throw new Error("IV not found");
    }

    const decipher = createDecipheriv(this.algorithm, this.key, iv);

    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}
