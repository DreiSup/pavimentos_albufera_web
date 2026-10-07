import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getPostalCodeName, getPostalCodeProvinces, getProvincePostalCodeNames } from './postal-code-names.ts'

test('known postal codes return their main town, first form of bilingual names', () => {
  const cases: [string, string][] = [
    ['46440', 'Almussafes'],
    ['41001', 'Sevilla'],
    ['46300', 'Utiel'],
    ['03001', 'Alicante'],
    ['12001', 'Castellón de la Plana'],
    ['46 430', 'Sollana'],
  ]
  for (const [cp, name] of cases) assert.equal(getPostalCodeName(cp), name, cp)
})

test('unknown or malformed postal codes return undefined', () => {
  for (const cp of ['00123', '53001', '4644', '46A40', '', 'toString']) assert.equal(getPostalCodeName(cp), undefined, cp)
  assert.equal(getProvincePostalCodeNames('__proto__'), undefined)
})

test('every province 01–52 is present', () => {
  assert.equal(getPostalCodeProvinces().length, 52)
})
