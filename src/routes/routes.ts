import { authRouter } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/users/user.routes';
import { chatRouter } from '../modules/chat/chat.routes';
import { messageRouter } from '../modules/message/message.routes';

export const setupRoutes = (app: any) => {
  app.get('/health', (_req: any, res: { json: (arg0: { status: string }) => any }) =>
    res.json({ status: 'healthy' }),
  );
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/chat', chatRouter);
  app.use('/api/v1/message', messageRouter);
};
