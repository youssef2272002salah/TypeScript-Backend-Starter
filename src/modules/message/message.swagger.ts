/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMessageDto:
 *       type: object
 *       required:
 *         - content
 *         - chatId
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the message
 *           example: Hello, how are you?
 *         chatId:
 *           type: string
 *           description: The ID of the chat where the message will be sent
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the message
 *           example: 6423f1a2b1c2d3e4f5g6h7i9
 *         sender:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The ID of the sender
 *               example: 6423f1a2b1c2d3e4f5g6h7i8
 *             name:
 *               type: string
 *               description: The name of the sender
 *               example: John Doe
 *             email:
 *               type: string
 *               description: The email of the sender
 *               example: johndoe@example.com
 *         content:
 *           type: string
 *           description: The content of the message
 *           example: Hello, how are you?
 *         chat:
 *           type: object
 *           description: The chat object where the message belongs
 *         readBy:
 *           type: array
 *           items:
 *             type: object
 *             description: The users who have read the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time when the message was last updated
 *
 * paths:
 *   /api/v1/messages/{chatId}:
 *     get:
 *       summary: Get all messages in a chat
 *       tags:
 *         - Messages
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: chatId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the chat
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *       responses:
 *         200:
 *           description: List of messages retrieved successfully
 *           content:
 *             application/json:
 *               example:
 *                 - _id: 6423f1a2b1c2d3e4f5g6h7i9
 *                   sender:
 *                     _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                     name: John Doe
 *                     email: johndoe@example.com
 *                   content: Hello, how are you?
 *                   chat:
 *                     _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                   readBy: []
 *                   createdAt: 2025-03-22T12:00:00.000Z
 *                   updatedAt: 2025-03-22T12:00:00.000Z
 *         400:
 *           description: Chat ID is required
 *           content:
 *             application/json:
 *               example:
 *                 status: fail
 *                 message: Chat ID is required
 *
 *   /api/v1/messages:
 *     post:
 *       summary: Send a message in a chat
 *       tags:
 *         - Messages
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateMessageDto'
 *       responses:
 *         200:
 *           description: Message sent successfully
 *           content:
 *             application/json:
 *               example:
 *                 _id: 6423f1a2b1c2d3e4f5g6h7i9
 *                 sender:
 *                   _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                   name: John Doe
 *                   email: johndoe@example.com
 *                 content: Hello, how are you?
 *                 chat:
 *                   _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                 readBy: []
 *                 createdAt: 2025-03-22T12:00:00.000Z
 *                 updatedAt: 2025-03-22T12:00:00.000Z
 *         400:
 *           description: Message content and chat ID are required
 *           content:
 *             application/json:
 *               example:
 *                 status: fail
 *                 message: Message content and chat ID are required
 */
