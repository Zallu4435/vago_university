import { IHttpRequest, IHttpResponse, HttpErrors, HttpSuccess, ITransactionLockController } from "../IHttp";
import { TransactionLockService } from '../../../infrastructure/services/TransactionLockService';

export class TransactionLockController implements ITransactionLockController {
  private lockService: TransactionLockService;
  private httpErrors: HttpErrors;
  private httpSuccess: HttpSuccess;

  constructor() {
    this.lockService = TransactionLockService.getInstance();
    this.httpErrors = new HttpErrors();
    this.httpSuccess = new HttpSuccess();
  }

  async acquireLock(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:acquireLock] Request received:', {
        transactionType: httpRequest.body?.transactionType,
        transactionId: httpRequest.body?.transactionId,
        userId: httpRequest.user?.userId,
        tabId: httpRequest.body?.tabId,
        userAgent: httpRequest.headers?.['user-agent']
      });
      
      const { transactionType, transactionId, tabId } = httpRequest.body || {};
      const userId = httpRequest.user?.userId;

      if (!userId) {
        console.warn('[TransactionLockController:acquireLock] Unauthorized - missing user ID');
        return this.httpErrors.error_401('User not authenticated');
      }

      if (!transactionType) {
        console.warn('[TransactionLockController:acquireLock] Bad request - missing transaction type');
        return this.httpErrors.error_400('Transaction type is required');
      }

      console.log(`[TransactionLockController:acquireLock] Attempting to acquire lock for user ${userId}, transaction ${transactionType}:${transactionId || 'global'}`);
      
      const result = this.lockService.acquireLock(
        userId,
        transactionType,
        transactionId,
        tabId,
        httpRequest.headers?.['user-agent'] as string
      );

      if (result.success) {
        console.log(`[TransactionLockController:acquireLock] Lock acquired successfully: ${result.lockId}`);
        return this.httpSuccess.success_200({
          lockId: result.lockId,
          message: 'Lock acquired successfully'
        });
      } else {
        console.warn(`[TransactionLockController:acquireLock] Lock acquisition failed: ${result.error}`);
        return this.httpErrors.error_423(result.error, result.existingLock);
      }
    } catch (error) {
      console.error('[TransactionLockController:acquireLock] Error:', error);
      return this.httpErrors.error_500('Error acquiring lock');
    }
  }

  async releaseLock(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:releaseLock] Request received:', {
        body: httpRequest.body,
        userId: httpRequest.user?.userId,
        headers: {
          contentType: httpRequest.headers?.['content-type'],
          xRequestedWith: httpRequest.headers?.['x-requested-with']
        }
      });
      
      const { transactionType, transactionId, lockId } = httpRequest.body || {};
      const userId = httpRequest.user?.userId;

      // Special handling for navigator.sendBeacon or sync XHR during page unload
      // These might not have proper auth, so we'll need to be more lenient
      const isPageUnload = httpRequest.headers?.['content-type']?.includes('application/json') && 
                         !httpRequest.headers?.['x-requested-with'];
                         
      if (!userId && !isPageUnload) {
        console.warn('[TransactionLockController:releaseLock] Unauthenticated lock release attempt rejected');
        return this.httpErrors.error_401('User not authenticated');
      }

      if (!transactionType) {
        console.warn('[TransactionLockController:releaseLock] Missing transaction type in release request');
        return this.httpErrors.error_400('Transaction type is required');
      }

      if (!lockId) {
        console.warn('[TransactionLockController:releaseLock] Missing lockId in release request');
        return this.httpErrors.error_400('Lock ID is required');
      }

      // If this is a page unload request, extract userId from the lockId
      // This is a workaround for auth issues during page unload
      let effectiveUserId = userId;
      if (!effectiveUserId && isPageUnload && lockId) {
        const lock = this.lockService.getLockInfoByLockId(lockId);
        if (lock) {
          console.log(`[TransactionLockController:releaseLock] Found lock during page unload. Lock userId: ${lock.userId}`);
          effectiveUserId = lock.userId;
        }
      }

      if (!effectiveUserId) {
        console.warn('[TransactionLockController:releaseLock] Could not determine user for lock release');
        return this.httpErrors.error_400('Could not determine user for lock');
      }

      console.log(`[TransactionLockController:releaseLock] Attempting to release lock: User ${effectiveUserId}, Type ${transactionType}, ID ${transactionId || 'global'}, LockID ${lockId}`);
      
      const released = this.lockService.releaseLock(
        effectiveUserId,
        transactionType,
        transactionId,
        lockId
      );

      console.log(`[TransactionLockController:releaseLock] Lock release result: ${released ? 'SUCCESS' : 'FAILED'}`);

      if (released) {
        return this.httpSuccess.success_200({
          message: 'Lock released successfully'
        });
      } else {
        console.warn('[TransactionLockController:releaseLock] Lock release failed, lock not found or invalid');
        return this.httpErrors.error_404('Lock not found or invalid');
      }
    } catch (error) {
      console.error('[TransactionLockController:releaseLock] Error:', error);
      return this.httpErrors.error_500('Error releasing lock');
    }
  }

  async checkLockStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:checkLockStatus] Request received:', {
        transactionType: httpRequest.query?.transactionType,
        transactionId: httpRequest.query?.transactionId,
        userId: httpRequest.user?.userId
      });
      
      const { transactionType, transactionId } = httpRequest.query || {};
      const userId = httpRequest.user?.userId;

      if (!userId) {
        console.warn('[TransactionLockController:checkLockStatus] Unauthorized - missing user ID');
        return this.httpErrors.error_401('User not authenticated');
      }

      if (!transactionType) {
        console.warn('[TransactionLockController:checkLockStatus] Bad request - missing transaction type');
        return this.httpErrors.error_400('Transaction type is required');
      }

      const isLocked = this.lockService.isLocked(
        userId,
        transactionType as string,
        transactionId as string | undefined
      );

      const lockInfo = isLocked 
        ? this.lockService.getLockInfo(userId, transactionType as string, transactionId as string | undefined)
        : undefined;

      console.log(`[TransactionLockController:checkLockStatus] Lock status for user ${userId}, transaction ${transactionType}:${transactionId || 'global'}: ${isLocked ? 'LOCKED' : 'UNLOCKED'}`);
      
      return this.httpSuccess.success_200({
        isLocked,
        lockInfo: lockInfo ? {
          createdAt: lockInfo.createdAt,
          expiresAt: lockInfo.expiresAt,
          tabId: lockInfo.tabId
        } : undefined
      });
    } catch (error) {
      console.error('[TransactionLockController:checkLockStatus] Error:', error);
      return this.httpErrors.error_500('Error checking lock status');
    }
  }

  async extendLock(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:extendLock] Request received:', {
        transactionType: httpRequest.body?.transactionType,
        transactionId: httpRequest.body?.transactionId,
        lockId: httpRequest.body?.lockId,
        userId: httpRequest.user?.userId
      });
      
      const { transactionType, transactionId, lockId } = httpRequest.body || {};
      const userId = httpRequest.user?.userId;

      if (!userId) {
        console.warn('[TransactionLockController:extendLock] Unauthorized - missing user ID');
        return this.httpErrors.error_401('User not authenticated');
      }

      if (!transactionType || !lockId) {
        console.warn('[TransactionLockController:extendLock] Bad request - missing required parameters');
        return this.httpErrors.error_400('Transaction type and lock ID are required');
      }

      console.log(`[TransactionLockController:extendLock] Attempting to extend lock: User ${userId}, Type ${transactionType}, ID ${transactionId || 'global'}, LockID ${lockId}`);
      
      const extended = this.lockService.extendLock(
        userId,
        transactionType,
        transactionId,
        lockId
      );

      console.log(`[TransactionLockController:extendLock] Lock extension result: ${extended ? 'SUCCESS' : 'FAILED'}`);

      if (extended) {
        return this.httpSuccess.success_200({
          message: 'Lock extended successfully'
        });
      } else {
        console.warn('[TransactionLockController:extendLock] Lock extension failed, lock not found or expired');
        return this.httpErrors.error_404('Lock not found or expired');
      }
    } catch (error) {
      console.error('[TransactionLockController:extendLock] Error:', error);
      return this.httpErrors.error_500('Error extending lock');
    }
  }

  // Admin endpoints
  async getAllLocks(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:getAllLocks] Request received from user:', httpRequest.user?.userId);
      
      const userId = httpRequest.user?.userId;
      const isAdmin = httpRequest.user?.collection === 'admin';

      if (!userId || !isAdmin) {
        console.warn('[TransactionLockController:getAllLocks] Unauthorized access attempt');
        return this.httpErrors.error_403('Unauthorized access');
      }

      const locks = this.lockService.getAllLocks();
      console.log(`[TransactionLockController:getAllLocks] Returning ${locks.length} locks`);

      return this.httpSuccess.success_200({
        locks
      });
    } catch (error) {
      console.error('[TransactionLockController:getAllLocks] Error:', error);
      return this.httpErrors.error_500('Error getting all locks');
    }
  }

  async forceReleaseUserLocks(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      console.log('[TransactionLockController:forceReleaseUserLocks] Request received:', {
        adminId: httpRequest.user?.userId,
        targetUserId: httpRequest.params?.userId
      });
      
      const adminId = httpRequest.user?.userId;
      const isAdmin = httpRequest.user?.collection === 'admin';
      const { userId } = httpRequest.params || {};

      if (!adminId || !isAdmin) {
        console.warn('[TransactionLockController:forceReleaseUserLocks] Unauthorized access attempt');
        return this.httpErrors.error_403('Unauthorized access');
      }

      if (!userId) {
        console.warn('[TransactionLockController:forceReleaseUserLocks] Missing user ID parameter');
        return this.httpErrors.error_400('User ID is required');
      }

      console.log(`[TransactionLockController:forceReleaseUserLocks] Admin ${adminId} is force-releasing locks for user ${userId}`);
      
      const releasedCount = this.lockService.forceReleaseUserLocks(userId);
      console.log(`[TransactionLockController:forceReleaseUserLocks] Released ${releasedCount} locks for user ${userId}`);

      return this.httpSuccess.success_200({
        message: `Released ${releasedCount} locks for user ${userId}`,
        releasedCount
      });
    } catch (error) {
      console.error('[TransactionLockController:forceReleaseUserLocks] Error:', error);
      return this.httpErrors.error_500('Error force releasing user locks');
    }
  }
} 