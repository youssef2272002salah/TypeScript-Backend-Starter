/**
 * @swagger
 * components:
 *   schemas:
 *     SignupDto:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *         - passwordConfirm
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: Password for the user account
 *           example: Password123
 *         passwordConfirm:
 *           type: string
 *           description: Confirmation of the password
 *           example: Password123
 *         country:
 *           type: string
 *           description: Country of the user (optional)
 *           example: USA
 *         phone:
 *           type: string
 *           description: Phone number of the user (optional)
 *           example: 1234567890
 *         phoneCode:
 *           type: string
 *           description: Phone code of the user (optional)
 *           example: +1
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of the user
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: Password for the user account
 *           example: Password123
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - password
 *         - passwordConfirm
 *         - resetToken
 *       properties:
 *         password:
 *           type: string
 *           description: New password for the user account
 *           example: NewPassword123
 *         passwordConfirm:
 *           type: string
 *           description: Confirmation of the new password
 *           example: NewPassword123
 *         resetToken:
 *           type: string
 *           description: Token for resetting the password
 *           example: abc123xyz
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
 *   /api/v1/auth/signup:
 *     post:
 *       summary: Register a new user
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupDto'
 *       responses:
 *         201:
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 message: Signup successful! Please verify your email.
 *                 user:
 *                   id: 12345
 *                   fullname: John Doe
 *                   email: johndoe@example.com
 *         400:
 *           description: Validation error
 *   /api/v1/auth/login:
 *     post:
 *       summary: Log in a user
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginDto'
 *       responses:
 *         200:
 *           description: User logged in successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 message: Login successful
 *                 data:
 *                   accessToken: abc123xyz
 *         401:
 *           description: Invalid email or password
 *   /api/v1/auth/logout:
 *     get:
 *       summary: Log out a user
 *       tags:
 *         - Auth
 *       responses:
 *         200:
 *           description: User logged out successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Logout successful
 *   /api/v1/auth/refresh:
 *     post:
 *       summary: Refresh access token
 *       tags:
 *         - Auth
 *       responses:
 *         200:
 *           description: New access token generated
 *           content:
 *             application/json:
 *               example:
 *                 accessToken: newAccessToken123
 *         403:
 *           description: No refresh token provided
 *   /api/v1/auth/verify-email:
 *     get:
 *       summary: Verify user email
 *       tags:
 *         - Auth
 *       parameters:
 *         - in: query
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 *           description: Verification token sent to the user's email
 *       responses:
 *         200:
 *           description: Email verified successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Email verified successfully
 *         400:
 *           description: Invalid verification token
 *   /api/v1/auth/resend-verification-email:
 *     post:
 *       summary: Resend email verification link
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   example: johndoe@example.com
 *       responses:
 *         200:
 *           description: Verification email sent successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Verification email sent successfully
 *         404:
 *           description: User not found or already verified
 *   /api/v1/auth/forgot-password:
 *     post:
 *       summary: Request password reset
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   example: johndoe@example.com
 *       responses:
 *         200:
 *           description: Password reset token sent
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   message: Password reset token sent
 *         404:
 *           description: User not found
 *   /api/v1/auth/reset-password:
 *     patch:
 *       summary: Reset user password
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordDto'
 *       responses:
 *         200:
 *           description: Password reset successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   message: Password reset successful
 *         400:
 *           description: Invalid or expired reset token
 *   /api/v1/auth/update-password:
 *     patch:
 *       summary: Update user password
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordDto'
 *       responses:
 *         200:
 *           description: Password updated successfully
 *           content:
 *             application/json:
 *               example:
 *                 status: success
 *                 data:
 *                   message: Password updated successfully
 *         401:
 *           $ref: '#/components/responses/UnauthorizedError'
 */
