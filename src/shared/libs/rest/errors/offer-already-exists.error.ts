export class OfferAlreadyExistsError extends Error {
  constructor(title: string) {
    super(`Offer with name «${title}» exists.`);
    this.name = 'OfferAlreadyExistsError';
  }
}
