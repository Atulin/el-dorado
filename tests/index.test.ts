import { expect, test } from "bun:test"
import { fn } from '../src'

test('fn', () => {
  expect(fn()).toBe('Hello, tsdown!')
})
