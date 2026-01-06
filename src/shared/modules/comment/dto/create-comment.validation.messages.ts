export const CreateCommentValidationMessage = {
  text: {
    type: 'text must be a string',
    length: 'min text length is 5, max is 1024',
  },
  rating: {
    type: 'rating must be a number',
    minValue: 'Minimum rating value must be 1',
    maxValue: 'Maximum rating value must be 5',
  },
  offerId: {
    format: 'offerId field must be a valid id'
  },
  userId: {
    format: 'userId field must be a valid id'
  }
} as const;
