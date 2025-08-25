
const IS_PRODUCTION = 1;

const RAILWAY_API_URL = process.env.REACT_APP_RAILWAY_API_URL;
const LOCAL_API_URL = process.env.REACT_APP_LOCAL_API_URL;

export const API_BASE = IS_PRODUCTION ? RAILWAY_API_URL : LOCAL_API_URL;

export const getApiEndpoint = (path: string) => `${API_BASE}${path}`;

