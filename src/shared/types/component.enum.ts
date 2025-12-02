export const Component = {
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  Logger: Symbol.for('Logger'),
  OfferController: Symbol.for('OfferController'),
  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  RestApplication: Symbol.for('RestApplication'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
} as const;
