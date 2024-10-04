import { describe, expect, it } from "bun:test"
import * as navia from "../../src"
import path from "node:path"

const CWD = './tests/fixtures/readme'

function cwdFile(filePath: string) {
  return Bun.file(path.join(CWD, filePath))
}

describe('fixture: config-throw-error', () => {
  it('should handle importing config throws error', async () => {
    await expect(navia.write({
      cwd: './tests/fixtures/config-throw-error'
    })).rejects.toThrowError("Oh noes")
  })
})
