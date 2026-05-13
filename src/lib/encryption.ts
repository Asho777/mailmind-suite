import crypto from 'crypto';

// Read the encryption key directly from the .env file
// The key should be 32 characters long for AES-256
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long.');
  }
  return Buffer.from(key, 'utf-8');
};

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;

export const encryptPassword = (plainText: string): string => {
  if (!plainText) return plainText;
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:salt:authTag:encryptedData
  return `${iv.toString('hex')}:${salt.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptPassword = (encryptedText: string): string => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

  const key = getEncryptionKey();
  const parts = encryptedText.split(':');
  
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const salt = Buffer.from(parts[1], 'hex');
  const authTag = Buffer.from(parts[2], 'hex');
  const encryptedData = parts[3];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
