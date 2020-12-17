export default (catchAsync) => async (request, response, next) => {
  try {
    return await catchAsync(request, response, next);
  } catch (error) {
    return next(error);
  }
};
