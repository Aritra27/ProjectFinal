const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    console.log(err)
    const error = {
      status: 401,
      message: err.errors[0].message,
    };
    next(error);
  }
};
module.exports = validate
