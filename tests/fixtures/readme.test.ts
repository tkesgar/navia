import { describe, expect, it } from "bun:test"
import * as navia from "../../src"
import path from "node:path"

const CWD = './tests/fixtures/readme'

function cwdFile(filePath: string) {
  return Bun.file(path.join(CWD, filePath))
}

describe('fixture: readme', () => {
  it('should write expected README.md output', async () => {
    await navia.write({
      cwd: CWD
    })

    expect(await cwdFile('README.md').text()).toEqual(await cwdFile('README.md.expected').text())
  })
})
