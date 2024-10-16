const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decodedToken;

        const userFound = await prisma.user.findUnique({
            where: {
                userId: userId,
            },
        });

        if (!userFound) {
            throw new UnauthenticatedError('User not found');
        }

        req.user = { userId };
        req.role = userFound.role;

        next();
    } catch (error) {
        console.error(error);
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = auth;