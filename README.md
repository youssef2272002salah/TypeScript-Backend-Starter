TypeScript-Backend-Starter🚀
This project is a modular backend template built with Node.js, TypeScript, and Express, designed to provide a scalable and maintainable starting point for any backend application. It follows best practices for authentication, real-time messaging, file handling, caching, error handling, and documentation.

Key Features
Modular Architecture – Ensures scalability, maintainability, and easy feature expansion.

Authentication & OAuth – Secure user management with JWT and social login via Google & Facebook.

Real-Time Messaging – Private and group chat with WebSockets (Socket.io) and Redis for caching and event-driven communication.

File Handling & PDF Parsing – Users can upload and parse PDFs using Multer & pdf-parse for AI-powered content analysis.

AI-Powered Analysis – Integrated AI capabilities for advanced content processing.

Error Handling – Centralized error-handling mechanism to provide consistent and informative error responses.

Caching with Redis – Optimized performance using Redis for caching frequently accessed data and reducing database load.

Security Best Practices – Implements CSRF protection, rate limiting, and NoSQL injection prevention to enhance security.

Logging & Monitoring – Winston & Logtail provide structured, cloud-based logging for better system insights.

API Documentation – Well-documented APIs with Swagger (OpenAPI) and Postman collections for easy integration and testing.

Built with a clean and modular structure, this backend is easy to extend, scale, and maintain, making it ideal for complex applications requiring real-time interactions, secure authentication,efficient caching, and comprehensive documentation. 🚀

API Routes 🌍
Authentication Routes 🔑
Method	Endpoint	Description
POST	/api/v1/auth/signup	Register a new user
POST	/api/v1/auth/login	Authenticate user and return token
GET	/api/v1/auth/logout	Logout user
POST	/api/v1/auth/refresh	Refresh access token
POST	/api/v1/auth/resend-verification-email	Resend email verification
GET	/api/v1/auth/verify-email	Verify email
POST	/api/v1/auth/forgot-password	Request password reset
PATCH	/api/v1/auth/reset-password	Reset user password
PATCH	/api/v1/auth/update-password	Update user password
User Routes 👤
Method	Endpoint	Description
GET	/api/v1/users/me	Get logged-in user profile
PATCH	/api/v1/users/me	Update profile details
DELETE	/api/v1/users/me	Delete account
GET	/api/v1/users/	Get all users
GET	/api/v1/users/:id	Get user by ID (Admin)
DELETE	/api/v1/users/:id	Delete user (Admin)
PATCH	/api/v1/users/:id	Update user details (Admin)
Chat Routes 💬
Method	Endpoint	Description
POST	/api/v1/chat/	Start or access a chat
GET	/api/v1/chat/	Fetch all chats of user
POST	/api/v1/chat/group	Create a group chat
GET	/api/v1/chat/users	Get all users in a chat
PUT	/api/v1/chat/rename	Rename a group chat
PUT	/api/v1/chat/groupremove	Remove user from a group
PUT	/api/v1/chat/groupadd	Add user to a group
DELETE	/api/v1/chat/group	Delete a group chat
Message Routes 📩
Method	Endpoint	Description
GET	/api/v1/message/:chatId	Get all messages from a chat
POST	/api/v1/message/	Send a new message
Installation & Setup ⚙️
1. Clone the Repository
bash
Copy
git clone https://github.com/youssef2272002salah/TypeScript-Backend-Starter.git
cd graduation-project
2. Install Dependencies
bash
Copy
npm install
3. Set Up Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
REFRESH_SECRET=your_refresh_secret

DATABASE_URL=mongodb://localhost:27017/TypeScript-Backend-Starter

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/v1/auth/facebook/callback

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

BASE_URL=http://localhost:3000

LOGTAIL_API_KEY=your_logtail_api_key
LOGTAIL_ENDPOINT=https://your-logtail-endpoint
4. Run the Application
Development Mode
bash
Copy
npm run dev
Build & Start in Production
bash
Copy
npm run build
npm start
Redis Installation Guide with Docker 🐳
This guide provides step-by-step instructions for installing Docker and running Redis in a container for local development.

1. Install Docker
Windows & Mac
Download Docker Desktop: 👉 Docker Official Site

Install Docker by following the on-screen instructions.

Verify installation:

bash
Copy
docker --version
Linux (Ubuntu/Debian)
bash
Copy
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker --version
To avoid using sudo with Docker:

bash
Copy
sudo usermod -aG docker $USER
newgrp docker
2. Install Redis with Docker
bash
Copy
docker pull redis:latest
docker run --name redis-local -p 6379:6379 -d redis
Verify Redis is running:

bash
Copy
docker ps
Test Redis connection:

bash
Copy
docker exec -it redis-local redis-cli
Run:

bash
Copy
PING
If it replies PONG, Redis is working! 🎉

Issue Reporting 🛠️
If you find a bug or need help, please open an issue on GitHub Issues.

Use Postman for API Testing 📬
Link for Doucumentation: https://documenter.getpostman.com/view/39345066/2sAYkKJxaM

Use the endpoints listed above to test different features.

License 📜
This project is licensed under the ISC License.

