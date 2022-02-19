const logger = (store) => (next) => (action) => {
  //console.log("logger middelware", action);

  return next(action);
};

export default logger;
