const pagination = async (query, callback) => {
  const { page = 1, limit = 10, order = "DESC" } = query;
  const pageIndex = parseInt(page);
  const perPageLimit = parseInt(limit);
  const sortOrder = order.toUpperCase() === "ASC" ? 1 : -1;
  const offset = (pageIndex - 1) * perPageLimit;

  try {
    // Execute the callback function to fetch data with pagination
    const { doc, totalDoc } = await callback(perPageLimit, offset, sortOrder);

    // Calculate pagination details
    const pagination = {
      currentPage: pageIndex,
      currentPageLimit: perPageLimit,
      total: totalDoc,
      totalPage: Math.ceil(totalDoc / perPageLimit),
      prevPage: pageIndex > 1 ? pageIndex - 1 : null,
      prevPageLimit: perPageLimit,
      nextPage: offset + perPageLimit < totalDoc ? pageIndex + 1 : null,
      nextPageLimit: perPageLimit,
    };

    // Return results including pagination details
    return { result: doc, pagination };
  } catch (error) {
    // Handle errors
    console.error("Pagination error:", error);
    throw error;
  }
};

module.exports = pagination;
