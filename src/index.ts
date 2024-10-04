import path from "node:path"
import Handlebar from "handlebars"
import util from "node:util"

async function loadConfig(cwd: string) {
  // Iterate through all possible permutations and find one that works:
  //
  // - `./.navia/config.(js|mjs|cjs|ts|mts|cts|yml|yaml|json|toml)`
  // - `./navia.config.(js|mjs|cjs|ts|mts|cts|yml|yaml|json|toml)`

  const configPaths = [
    './.navia/config',
    './navia.config'
  ]

  const exts = 'js,mjs,cjs,ts,mts,cts,yml,yaml,json,toml'.split(',')

  for (const configPath of configPaths) {
    for (const ext of exts) {
      const filePath = path.resolve(cwd, `${configPath}.${ext}`)

      try {
        return await import(filePath)
      } catch (error) {
        // TODO Implement continue if the error is file does not exists
        // Check the error object in Node
        if (error instanceof ResolveMessage) {
          continue
        }

        throw error
      }
    }
  }
}

export interface WriteOpts {
  cwd?: string
}

export async function write(opts: WriteOpts = {}) {
  const {
    cwd = process.cwd()
  } = opts

  const config = await loadConfig(cwd)

  const templateGlob = new Bun.Glob("**/*.navia")
  const files = await Array.fromAsync(templateGlob.scan({ cwd }))

  const hbs = Handlebar.create();

  for (const file of files) {
    let content = await Bun.file(path.join(cwd, file)).text()

    const tpl = hbs.compile(content)
    content = tpl({
      pkg: await Bun.file(path.join(cwd, 'package.json')).json()
    })

    const outputPath = path.join(cwd, file.replace(/\.navia$/, ''))
    await Bun.write(outputPath, content)
  }
}
