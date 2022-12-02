import crypto from "crypto-js";

const encrypt = (plaintext: any, secret: any) => {
  const result = crypto.AES.encrypt(plaintext, secret);
  return result.toString();
};

const decrypt = (ciphertext: any, secret: any) => {
  const result = crypto.AES.decrypt(ciphertext, secret);
  return result.toString(crypto.enc.Utf8);
};

const generateSecret = () => {
  const buf = crypto.lib.WordArray.random(128);
  return buf.toString(crypto.enc.Base64);
};

export { encrypt, decrypt, generateSecret };
