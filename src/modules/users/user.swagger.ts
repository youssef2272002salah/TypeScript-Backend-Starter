/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: johndoe@example.com
 *         country:
 *           type: string
 *           description: Country of the user
 *           example: USA
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *           example: 1234567890
 *         phoneCode:
 *           type: string
 *           description: Phone code of the user
 *           example: +1
 *         pic:
 *           type: string
 *           description: Profile picture URL of the user
 *           example: https://example.com/profile.jpg
 *   responses:
 *     UnauthorizedError:
 *       description: User is not authorized
 *       content:
 *         application/json:
 *           example:
 *             status: fail
 *             message: You are not logged in. Please log in to access this resource.
 *     ForbiddenError:
 *       description: User does not have permission
 *       content:
 *         application/json:
 *           example:
 *             status: fail
 *             message: You do not have permission to perform this action.
 *
 * paths:
 *   /api/v1/users/me:
 *     get:
 *       summary: Get the current user's profile
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: User profile retrieved successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   id: 12345
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *                   country: USA
 *                   phone: 1234567890
 *                   phoneCode: +1
 *                   pic: https://example.com/profile.jpg
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *     patch:
 *       summary: Update the current user's profile
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserDto'
 *       responses:
 *         200:
 *           description: User profile updated successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   id: 12345
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *                   country: USA
 *                   phone: 1234567890
 *                   phoneCode: +1
 *                   pic: https://example.com/profile.jpg
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *     delete:
 *       summary: Delete the current user's account
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         204:
 *           description: User account deleted successfully
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/v1/users/:
 *     get:
 *       summary: Get all users (accessible to all authenticated users)
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: Page number for pagination
 *           example: 1
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Number of users per page
 *           example: 10
 *       responses:
 *         200:
 *           description: List of users retrieved successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   - id: 12345
 *                     fullname: John Doe
 *                     email: johndoe@example.com
 *                     country: USA
 *                     phone: 1234567890
 *                     phoneCode: +1
 *                     pic: https://example.com/profile.jpg
 *                   - id: 67890
 *                     fullname: Jane Smith
 *                     email: janesmith@example.com
 *                     country: UK
 *                     phone: 9876543210
 *                     phoneCode: +44
 *                     pic: https://example.com/profile2.jpg
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/v1/users/{id}:
 *     get:
 *       summary: Get a user by ID (admin only)
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the user to retrieve
 *       responses:
 *         200:
 *           description: User profile retrieved successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   id: 12345
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *                   country: USA
 *                   phone: 1234567890
 *                   phoneCode: +1
 *                   pic: https://example.com/profile.jpg
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *     patch:
 *       summary: Update a user by ID (admin only)
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the user to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserDto'
 *       responses:
 *         200:
 *           description: User profile updated successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   id: 12345
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *                   country: USA
 *                   phone: 1234567890
 *                   phoneCode: +1
 *                   pic: https://example.com/profile.jpg
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 *     delete:
 *       summary: Delete a user by ID (admin only)
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the user to delete
 *       responses:
 *         204:
 *           description: User account deleted successfully
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 *         403:
 *           $ref: '#/components/responses/ForbiddenError'
 */
