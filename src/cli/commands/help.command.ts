import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._params: string[]): Promise<void> {
    console.info(`
        ${chalk.green('Программа для подготовки данных для REST API сервера.')}
        Пример: ${chalk.red('cli.js --<command> [--arguments]')}
        Команды:
        ${chalk.red('--version')}:                     # выводит номер версии
        ${chalk.red('--help')}:                        # печатает этот текст
        ${chalk.red('--import <path>')}:               # импортирует данные из TSV
        ${chalk.red('--generate <n> <path> <url>')}:   # генерирует произвольное количество тестовых данных
    `);
  }
}
