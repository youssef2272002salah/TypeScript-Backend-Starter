import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction, Application } from 'express';

/**
 * Function to apply all security middleware in one place
 */
const applySecurityMiddleware = (app: Application) => {
  // 1. Helmet - Sets various HTTP headers for security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // Only allow resources from the same origin
          scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (use cautiously)
          objectSrc: ["'none'"], // Block <object>, <embed>, and <applet> elements
          upgradeInsecureRequests: [], // Forces HTTPS for all requests
        },
      },
      crossOriginEmbedderPolicy: true, // Prevents loading resources that don't allow cross-origin embedding
      crossOriginOpenerPolicy: true, // Protects against cross-origin attacks
      crossOriginResourcePolicy: { policy: 'same-origin' }, // Restricts resource sharing to the same origin
      referrerPolicy: { policy: 'no-referrer' }, // Removes referrer information to enhance privacy
    }),
  );

  // 2. Rate limiting - Limits the number of requests to prevent abuse and DDoS attacks
  const generalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour time window
    max: 50000000, // TODO: Adjust this limit for production use
    message: 'Too many requests, please try again later.', // Message shown when rate limit is exceeded
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes time window
    max: 10000000, // TODO: Adjust this limit for production use
    message: 'Too many login attempts, please try again later.', // Prevents brute-force attacks on authentication routes
  });

  // Apply rate limiting to authentication routes
  app.use('/api/v1/auth', authLimiter);
  // Apply general rate limiting to all API routes
  app.use('/api/v1', generalLimiter);

  // 3. Data sanitization - Prevents NoSQL injection and XSS attacks
  app.use(mongoSanitize()); // Removes MongoDB-specific query operators (e.g., `$gt`, `$or`)
  //   app.use(xss()); // Prevents XSS attacks by sanitizing user input (currently commented out)

  // 4. CORS - Controls which domains can access your API
  // const allowedOrigins = ['https://yourdomain.com', 'https://admin.yourdomain.com'];
  app.use(
    cors({
      // Dynamic origin checking (uncomment and set allowedOrigins for production)
      // origin: (origin, callback) => {
      //   if (!origin || allowedOrigins.includes(origin)) {
      //     callback(null, true);
      //   } else {
      //     callback(new Error('Not allowed by CORS'));
      //   }
      // },
      origin: true, // TODO: Allow all origins for now (should be restricted in production)
      credentials: true, // Allows cookies and authentication headers to be sent
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specifies allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Specifies allowed headers
    }),
  );

  // TODO: Add security headers for production use

  // 5. CSRF Protection - Prevents Cross-Site Request Forgery attacks
  // app.use(cookieParser()); // Required for reading CSRF tokens stored in cookies
  // app.use(csurf({ cookie: true })); // Enables CSRF protection, storing tokens in cookies

  // // Middleware to attach the CSRF token to every response
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken()); // Send CSRF token to frontend as a cookie
  //   next();
  // });

  console.log('Security middleware applied.');
};

export default applySecurityMiddleware;
