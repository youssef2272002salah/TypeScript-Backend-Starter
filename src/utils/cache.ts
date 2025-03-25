import redis from '../config/redis';
import { logger } from '../utils/logging';

/**
 * Retrieves cached data by key.
 * @param key - The cache key
 * @returns Parsed JSON data or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`❌ Redis GET Error for key: ${key}`, error);
    return null; // Fails gracefully without crashing
  }
}

/**
 * Sets cache with an expiration time.
 * @param key - The cache key
 * @param value - The value to store (automatically stringified)
 * @param ttl - Time to live in seconds (default: 60s)
 */
export async function setCache(key: string, value: unknown, ttl: number = 60): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
    logger.info(`✅ Cache set: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error(`❌ Redis SET Error for key: ${key}`, error);
  }
}

/**
 * Clears specific keys from cache (supports regex).
 * @param pattern - Exact string or RegExp pattern to match keys.
 */
export async function clearCache(pattern: string | RegExp): Promise<void> {
  try {
    if (typeof pattern === 'string') {
      await redis.del(pattern);
      logger.info(`🗑 Cache cleared: ${pattern}`);
    } else {
      const keys = await redis.keys('*'); // Get all keys
      const matchedKeys = keys.filter((key) => pattern.test(key)); // Filter matching keys
      if (matchedKeys.length > 0) {
        await redis.del(...matchedKeys);
        logger.info(
          `🗑 Cache cleared for pattern: ${pattern}, Matched Keys: ${matchedKeys.length}`,
        );
      }
    }
  } catch (error) {
    logger.error(`❌ Redis CLEAR Error for pattern: ${pattern}`, error);
  }
}

/**
 * Clears all cached data.
 */
export async function clearAllCache(): Promise<void> {
  try {
    await redis.flushall();
    logger.info('🗑 All cache cleared!');
  } catch (error) {
    logger.error('❌ Redis FLUSHALL Error', error);
  }
}
