export function getHost(): string {
  const api_host = process.env.NODE_ENV == "production"? undefined: process.env.REACT_APP_BACKEND_HOST;
  return api_host ? `http://${api_host}` : window.location.origin;
}
