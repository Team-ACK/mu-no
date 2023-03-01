const env = process.env.REACT_APP_ENVIRONMENT;

const HOST_URL =
  env === "dev"
    ? "http://localhost:3000"
    : env === "dev-build"
    ? "http://localhost:8080"
    : env === "production"
    ? "http://muno.fun"
    : "";

const END_POINT =
  env === "dev"
    ? "http://localhost:8080"
    : env === "dev-build"
    ? "http://localhost:8080"
    : env === "production"
    ? "http://muno.fun"
    : "";

export { HOST_URL, END_POINT };
