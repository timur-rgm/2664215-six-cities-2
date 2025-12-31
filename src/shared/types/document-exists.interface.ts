export interface DocumentExists {
  exist(documentId: string): Promise<boolean>;
}
