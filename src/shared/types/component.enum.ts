export const Component = {
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  Logger: Symbol.for('Logger'),
  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  RestApplication: Symbol.for('RestApplication'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
} as const;
