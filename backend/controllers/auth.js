const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const createJWT = (userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
}

const registerCustomer = async (req, res) => {
    const { name, email, password, mobileNumber } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (existingUser) {
            throw new BadRequestError("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                mobileNumber,
                role: 'CUSTOMER'
            },
        });

        const token = createJWT(newUser.userId, 'CUSTOMER');

        res.status(StatusCodes.CREATED).json({
            name: newUser.name,
            mobileNumber: newUser.mobileNumber,
            id: newUser.userId,
            email: newUser.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthenticatedError("Invalid email");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new UnauthenticatedError("Invalid password");
        }

        const token = createJWT(user.userId, user.role);

        res.status(StatusCodes.OK).json({
            name: user.name,
            id: user.userId,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

const loginManager = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    try {
        const manager = await prisma.manager.findUnique({
            where: { email },
            include: { centre: true }
        });

        if (!manager) {
            throw new UnauthenticatedError("Invalid email");
        }

        const isPasswordCorrect = await bcrypt.compare(password, manager.password);

        if (!isPasswordCorrect) {
            throw new UnauthenticatedError("Invalid password");
        }

        const token = jwt.sign(
            { managerId: manager.managerId, role: 'MANAGER' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(StatusCodes.OK).json({
            name: manager.name,
            id: manager.managerId,
            email: manager.email,
            centre: manager.centre,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerCustomer,
    loginCustomer,
    loginManager
};