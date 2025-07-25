import {
  CLIApplication,
  HelpCommand,
  VersionCommand,
  ImportCommand
} from './cli/index.js';

const bootstrap = () => {
  const application = new CLIApplication();

  application.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);

  application.processCommand(process.argv);
};

bootstrap();
