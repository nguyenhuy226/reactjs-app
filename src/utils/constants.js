// chứa các biến http
// export const API_ROOT = "http://localhost:8017";
let apiRoot = "";
console.log(import.meta.env);
console.log(process.env);
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://node-api-2tsp.onrender.com";
}
export const API_ROOT = apiRoot;
