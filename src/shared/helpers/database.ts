export const getMongoURI = (
  dbUser: string,
  dbPassword: string,
  dbHost: string,
  dbPort: string,
  dbName: string,
) => `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
