import { faker } from '@faker-js/faker'

export const tipologias = Array.from({ length: 20 }, () => {
  return {
    id: faker.string.uuid(),
    identificacao: faker.string.alpha(10),
    descricao: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
