import express from 'express';
import cors from 'cors';
import orgRouter from './modules/organizations/org.routes';
import memberRouter from './modules/members/member.routes';
import invitationRouter from './modules/invitations/invitation.routes';
import userRouter from './modules/users/user.routes';
import * as RoleController from './modules/roles/role.controller';
import errorHandler from './middleware/errorHandler';
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();

// -------------------------
// CORS Middleware
// -------------------------
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// -------------------------
// JSON Body Parser
// -------------------------
app.use(express.json());
// JWT validation middleware
const checkJwt = auth({
    audience: "usermng-service",
    issuerBaseURL: "https://dev-finvers.us.auth0.com/",
});

// app.use(checkJwt);
// -------------------------
// Request Logging Middleware
// -------------------------
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});

app.use('/orgs', orgRouter);
app.use('/orgs/:orgId/members', memberRouter);
app.use('/orgs/:orgId/invitations', invitationRouter);
app.use('/users', userRouter); // other protected user routes
app.get('/roles', RoleController.getRoles);

// -------------------------
// Error Handler
// -------------------------
app.use(errorHandler);

export default app;
