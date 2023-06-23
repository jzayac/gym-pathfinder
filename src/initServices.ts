import searchRouter from "./search";

type ILogger = any;

export default (logger: ILogger) =>  {
  const search = searchRouter(logger);

  return {
    search,
  };
};
