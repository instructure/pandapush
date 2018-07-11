#!/usr/bin/env node

const program = require("commander");
const loadTest = require("./lib/loadtest").loadTest;

program.version("0.0.1");

const clientName = process.env.HOSTNAME + "-" + process.pid;

program
  .command(
    "loadtest <url> <appid> <keyid> <secret> <numusers> <pushesperuser> <pushrate>"
  )
  .description("perform a loadtest")
  .action(function(
    url,
    appid,
    keyid,
    secret,
    numusers,
    ppu,
    pushrate,
    options
  ) {
    loadTest(
      url,
      appid,
      keyid,
      secret,
      numusers,
      ppu,
      pushrate,
      clientName,
      function(progress) {},
      function() {
        process.exit(0);
      }
    );
  });

program.parse(process.argv);
