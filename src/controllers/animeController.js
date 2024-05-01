const asyncCatch = require('../middleware/asyncCatch')
const _ = require('lodash');
const findModelById = require('../utils/findModelById')
exports.getAnimes = asyncCatch(async (req, res, next) => {
    const animes = await prisma.anime.findMany({
        where: {}, include: { studio: true, Chapter: true }
    });

    return res.status(200).json({
        statusCode: 200,
        data: animes
    })
});
exports.getAnimeByid = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const anime = await prisma.anime.findUnique({
        where: { id }, include: { studio: true, Chapter: true }
    });
    if (_.isEmpty(anime)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    return res.status(200).json({
        statusCode: 200,
        message: "Successfully",
        data: anime
    })
});
exports.createAnime = asyncCatch(async (req, res, next) => {
    const { name, year, studioId, ...duse } = req.body;
    if (
        !name ||
        !year ||
        studioId === '' ||
        (typeof year !== 'number')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (!_.isEmpty(studioId)) {
        const Studio = await findModelById('studio', bstudioId)
        if (_.isEmpty(Studio)) {
            return res.status(404).json({
                statusCode: 404,
                message: "studio id not found",
            });
        }
    }
    const result = await prisma.anime.create({
        data: { name, year, studioId }, include: { studio: true, Chapter: true }
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.updateAnime = asyncCatch(async (req, res, next) => {
    const { name, year, studioId, ...duse } = req.body;
    const params = req.params;
    if (!params.id) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (
        !name ||
        !year ||
        studioId === '' ||
        (typeof year !== 'number')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (!_.isEmpty(studioId)) {
        const Studio = await findModelById('studio', studioId)
        if (_.isEmpty(Studio)) {
            return res.status(404).json({
                statusCode: 404,
                message: "studio id not found",
            });
        }
    }

    const Anime = await findModelById('anime', params.id)
    if (_.isEmpty(Anime)) {
        return res.status(404).json({
            statusCode: 404,
            message: "anime id not found",
        });
    }
    const result = await prisma.anime.update({
        where: {
            id: params.id
        },
        data: { name, year, studioId },
        include: { studio: true, Chapter: true }
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.deleteAnime = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const anime = await prisma.anime.findUnique({
        where: { id },
    });
    if (_.isEmpty(anime)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    await prisma.anime.delete({
        where: { id },
    });
    return res.status(204).json({
        statusCode: 204
    })
});