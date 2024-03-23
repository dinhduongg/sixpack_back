import { ZodError } from 'zod'

interface formError {
  [key: string]: string
}

export const errorMapper = (error: ZodError): formError => {
  const formError: formError = {}

  error.issues.forEach((issue) => {
    const fieldName = issue.path.filter((pathItem) => pathItem !== 'body').join('.')
    const errorMessage = issue.message
    formError[fieldName] = errorMessage
  })

  return formError
}
