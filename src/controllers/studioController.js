const asyncCatch = require('../middleware/asyncCatch')
const _ = require('lodash');
const findModelById = require('../utils/findModelById')
exports.getStudios = asyncCatch(async (req, res, next) => {
    const studios = await prisma.studio.findMany({
        where: {},
        include: { Anime: true, Chapter: true },
    });

    return res.status(200).json({
        statusCode: 200,
        data: studios
    })
});
exports.getStudioByid = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const studio = await prisma.studio.findUnique({
        where: { id },
        include: {
            Anime: true, Chapter: true,
        }
    });
    if (_.isEmpty(studio)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    return res.status(200).json({
        statusCode: 200,
        message: "Successfully",
        data: studio
    })
});
exports.createStudio = asyncCatch(async (req, res, next) => {
    const body = req.body;
    if (
        !body.name ||
        !body.website ||
        (typeof body.name !== 'string') ||
        (typeof body.website !== 'string')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }

    const result = await prisma.studio.create({
        data: {
            name: body.name,
            website: body.website,
        },
        include: {
            Anime: true, Chapter: true
        }
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.updateStudio = asyncCatch(async (req, res, next) => {
    const body = req.body;
    const params = req.params;
    if (!params.id) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (
        !body.name ||
        !body.website ||
        (typeof body.name !== 'string') ||
        (typeof body.website !== 'string')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    const Studio = await findModelById('studio', params.id)
    if (_.isEmpty(Studio)) {
        return res.status(404).json({
            statusCode: 404,
            message: "studio id not found",
        });
    }
    const result = await prisma.studio.update({
        where: {
            id: params.id
        },
        data: body,
        include: {
            Anime: { where: { deletedAt: null } }, Chapter: { where: { deletedAt: null } }
        }
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.deleteStudio = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const studio = await findModelById('studio', id)
    if (_.isEmpty(studio)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    await prisma.studio.delete({
        where: { id },
    });
    return res.status(204).json({
        statusCode: 204
    })
});

