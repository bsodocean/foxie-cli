#!/usr/bin/env ts-node

import { program } from "commander";
import chalk from "chalk";
import { opts } from "./enums/opts";
import inquirer from "inquirer";
import { select, Separator } from "@inquirer/prompts";
import ora from "ora";
import figlet from "figlet";

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

  const options = await select({
    message: chalk.bold.gray("Hi, Peter! How can I help you today?"),
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
    ],
  });

  program.version("1.0.0").description("Peter's goodie system");

  program.parse(process.argv);
}

foxieRun();
