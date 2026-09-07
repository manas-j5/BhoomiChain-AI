/**
 * 404 Not Found middleware — catches unmatched routes.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.url}`,
      status: 404,
    },
  })
}

module.exports = notFound
