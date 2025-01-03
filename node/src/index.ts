#!/usr/bin/env ts-node

import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { program } from "commander";
import dotenv from "dotenv";
import figlet from "figlet";
import inquirer from "inquirer";
import { nanoid } from "nanoid";
import { opts } from "./enums/opts";

dotenv.config();
const port = process.env.PORT || "3000";
const host = "http://localhost:";

async function foxieRun() {
  try {
    console.log(
      chalk.yellow(
        await figlet.text("Foxie", {
          font: "Sub-Zero",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        })
      )
    );
  } catch (err) {
    console.log("Something went wrong...");
    console.dir(err);
  }

  const fetchGoodies = async () => {
    const url = `${host}${port}/api/getGoodies`;
    try {
      const response = await fetch(url).then((res) => res.json());
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  };

  const options = await select({
    message: chalk.bold.gray("Hi, Peter! How can I help you today?"),
    // ! Choices could be looped through
    choices: [
      {
        name: chalk.green(opts.listGoodies.name),
        value: opts.listGoodies.value,
        description: chalk.dim(opts.listGoodies.description),
      },
      {
        name: chalk.yellow(opts.listPriceHistory.name),
        value: opts.listPriceHistory.value,
        description: chalk.italic(opts.listPriceHistory.description),
      },
      {
        name: chalk.cyan(opts.searchGoodie.name),
        value: opts.searchGoodie.value,
        description: chalk.underline(opts.searchGoodie.description),
      },
      {
        name: chalk.magenta(opts.filterGoodiesByAmmount.name),
        value: opts.filterGoodiesByAmmount.value,
        description: chalk.bold(opts.filterGoodiesByAmmount.description),
      },
      {
        name: chalk.yellow(opts.createGoodie.name),
        value: opts.createGoodie.value,
        description: chalk.bold(opts.createGoodie.description),
      },
      {
        name: chalk.redBright(opts.deleteGoodie.name),
        value: opts.deleteGoodie.value,
        description: chalk.bold(opts.deleteGoodie.description),
      },
      {
        name: chalk.cyanBright(opts.updateGoodie.name),
        value: opts.updateGoodie.value,
        description: chalk.bold(opts.updateGoodie.description),
      },
      {
        name: chalk.red("EXIT"),
        value: "EXIT",
      },
    ],
  }).then(async function handleAnswer(answer: string) {
    switch (answer) {
      case "LIST GOODIES":
        const data = await fetchGoodies();
        console.table(data);
        break;
      case "CREATE GOODIE":
        createGoodie();
        break;
      case "UPDATE GOODIE":
        updateGoodie();
        break;
      case "DELETE GOODIE":
        deleteGoodies();
        break;
      case "LIST PRICE HISTORY":
        getPriceHistory();
        break;
      case "LOOKUP GOODIE":
        lookupItem();
        break;
      case "FILTERBYQ":
        filterbyQuantity();
        break;
      case "EXIT":
        break;
    }
  });

  // Move these fns to a separate file
  async function createGoodie() {
    const url = `${host}${port}/api/createGoodie`;
    const data = inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name?",
        },
        {
          type: "input",
          name: "amount",
          message: "Amount?",
        },
        {
          type: "input",
          name: "price",
          message: "How much is it?",
        },
      ])
      .then(async function handleAnswer(answer: any) {
        // Could be made into a separate helper fn/handler
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: nanoid(),
            name: answer.name,
            price: parseInt(answer.price),
            amount: parseInt(answer.amount),
          }),
        })
          .then((res) => res.json())
          .then((res) => console.log(res));
      });
  }

  async function updateGoodie() {
    const data = await fetchGoodies();
    const choices = data.map((item: any) => ({
      name: `${item.name} - $${item.price} (Amount: ${item.amount})`,
      value: item.id,
    }));

    const { id, field } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "id",
        message: "Select a goodie to update:",
        choices: choices,
      },
      {
        type: "list",
        name: "field",
        message: "What would you like to change?",
        choices: ["Name", "Price", "Amount"],
      },
    ]);

    const selectedGoodie = data.find((item: any) => item.id === id);

    const { newValue } = await inquirer.prompt([
      {
        type: "input",
        name: "newValue",
        message: `Enter new ${field.toLowerCase()}:`,
      },
    ]);

    const updatedGoodie = {
      ...selectedGoodie,
      [field.toLowerCase()]:
        field === "Price" || field === "Amount"
          ? parseFloat(newValue)
          : newValue,
    };

    const url = `${host}${port}/api/updateGoodie/${id}`;
    await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedGoodie),
    });

    console.log(
      `Goodie updated successfully: ${JSON.stringify(updatedGoodie)}`
    );
  }

  // Kind of don't like having to fetch everytime I need the item records,
  // maybe just create a single variable where all the data is without having to call all the time
  async function deleteGoodies() {
    const data = await fetchGoodies();
    const choices = data.map((item: any) => ({
      name: `${item.name} - $${item.price} (Amount: ${item.amount})`,
      value: item.id,
    }));
    // These opts could also be a module as I reuse these frequently
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "id",
        message: "Please choose which entry to delete",
        choices: choices,
      },
    ]);

    const id = answer.id;
    // Same thing with this, this could also be included in a module or like handler where you put all the the things you need like method, url, params etc
    const url = `${host}${port}/api/deleteGoodie/${id}`;
    await fetch(url, {
      method: "DELETE",
    }).then(() =>
      console.log(chalk.greenBright("Great sucess, item deleted!"))
    );
  }

  async function getPriceHistory() {
    const data = await fetchGoodies();
    const choices = data.map((item: any) => ({
      name: `${item.name} - $${item.price} (Amount: ${item.amount})`,
      value: item.id,
    }));

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "id",
        message: "Please choose which entry to delete",
        choices: choices,
      },
    ]);
    const id = answer.id;

    const url = `${host}${port}/api/getPriceHistory/${id}`;
    await fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  async function lookupItem() {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "Please enter the ID of the goodie you're looking for!",
      },
    ]);

    const id = answer.id;

    const url = `${host}${port}/api/lookupGoodie/${id}`;
    // ! Missing error handling for all the others calls as well
    await fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) =>
        console.log(chalk.blueBright("Here is what I found:"), res)
      );
  }

  async function filterbyQuantity() {
    const data = await fetchGoodies();
    const url = `${host}${port}/api/filterByQuantity`;
    await fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) =>
        console.log(
          chalk.greenBright(
            "Here are your filtered items, from top to bottom:"
          ),
          res
        )
      );
  }

  program.version("1.0.0").description("Peter's goodie system");

  program.parse(process.argv);
}

foxieRun();
