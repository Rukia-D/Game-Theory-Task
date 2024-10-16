const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { UnauthenticatedError } = require('../errors');

const authManager = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid: No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { managerId } = decodedToken;

        // Check if the token has the expected structure
        if (!managerId) {
            throw new UnauthenticatedError('Authentication invalid: Manager ID not found in token');
        }

        const managerFound = await prisma.manager.findUnique({
            where: {
                managerId: managerId,
            },
        });

        if (!managerFound) {
            throw new UnauthenticatedError('Manager not found in the database');
        }

        req.manager = { managerId };
        req.centreId = managerFound.centreId;
        req.role = managerFound.role;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        throw new UnauthenticatedError('Authentication invalid: ' + error.message);
    }
};


module.exports = authManager;