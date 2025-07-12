/**
 * TransactionLockService.ts
 * 
 * A service to manage transaction locks to prevent concurrent operations 
 * from the same user across different browser tabs.
 */

import { v4 as uuidv4 } from 'uuid';

// Interface for lock information
interface LockInfo {
  lockId: string;
  userId: string;
  transactionType: string;
  transactionId?: string;
  tabId?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

// Result of a lock acquisition attempt
interface LockResult {
  success: boolean;
  lockId?: string;
  error?: string;
  existingLock?: Omit<LockInfo, 'userAgent'>;
}

/**
 * Service to manage transaction locks.
 * Implemented as a singleton to ensure a single instance across the application.
 */
export class TransactionLockService {
  private static instance: TransactionLockService;
  private locks: Map<string, LockInfo>; // lockId -> LockInfo
  private locksByUser: Map<string, Set<string>>; // userId -> Set of lockIds
  private locksByTransaction: Map<string, string>; // transactionKey -> lockId
  private readonly defaultLockDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {
    this.locks = new Map();
    this.locksByUser = new Map();
    this.locksByTransaction = new Map();
    
    // Start the cleanup interval
    setInterval(() => this.cleanupExpiredLocks(), 60 * 1000); // Run every minute
  }

  /**
   * Get the singleton instance of the TransactionLockService
   */
  public static getInstance(): TransactionLockService {
    if (!TransactionLockService.instance) {
      TransactionLockService.instance = new TransactionLockService();
    }
    return TransactionLockService.instance;
  }

  /**
   * Generate a unique transaction key
   */
  private getTransactionKey(userId: string, transactionType: string, transactionId?: string): string {
    return `${userId}:${transactionType}:${transactionId || 'global'}`;
  }

  /**
   * Acquire a lock for a specific transaction
   */
  public acquireLock(
    userId: string,
    transactionType: string,
    transactionId?: string,
    tabId?: string,
    userAgent?: string
  ): LockResult {
    const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);

    // Check if there's already a lock for this transaction
    const existingLockId = this.locksByTransaction.get(transactionKey);
    if (existingLockId) {
      const existingLock = this.locks.get(existingLockId);
      
      // If there's a lock but it has expired, remove it and allow new lock
      if (existingLock && existingLock.expiresAt < new Date()) {
        this.releaseLock(userId, transactionType, transactionId, existingLockId);
      } 
      // If there's a valid lock and it's from the same tab, refresh and return success
      else if (existingLock && existingLock.tabId === tabId && tabId) {
        // Extend the lock
        const newExpiresAt = new Date(Date.now() + this.defaultLockDuration);
        existingLock.expiresAt = newExpiresAt;
        
        return {
          success: true,
          lockId: existingLockId
        };
      }
      // Otherwise, there's an active lock from another tab
      else if (existingLock) {
        return {
          success: false,
          error: `Transaction is already being processed in ${existingLock.tabId ? 'another tab' : 'another session'}`,
          existingLock: {
            lockId: existingLock.lockId,
            userId: existingLock.userId,
            transactionType: existingLock.transactionType,
            transactionId: existingLock.transactionId,
            tabId: existingLock.tabId,
            createdAt: existingLock.createdAt,
            expiresAt: existingLock.expiresAt
          }
        };
      }
    }

    // Create a new lock
    const lockId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.defaultLockDuration);
    
    const lockInfo: LockInfo = {
      lockId,
      userId,
      transactionType,
      transactionId,
      tabId,
      userAgent,
      createdAt: now,
      expiresAt
    };

    // Store the lock
    this.locks.set(lockId, lockInfo);
    
    // Add to user's locks
    if (!this.locksByUser.has(userId)) {
      this.locksByUser.set(userId, new Set());
    }
    this.locksByUser.get(userId)!.add(lockId);
    
    // Map transaction key to lock ID
    this.locksByTransaction.set(transactionKey, lockId);
    
    return {
      success: true,
      lockId
    };
  }

  /**
   * Release a lock
   */
  public releaseLock(
    userId: string,
    transactionType: string,
    transactionId?: string,
    lockId?: string
  ): boolean {
    if (lockId) {
      // If lockId is provided, use it to find and release the lock
      const lock = this.locks.get(lockId);
      if (!lock || lock.userId !== userId) {
        return false;
      }
      
      // Remove the lock
      this.locks.delete(lockId);
      
      // Remove from user's locks
      const userLocks = this.locksByUser.get(userId);
      if (userLocks) {
        userLocks.delete(lockId);
        if (userLocks.size === 0) {
          this.locksByUser.delete(userId);
        }
      }
      
      // Remove from transaction map
      const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);
      if (this.locksByTransaction.get(transactionKey) === lockId) {
        this.locksByTransaction.delete(transactionKey);
      }
      
      return true;
    } else {
      // If lockId is not provided, use transaction info to find and release the lock
      const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);
      const existingLockId = this.locksByTransaction.get(transactionKey);
      
      if (!existingLockId) {
        return false;
      }
      
      return this.releaseLock(userId, transactionType, transactionId, existingLockId);
    }
  }

  /**
   * Check if a transaction is locked
   */
  public isLocked(
    userId: string,
    transactionType: string,
    transactionId?: string
  ): boolean {
    const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);
    const lockId = this.locksByTransaction.get(transactionKey);
    
    if (!lockId) {
      return false;
    }
    
    const lock = this.locks.get(lockId);
    if (!lock) {
      // Lock reference exists but actual lock is missing - clean up
      this.locksByTransaction.delete(transactionKey);
      return false;
    }
    
    // Check if the lock has expired
    if (lock.expiresAt < new Date()) {
      // If it's expired, release it
      this.releaseLock(userId, transactionType, transactionId, lockId);
      return false;
    }
    
    return true;
  }

  /**
   * Get information about a lock
   */
  public getLockInfo(
    userId: string,
    transactionType: string,
    transactionId?: string
  ): Omit<LockInfo, 'userAgent'> | null {
    const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);
    const lockId = this.locksByTransaction.get(transactionKey);
    
    if (!lockId) {
      return null;
    }
    
    const lock = this.locks.get(lockId);
    if (!lock || lock.expiresAt < new Date()) {
      return null;
    }
    
    // Return lock info without userAgent for privacy/security
    const { userAgent, ...lockInfo } = lock;
    return lockInfo;
  }

  /**
   * Get lock information by lockId
   */
  public getLockInfoByLockId(lockId: string): Omit<LockInfo, 'userAgent'> | null {
    const lock = this.locks.get(lockId);
    
    if (!lock || lock.expiresAt < new Date()) {
      return null;
    }
    
    // Return lock info without userAgent for privacy/security
    const { userAgent, ...lockInfo } = lock;
    return lockInfo;
  }

  /**
   * Extend an existing lock
   */
  public extendLock(
    userId: string,
    transactionType: string,
    transactionId?: string,
    lockId?: string
  ): boolean {
    let targetLockId = lockId;
    
    if (!targetLockId) {
      const transactionKey = this.getTransactionKey(userId, transactionType, transactionId);
      targetLockId = this.locksByTransaction.get(transactionKey);
      
      if (!targetLockId) {
        return false;
      }
    }
    
    const lock = this.locks.get(targetLockId);
    if (!lock || lock.userId !== userId || lock.expiresAt < new Date()) {
      return false;
    }
    
    // Extend the lock
    lock.expiresAt = new Date(Date.now() + this.defaultLockDuration);
    return true;
  }

  /**
   * Clean up expired locks
   */
  private cleanupExpiredLocks(): void {
    const now = new Date();
    const expiredLocks: string[] = [];
    
    // Find expired locks
    this.locks.forEach((lock, lockId) => {
      if (lock.expiresAt < now) {
        expiredLocks.push(lockId);
      }
    });
    
    // Remove expired locks
    expiredLocks.forEach(lockId => {
      const lock = this.locks.get(lockId);
      if (lock) {
        const transactionKey = this.getTransactionKey(
          lock.userId, 
          lock.transactionType, 
          lock.transactionId
        );
        
        // Remove from locks map
        this.locks.delete(lockId);
        
        // Remove from user's locks
        const userLocks = this.locksByUser.get(lock.userId);
        if (userLocks) {
          userLocks.delete(lockId);
          if (userLocks.size === 0) {
            this.locksByUser.delete(lock.userId);
          }
        }
        
        // Remove from transaction map if it points to this lock
        if (this.locksByTransaction.get(transactionKey) === lockId) {
          this.locksByTransaction.delete(transactionKey);
        }
      }
    });
    
    if (expiredLocks.length > 0) {
      console.log(`[TransactionLockService] Cleaned up ${expiredLocks.length} expired locks`);
    }
  }

  /**
   * Get all locks (for admin purposes)
   */
  public getAllLocks(): Array<Omit<LockInfo, 'userAgent'>> {
    const result: Array<Omit<LockInfo, 'userAgent'>> = [];
    
    this.locks.forEach(lock => {
      const { userAgent, ...lockInfo } = lock;
      result.push(lockInfo);
    });
    
    return result;
  }

  /**
   * Force release all locks for a specific user
   */
  public forceReleaseUserLocks(userId: string): number {
    const userLocks = this.locksByUser.get(userId);
    if (!userLocks || userLocks.size === 0) {
      return 0;
    }
    
    const lockIds = [...userLocks];
    let count = 0;
    
    lockIds.forEach(lockId => {
      const lock = this.locks.get(lockId);
      if (lock) {
        const transactionKey = this.getTransactionKey(
          lock.userId, 
          lock.transactionType, 
          lock.transactionId
        );
        
        // Remove from locks map
        this.locks.delete(lockId);
        
        // Remove from transaction map if it points to this lock
        if (this.locksByTransaction.get(transactionKey) === lockId) {
          this.locksByTransaction.delete(transactionKey);
        }
        
        count++;
      }
    });
    
    // Clear user's locks
    this.locksByUser.delete(userId);
    
    return count;
  }
} 