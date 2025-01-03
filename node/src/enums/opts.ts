import chalk from "chalk";

export const opts = {
  createGoodie: {
    name: "Create goodie",
    value: "CREATE GOODIE",
    description: "Add a goodie to Peter's database",
  },
  updateGoodie: {
    name: "Update goodie",
    value: "UPDATE GOODIE",
    description: "Update a goodie in Peter's database",
  },
  deleteGoodie: {
    name: "Delete goodie",
    value: "DELETE GOODIE",
    description: "Delete a goodie in Peter's database",
  },
  listGoodies: {
    name: "List all goodies",
    value: "LIST GOODIES",
    description: "Show Peter available goodies",
  },
  listPriceHistory: {
    name: "List price history of goodies",
    value: "LIST PRICE HISTORY",
    description: "Show Peter history of goodie prices",
  },
  searchGoodie: {
    name: "Lookup a goodie",
    value: "LOOKUP GOODIE",
    description: "Let Peter search for a specific goodie",
  },
  filterGoodiesByAmmount: {
    name: "Filter goodies by amount",
    value: "FILTERBYQ",
    description: "Filter Peter's goodies by quantity",
  },
};

// Created this for the sake of encapsulation and more readable code.
