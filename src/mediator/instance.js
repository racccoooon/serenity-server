import { Mediator } from './index.js'

const mediator = new Mediator()

export const initializeMediator = () => {
  // We'll add all handler registrations here
  // Example:
  // mediator.register(CreateUserCommand, createUserHandler)

  return mediator
}

export { mediator }