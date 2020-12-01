exports.pageNotFound = (res) => {
  const statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  return res.status(statusCode).end(
    JSON.stringify({
      status: statusCode,
      message: "Page not found",
    })
  );
};

exports.jsonWithStatusCode = (res, json, statusCode) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(statusCode).end(JSON.stringify(json));
};
