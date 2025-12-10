const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Generate session token
const generateSessionToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Store session in Redis
const storeSession = async (token, userId) => {
  try {
    const sessionData = JSON.stringify({
      userId: userId,
      createdAt: Date.now(),
    });
    const expiry = parseInt(process.env.SESSION_EXPIRY) || 3600; // Default 1 hour
    await redisClient.setEx(`session:${token}`, expiry, sessionData);
    return true;
  } catch (error) {
    console.error('Redis store session error:', error);
    return false;
  }
};

// Get session from Redis
const getSession = async (token) => {
  try {
    const sessionData = await redisClient.get(`session:${token}`);
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  } catch (error) {
    console.error('Redis get session error:', error);
    return null;
  }
};

// Delete session from Redis
const deleteSession = async (token) => {
  try {
    await redisClient.del(`session:${token}`);
    return true;
  } catch (error) {
    console.error('Redis delete session error:', error);
    return false;
  }
};

// Verify session token
const verifySession = async (token) => {
  const session = await getSession(token);
  if (session && session.userId) {
    return session.userId;
  }
  return false;
};

module.exports = {
  redisClient,
  generateSessionToken,
  storeSession,
  getSession,
  deleteSession,
  verifySession,
};

