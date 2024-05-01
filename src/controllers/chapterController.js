const asyncCatch = require('../middleware/asyncCatch')
const _ = require('lodash');
const findModelById = require('../utils/findModelById')
exports.getChapters = asyncCatch(async (req, res, next) => {
    const chapters = await prisma.chapter.findMany({
        where: {}, include: { studio: true, anime: true }
    });

    return res.status(200).json({
        statusCode: 200,
        data: chapters
    })
});
exports.getChapterByid = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const chapter = await prisma.chapter.findUnique({
        where: { id }, include: { studio: true, anime: true }
    });
    if (_.isEmpty(chapter)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    return res.status(200).json({
        statusCode: 200,
        message: "Successfully",
        data: chapter
    })
});
exports.createChapter = asyncCatch(async (req, res, next) => {
    const { name, duration, studioId, animeId, ...duse } = req.body;
    if (
        !name ||
        !duration ||
        studioId === '' ||
        animeId === '' ||
        (typeof duration !== 'number')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (!_.isEmpty(animeId)) {
        const Anime = await findModelById('anime', animeId)
        if (_.isEmpty(Anime)) {
            return res.status(404).json({
                statusCode: 404,
                message: "anime id not found",
            });
        }
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
    
    const result = await prisma.chapter.create({
        data: { name, duration, studioId, animeId },
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.updateChapter = asyncCatch(async (req, res, next) => {
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
        !body.duration ||
        body.studioId === '' ||
        body.animeId === '' ||
        (typeof body.duration !== 'number')
    ) {
        return res.status(400).json({
            statusCode: 400,
            message: "bad request",
        });
    }
    if (!_.isEmpty(body.studioId)) {
        const Studio = await findModelById('studio', body.studioId)
        if (_.isEmpty(Studio)) {
            return res.status(404).json({
                statusCode: 404,
                message: "studio id not found",
            });
        }
    }
    if (!_.isEmpty(body.animeId)) {
        const Anime = await findModelById('anime', body.animeId)
        if (_.isEmpty(Anime)) {
            return res.status(404).json({
                statusCode: 404,
                message: "anime id not found",
            });
        }
    }
    const Chapter = await findModelById('chapter', params.id)
    if (_.isEmpty(Chapter)) {
        return res.status(404).json({
            statusCode: 404,
            message: "chapter id not found",
        });
    }
    const result = await prisma.chapter.update({
        where: {
            id: params.id
        },
        data: body,
    })

    return res.status(201).json({
        statusCode: 201,
        data: result
    })
});
exports.deleteChapter = asyncCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid (not uuid)",
        });
    }
    const chapter = await prisma.chapter.findUnique({
        where: { id },
    });
    if (_.isEmpty(chapter)) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found",
        });
    }
    await prisma.chapter.delete({
        where: { id },
    });
    return res.status(204).json({
        statusCode: 204
    })
});
