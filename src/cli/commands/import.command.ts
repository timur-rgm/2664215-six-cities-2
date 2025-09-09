import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { TSVFileReader } from '../../shared/libs/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { FileReaderEvents } from '../../shared/constants/index.js';
import { DEFAULT_USER_PASSWORD } from './command.constant.js';
import type { Command } from './command.interface.js';
import type { OfferType } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private offerService: OfferService;
  private salt: string;
  private userService: UserService;

  constructor() {
    this.onRowRead = this.onRowRead.bind(this);
    this.onReadEnd = this.onReadEnd.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
  }

  private async onRowRead(row: string, resolve: () => void) {
    const offer = createOffer(row);
    await this.saveOffer(offer);
    resolve();
  }

  private async onReadEnd(rowsCount: number) {
    console.info(`${rowsCount} rows imported.`);
    await this.databaseClient.disconnect();
  }

  private async saveOffer(offer: OfferType) {
    const user = await this.userService.findByEmailOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD,
    }, this.salt);

    await this.offerService.createOffer({
      ...offer,
      userId: user.id
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(
    filePath: string,
    dbUser: string,
    dbPassword: string,
    dbHost: string,
    dbPort: string,
    dbName: string,
    salt: string
  ): Promise<void> {
    this.salt = salt;

    const mongoUri = getMongoURI(
      dbUser,
      dbPassword,
      dbHost,
      dbPort,
      dbName
    );

    await this.databaseClient.connect(mongoUri);

    const fileReader = new TSVFileReader(filePath);
    fileReader.on(FileReaderEvents.RowRead, this.onRowRead);
    fileReader.on(FileReaderEvents.End, this.onReadEnd);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filePath}`);
      console.error(getErrorMessage(error));
    }
  }
}
