export const CreateUserValidationMessage = {
  name: {
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 15',
  },
  email: {
    format: 'email must be a valid address',
  },
  password: {
    minLength: 'Minimum password length must be 6',
    maxLength: 'Maximum password length must be 12',
  },
  avatarPath: {
    type: 'avatarPath must be a string',
  },
  type: {
    type: 'type must be one of the allowed user types'
  }
} as const;
