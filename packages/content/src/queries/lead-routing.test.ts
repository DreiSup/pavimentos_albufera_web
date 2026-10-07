import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyLead, isValidPostalCode, parseSquareMeters } from './lead-routing.ts'

const zone = (postalCode: string, squareMeters: number | null = 100) =>
  classifyLead({ postalCode, squareMeters })

test('Zone A: postal codes inside the polygon accept any surface', () => {
  for (const cp of ['46430', '46440', '46600', '46610', '46680', '46001', '12598', '03501', '46300']) {
    assert.deepEqual(zone(cp, 1), { zone: 'A', accepted: true, minSquareMeters: null }, cp)
  }
})

test('Zone B: rest of the Comunitat Valenciana needs more than 500 m²', () => {
  for (const cp of ['03001', '03203', '12300']) {
    assert.equal(zone(cp).zone, 'B', cp)
    assert.equal(zone(cp, 499).accepted, false)
    assert.equal(zone(cp, 500).accepted, false)
    assert.equal(zone(cp, 501).accepted, true)
  }
})

test('Zone C: rest of Spain needs more than 1000 m²', () => {
  for (const cp of ['28001', '41001', '01001', '52001']) {
    assert.equal(zone(cp).zone, 'C', cp)
    assert.equal(zone(cp, 999).accepted, false)
    assert.equal(zone(cp, 1000).accepted, false)
    assert.equal(zone(cp, 1001).accepted, true)
  }
})

test('unknown postal codes and missing surfaces are accepted', () => {
  for (const cp of ['', '4643', '464300', 'abcde', '00123', '53001', '99999']) {
    assert.deepEqual(zone(cp, 1), { zone: 'unknown', accepted: true, minSquareMeters: null }, cp)
  }
  assert.equal(zone('28001', null).accepted, true)
})

test('postal codes typed with spaces are normalized', () => {
  assert.equal(zone('46 440').zone, 'A')
  assert.equal(isValidPostalCode(' 28001 '), true)
  assert.equal(isValidPostalCode('00000'), false)
})

test('parseSquareMeters reads plain numbers, units, decimals and Spanish thousands', () => {
  const cases: [string, number | null][] = [
    ['80', 80],
    [' 80 ', 80],
    ['80 m2', 80],
    ['80m²', 80],
    ['80 metros', 80],
    ['80 metros cuadrados', 80],
    ['120,5', 120.5],
    ['1.5', 1.5],
    ['1.200', 1200],
    ['1.200 m2', 1200],
    ['10x5', 50],
    ['10 × 5', 50],
    ['10*5,5', 55],
    ['', null],
    ['0', null],
    ['unos 80', null],
    ['no sé', null],
    ['80-100', null],
  ]
  for (const [raw, expected] of cases) assert.equal(parseSquareMeters(raw), expected, JSON.stringify(raw))
})
