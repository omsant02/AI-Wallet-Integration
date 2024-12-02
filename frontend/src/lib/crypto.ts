// Handles all cryptographic operations

export class CryptoService {
    private static readonly SALT_LENGTH = 16;
    private static readonly IV_LENGTH = 12;
    private static readonly KEY_LENGTH = 256;
    private static readonly ITERATION_COUNT = 100000;
  
    // Generate a secure encryption key from password
    static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
  
      // Import password as raw key material
      const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
      );
  
      // Derive actual encryption key using PBKDF2
      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.ITERATION_COUNT,
          hash: 'SHA-256'
        },
        baseKey,
        {
          name: 'AES-GCM',
          length: this.KEY_LENGTH
        },
        false,
        ['encrypt', 'decrypt']
      );
    }
  
    // Encrypt data with derived key
    static async encrypt(data: string, key: CryptoKey): Promise<{
      encrypted: ArrayBuffer;
      iv: Uint8Array;
    }> {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
  
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        dataBuffer
      );
  
      return { encrypted, iv };
    }
  
    // Decrypt data with derived key
    static async decrypt(
      encrypted: ArrayBuffer,
      key: CryptoKey,
      iv: Uint8Array
    ): Promise<string> {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encrypted
      );
  
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    }
  
    // Generate random salt
    static generateSalt(): Uint8Array {
      return crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    }
  }