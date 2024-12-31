export const apiMethods = {
  BASE_URL: "http://localhost:3000",

  GET_GOODIES: "/api/getGoodies",

  CREATE_GOODIE: "/api/createGoodie",

  UPDATE_GOODIE: (id: string) => `/api/updateGoodie/${id}`,

  DELETE_GOODIE: (id: string) => `/api/deleteGoodie/${id}`,

  GET_PRICE_HISTORY: (id: string) => `/api/getPriceHistory/${id}`,

  LOOKUP_GOODIE: (id: string) => `/api/lookupGoodie/${id}`,

  FILTER_GOODIES: "/api/filterByQuantity",
} as const;
