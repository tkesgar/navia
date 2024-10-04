import path from "node:path"
import Handlebar from "handlebars"

export async function write() {
  const cwd = './tests/fixtures/readme'

  const templateGlob = new Bun.Glob("**/*.navia")
  const files = await Array.fromAsync(templateGlob.scan({ cwd }))

  const hbs = Handlebar.create();

  for (const file of files) {
    let content = await Bun.file(path.join(cwd, file)).text()

    const tpl = hbs.compile(content)
    content = tpl({
      pkg: await Bun.file(path.join(cwd, 'package.json')).json()
    })
    console.log(content)

    const outputPath = path.join(cwd, file.replace(/\.navia$/, ''))
    await Bun.write(outputPath, content)
  }
}
