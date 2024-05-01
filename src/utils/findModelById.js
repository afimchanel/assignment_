const findModelById = async (model, id) => {
    const result = await prisma[model].findUnique({
        where: { id: id }
    });
    return result
}
module.exports = findModelById