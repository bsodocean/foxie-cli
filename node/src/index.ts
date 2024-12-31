#!/usr/bin/env ts-node

import { rawlist, select } from "@inquirer/prompts";
import { program } from "commander";
import { opts } from "./enums/opts";
import chalk from "chalk";
import figlet from "figlet";
import dotenv from "dotenv";
import { apiMethods } from "./enums/apiMethods";
import { table } from "table";
import inquirer from "inquirer";
import { nanoid } from "nanoid";

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
    let $id;
    const data = await fetchGoodies();
    const url = `${host}${port}/api/updateGoodie/${$id}`;
    const itemName = data.forEach((goodie: any) => {
      return goodie.name;
    });
    const itemId = data.forEach((goodie: any) => {
      return goodie.id;
    });
    const answer = await rawlist({
      message: "Choose what to update!",
      choices: [{ name: itemName, value: itemId }],
    });
  }

  program.version("1.0.0").description("Peter's goodie system");

  program.parse(process.argv);
}

foxieRun();
