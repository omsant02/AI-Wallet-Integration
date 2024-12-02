import { CryptoService } from "./crypto";
import { StorageService } from "./storage";

// Main authentication service

export class AuthService {
    // Register a new user
    static async register(username: string, password: string, userData: any): Promise<void> {
      // Check if user already exists
      const existingUser = await StorageService.getUser(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }
  
      // Generate salt and derive key
      const salt = CryptoService.generateSalt();
      const key = await CryptoService.deriveKey(password, salt);
  
      // Encrypt user data
      const { encrypted, iv } = await CryptoService.encrypt(
        JSON.stringify(userData),
        key
      );
  
      // Save encrypted data
      await StorageService.saveUser({
        username,
        encryptedData: encrypted,
        salt,
        iv
      });
    }
  
    // Login user
    static async login(username: string, password: string): Promise<any> {
      // Get user data
      const userData = await StorageService.getUser(username);
      if (!userData) {
        throw new Error('User not found');
      }
  
      // Derive key and decrypt
      const key = await CryptoService.deriveKey(password, userData.salt);
      try {
        const decrypted = await CryptoService.decrypt(
          userData.encryptedData.buffer,
          key,
          userData.iv
        );
        return JSON.parse(decrypted);
      } catch (error) {
        throw new Error('Invalid password');
      }
    }
  }