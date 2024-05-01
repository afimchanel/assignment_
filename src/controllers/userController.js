const asyncCatch = require('../middleware/asyncCatch')
const _ = require('lodash');
var bcrypt = require('bcryptjs');
exports.getUsers = asyncCatch(async (req, res, next) => {
    const users = await prisma.user.findMany({
        where: {}, select: { id: true, login: true }
    });

    return res.status(200).json({
        statusCode: 200,
        data: users
    })
});
exports.getUserByid = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const user = await prisma.user.findUnique({
        where: { id }, select: { id: true, login: true }
    });
    if (_.isEmpty(user)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    return res.status(200).json({
        statusCode: 200,
        message: "Successfully",
        data: user
    })
});
exports.createUser = asyncCatch(async (req, res, next) => {
    const body = req.body;
    if (
        !body.login ||
        !body.password ||
        (typeof body.password !== 'string') ||
        (typeof body.login !== 'string')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    const is_Dup = await prisma.user.findUnique({ where: { login: body.login, } });
    if (!_.isEmpty(is_Dup)) {
        return res.status(400).json({
            statusCode: 400,
            message: "login has system",
        });
    }
    const hashedPassword = await bcrypt.hash(body.password, 8)
    const result = await prisma.user.create({
        data: {
            login: body.login,
            password: hashedPassword
        }, select: { id: true, login: true }
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.deleteUser = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (_.isEmpty(user)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    await prisma.user.delete({
        where: { id },
    });
    return res.status(204).json({
        statusCode: 204
    })
});
