export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  city: {
    type: 'city must be one of the allowed cities',
  },
  previewImage: {
    type: 'previewImage must be a string',
  },
  images: {
    type: 'images must be an array',
    count: 'images must contain exactly 6 items',
    itemType: 'each image must be a string',
  },
  isPremium: {
    type: 'isPremium must be a boolean',
  },
  isFavorite: {
    type: 'isPremium must be a boolean',
  },
  rating: {
    type: 'rating must be a number with at most 1 decimal place',
    minValue: 'Minimum rating value must be 0',
    maxValue: 'Maximum rating value must be 5',
  },
  type: {
    type: 'type must be one of the allowed housing types'
  },
  bedrooms: {
    type: 'bedrooms must be an integer',
    minValue: 'Minimum bedrooms value must be 1',
    maxValue: 'Maximum bedrooms value must be 8',
  },
  maxAdults: {
    type: 'maxAdults must be an integer',
    minValue: 'Minimum maxAdults value must be 1',
    maxValue: 'Maximum maxAdults value must be 10',
  },
  price: {
    type: 'price must be an integer',
    minValue: 'Minimum price value must be 100',
    maxValue: 'Maximum price value must be 100 000',
  },
  amenities: {
    type: 'images must be an array',
    minItems: 'amenities must contain at least 1 item',
    itemType: 'each amenity must be one of allowed amenities',
  },
  userId: {
    id: 'userId must be a valid id',
  },
  location: {
    type: 'latitude and longitude must be a number',
  }
} as const;
