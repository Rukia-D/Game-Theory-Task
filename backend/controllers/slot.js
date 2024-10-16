const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CENTRES_ORDER = ['Indira Nagar', 'HSR Layout', 'Electronic City', 'Whitefield', 'RT Nagar', 'Bagalur', 'Kaggadasapura'];
const SPORTS_ENUM = {
    BADMINTON: 'BADMINTON',
    SWIMMING: 'SWIMMING',
    CRICKET: 'CRICKET',
    TABLE_TENNIS: 'TABLE_TENNIS',
    FOOTBALL: 'FOOTBALL'
};

const viewCustomerSlots = async (req, res) => {
    const { userId } = req.user;

    try {
        const slots = await prisma.slot.findMany({
            where: { userId },
            include: {
                court: {
                    include: {
                        centre: true,
                    }
                }
            }
        });

        const slotsWithSports = slots.map(slot => {
            const { court } = slot;
            return {
                ...slot,
                court: {
                    ...court,
                    sports: court.sport
                }
            };
        });

        if (!slotsWithSports.length) {
            return res.status(StatusCodes.OK).json({ message: "No slots booked yet." });
        }

        res.status(StatusCodes.OK).json({ slots: slotsWithSports });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

const bookSlot = async (req, res) => {
    const { userId } = req.user;
    const { courtNumber, centreName, sportName, time, date } = req.body;

    try {
        const centreIndex = CENTRES_ORDER.indexOf(centreName);
        if (centreIndex === -1) {
            throw new NotFoundError("Centre not found.");
        }

        const centreId = centreIndex + 1;

        const court = await prisma.court.findFirst({
            where: {
                courtNumber: parseInt(courtNumber),
                centreId: centreId,
                sport: sportName,
            },
            include: { slots: true },
        });

        if (!court) {
            throw new NotFoundError("Court not found.");
        }

        const slotExists = court.slots.find(s => 
            s.time === parseInt(time) && new Date(s.date).toDateString() === new Date(date).toDateString()
        );

        if (slotExists) {
            throw new BadRequestError("Slot is already booked.");
        }

        const newSlot = await prisma.slot.create({
            data: {
                courtId: court.courtId,
                userId: userId,
                time: parseInt(time),
                date: new Date(date),
                isOccupied: true,
            }
        });

        res.status(StatusCodes.CREATED).json({ message: "Slot booked successfully", newSlot });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

const deleteSlot = async (req, res) => {
    const { slotId } = req.params;
    const { userId } = req.user;

    try {
        const slot = await prisma.slot.findUnique({
            where: { slotId: parseInt(slotId) }
        });

        if (!slot || slot.userId !== userId) {
            throw new NotFoundError("Slot not found or you are not authorized to delete this booking.");
        }

        const updatedSlot = await prisma.slot.update({
            where: { slotId },
            data: {
                userId: null,
                isOccupied: false
            }
        });

        res.status(StatusCodes.OK).json({ message: "Slot deleted successfully", updatedSlot });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};


const viewAvailableSlots = async (req, res) => {
    const { centreName, sportName, date } = req.body;

    try {
        const centreIndex = CENTRES_ORDER.indexOf(centreName);
        if (centreIndex === -1) {
            throw new NotFoundError("Centre not found.");
        }

        const centreId = centreIndex + 1;

        const courts = await prisma.court.findMany({
            where: {
                centreId: centreId,
                sport: sportName,
            },
            include: {
                slots: true
            }
        });

        if (!courts.length) {
            throw new NotFoundError("No courts found for the specified centre and sport.");
        }

        const timeSlots = [];
        for (let hour = 9; hour <= 18; hour++) {
            timeSlots.push({
                time: `${hour}:00`,
                courts: courts.map(court => {
                    const slot = court.slots.find(s => s.time === hour && new Date(s.date).toDateString() === new Date(date).toDateString());
                    return {
                        courtNumber: court.courtNumber,
                        status: slot && slot.isOccupied ? "occupied" : "free"
                    };
                })
            });
        }

        res.status(StatusCodes.OK).json({ timeSlots });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

const viewCentreSlots = async (req, res) => {
    const { sportName, date } = req.body;
    const { centreId } = req;

    try {
        const courts = await prisma.court.findMany({
            where: {
                centreId: parseInt(centreId),
                sport: sportName
            },
            include: {
                slots: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!courts.length) {
            throw new NotFoundError("No courts found for the specified sport.");
        }

        const timeSlots = [];
        for (let hour = 9; hour <= 18; hour++) {
            timeSlots.push({
                time: `${hour}:00`,
                courts: courts.map(court => {
                    const slot = court.slots.find(s => s.time === hour && new Date(s.date).toDateString() === new Date(date).toDateString());
                    return {
                        courtNumber: court.courtNumber,
                        status: slot && slot.isOccupied ? "occupied" : "free",
                        userInfo: slot && slot.isOccupied ? { 
                            name: slot.user.name,
                            email: slot.user.email
                        } : null
                    };
                })
            });
        }

        res.status(StatusCodes.OK).json({ timeSlots });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};

module.exports = {
    viewCustomerSlots,
    bookSlot,
    deleteSlot,
    viewAvailableSlots,
    viewCentreSlots,
};