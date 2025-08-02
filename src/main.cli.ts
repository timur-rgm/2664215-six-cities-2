#!/usr/bin/env node
import {
  CLIApplication,
  GenerateCommand,
  HelpCommand,
  ImportCommand,
  VersionCommand,
} from './cli/index.js';

const bootstrap = () => {
  const application = new CLIApplication();

  application.registerCommands([
    new GenerateCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new VersionCommand(),
  ]);

  application.processCommand(process.argv);
};

bootstrap();
