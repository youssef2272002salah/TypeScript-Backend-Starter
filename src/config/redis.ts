import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: process.env.REDIS_PASSWORD   // Uncomment this line if you have a password
  retryStrategy: (times) => {
    if (times > 10) {
      return null;
    }
    return Math.min(times * 50, 2000);
  },
});

redis.on('error', (err) => {
  console.error('Redis Error:', err);
});

export default redis;
