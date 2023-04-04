import fs from 'fs'

const parse = (str) => {
  const original = str

  const regex = /{{(.*?)}}/g
  let match

  while ((match = regex.exec(str)) !== null) {
    match.input = 'no'

    if (!fs.existsSync(`./src/public/components/${match[1]}.html`))
      return original

    const file = fs.readFileSync(
      `./src/public/components/${match[1]}.html`,
      'utf8'
    )

    str = str.replace(match[0], file)
  }
  return str
}

export default parse
