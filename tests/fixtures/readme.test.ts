import { describe, expect, it } from "bun:test"
import * as navia from "../../src"

describe('fixture: readme', () => {
  it('should write expected README.md output', async () => {
    await navia.write()

    expect(await Bun.file('./tests/fixtures/readme/README.md').text()).toEqual(await Bun.file('./tests/fixtures/readme/README.md.expected').text())
  })
})
