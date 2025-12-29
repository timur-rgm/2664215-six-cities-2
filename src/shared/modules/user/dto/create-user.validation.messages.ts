export const CreateUserValidationMessage = {
  name: {
    type: 'name must be a string',
    length: 'min name length is 1, max is 15',
  },
  email: {
    format: 'email must be a valid address',
  },
  password: {
    type: 'password must be a string',
    length: 'min password length is 6, max is 12',
  },
  avatarPath: {
    type: 'avatarPath must be a string',
  },
  type: {
    type: 'type must be one of the allowed user types'
  }
} as const;
