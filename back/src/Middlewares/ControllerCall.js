const controllerCall = controller => {
  const call = async (method, props, res, next) => {
    try {
      const result = await controller[method](props);
      res.json({
        success: true,
        result
      });
    } catch (e) {
      next(e);
    }
  };
  return call;
};

export default controllerCall;
