const { UnauthenticatedError } = require('../errors');

const authorizeRoles = (allowedRole) => {
    return (req, res, next) => {
        try {
            const role = req.role;
            if (!role) {
                throw new UnauthenticatedError('No role found. Please authenticate.');
            }
            if (allowedRole !== role) {
                throw new UnauthorizedError('You do not have permission to access this resource.');
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};


module.exports = authorizeRoles;