import express from 'express';
import orgRouter from './modules/organizations/org.routes';
import memberRouter from './modules/members/member.routes';
import invitationRouter from './modules/invitations/invitation.routes';
import userRouter from './modules/users/user.routes';
import * as RoleController from './modules/roles/role.controller';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use('/orgs', orgRouter);
app.use('/orgs/:orgId/members', memberRouter);
app.use('/orgs/:orgId/invitations', invitationRouter);
app.use('/users', userRouter);
app.get('/roles', RoleController.getRoles);

app.use(errorHandler);

export default app;
