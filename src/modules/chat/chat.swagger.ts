/**
 * @swagger
 * components:
 *   schemas:
 *     CreateChatDto:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user to chat with
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *
 *     CreateGroupChatDto:
 *       type: object
 *       required:
 *         - userIds
 *         - chatName
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs to include in the group chat
 *           example: ["6423f1a2b1c2d3e4f5g6h7i8", "6423f1a2b1c2d3e4f5g6h7i9"]
 *         chatName:
 *           type: string
 *           description: Name of the group chat
 *           example: Project Team
 *
 *     RenameGroupDto:
 *       type: object
 *       required:
 *         - chatId
 *         - chatName
 *       properties:
 *         chatId:
 *           type: string
 *           description: ID of the group chat to rename
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *         chatName:
 *           type: string
 *           description: New name for the group chat
 *           example: New Project Team
 *
 *     ModifyGroupDto:
 *       type: object
 *       required:
 *         - chatId
 *         - userId
 *       properties:
 *         chatId:
 *           type: string
 *           description: ID of the group chat
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *         userId:
 *           type: string
 *           description: ID of the user to add or remove
 *           example: 6423f1a2b1c2d3e4f5g6h7i9
 *
 *     DeleteGroupDto:
 *       type: object
 *       required:
 *         - chatId
 *       properties:
 *         chatId:
 *           type: string
 *           description: ID of the group chat to delete
 *           example: 6423f1a2b1c2d3e4f5g6h7i8
 *
 * paths:
 *   /api/v1/chats:
 *     post:
 *       summary: Access or create a one-on-one chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateChatDto'
 *       responses:
 *         200:
 *           description: Chat retrieved or created successfully
 *           content:
 *             application/json:
 *               example:
 *                 _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                 chatName: sender
 *                 isGroupChat: false
 *                 users:
 *                   - id: 6423f1a2b1c2d3e4f5g6h7i8
 *                     fullname: John Doe
 *                     email: johndoe@example.com
 *                 latestMessage: null
 *         400:
 *           description: User ID is required
 *
 *   /api/v1/chats/group:
 *     post:
 *       summary: Create a new group chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateGroupChatDto'
 *       responses:
 *         200:
 *           description: Group chat created successfully
 *           content:
 *             application/json:
 *               example:
 *                 _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                 chatName: Project Team
 *                 isGroupChat: true
 *                 users:
 *                   - id: 6423f1a2b1c2d3e4f5g6h7i8
 *                     fullname: John Doe
 *                     email: johndoe@example.com
 *                   - id: 6423f1a2b1c2d3e4f5g6h7i9
 *                     fullname: Jane Smith
 *                     email: janesmith@example.com
 *                 groupAdmin:
 *                   id: 6423f1a2b1c2d3e4f5g6h7i8
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *     delete:
 *       summary: Delete a group chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteGroupDto'
 *       responses:
 *         200:
 *           description: Group chat deleted successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Group chat deleted successfully
 *
 *   /api/v1/chats/rename:
 *     put:
 *       summary: Rename a group chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RenameGroupDto'
 *       responses:
 *         200:
 *           description: Group chat renamed successfully
 *           content:
 *             application/json:
 *               example:
 *                 _id: 6423f1a2b1c2d3e4f5g6h7i8
 *                 chatName: New Project Team
 *                 isGroupChat: true
 *
 *   /api/v1/chats/groupremove:
 *     put:
 *       summary: Remove a user from a group chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModifyGroupDto'
 *       responses:
 *         200:
 *           description: User removed from group chat successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: User removed successfully
 *
 *   /api/v1/chats/groupadd:
 *     put:
 *       summary: Add a user to a group chat
 *       tags: [Chats]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModifyGroupDto'
 *       responses:
 *         200:
 *           description: User added to group chat successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: User added successfully
 */
