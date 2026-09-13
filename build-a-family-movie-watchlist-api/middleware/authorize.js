export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const requestedUserId = req.params.userId;

  if (
    role === "parent" ||
    (role === "child" && String(id) === String(requestedUserId))
  ) {
    return next();
  }

  return res.status(403).json({
    error: "Access denied",
  });
}