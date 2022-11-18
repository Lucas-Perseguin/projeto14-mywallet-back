export function validationUser(req, res, next) {
  const { user } = req.headers;
  console.log("To no md validateUser");
  if (!user) {
    return res.status(401).send("To no md");
  }

  next();
}
