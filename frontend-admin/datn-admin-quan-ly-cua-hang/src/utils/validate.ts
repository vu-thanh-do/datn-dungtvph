import * as Yup from 'yup'

const REGEX_MATCH =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\+?(?:84|0)\s?([3-9]\d{1,2})\s?\d{1,3}[-.\s]?\d{4,}))$/

Yup.addMethod<Yup.StringSchema>(Yup.string, 'regexMatch', function (message: string) {
  return this.matches(REGEX_MATCH, {
    message,
    excludeEmptyString: true
  })
})

Yup.addMethod<Yup.StringSchema>(Yup.string, 'checkLength', function (message) {
  return this.test('len', message, function (value) {
    const { path, createError } = this
    return (value && value.length >= 6) || createError({ path, message })
  })
})

export default Yup
