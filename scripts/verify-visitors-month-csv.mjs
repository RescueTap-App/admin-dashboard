import assert from 'node:assert/strict'

const VisitorMonthBasis = {
  CheckedInAt: 'checkedInAt',
  CreatedAt: 'createdAt',
  StartTime: 'startTime',
}
const VISITOR_MONTH_BASIS = VisitorMonthBasis.CheckedInAt

function dateBelongsToMonth(value, ym) {
  if (value == null || value === '') return false
  const d = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(d.getTime())) return false
  return d.getFullYear() === ym.year && d.getMonth() + 1 === ym.month
}

function filterVisitorsByMonth(visitors, ym, basis = VISITOR_MONTH_BASIS) {
  return visitors.filter((row) => dateBelongsToMonth(row[basis], ym))
}

function csvEscape(value) {
  const raw = value == null ? '' : String(value)
  if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`
  return raw
}

function visitorsToCsv(rows) {
  const headers = ['Name', 'Phone']
  const lines = [
    headers.join(','),
    ...rows.map((row) => [row.name, row.phone].map(csvEscape).join(',')),
  ]
  return lines.join('\n')
}

assert.equal(VISITOR_MONTH_BASIS, 'checkedInAt')

const ym = { year: 2026, month: 7 }
const rows = [
  { name: 'A', phone: '1', checkedInAt: '2026-07-15T12:00:00.000Z', createdAt: '2026-06-15T12:00:00.000Z' },
  { name: 'B', phone: '2', checkedInAt: '2026-06-15T12:00:00.000Z', createdAt: '2026-07-15T12:00:00.000Z' },
  { name: 'C', phone: '3', checkedInAt: null, createdAt: '2026-07-20T12:00:00.000Z' },
]

assert.deepEqual(
  filterVisitorsByMonth(rows, ym).map((r) => r.name),
  ['A'],
)
assert.deepEqual(
  filterVisitorsByMonth(rows, ym, VisitorMonthBasis.CreatedAt).map((r) => r.name),
  ['B', 'C'],
)

const csv = visitorsToCsv([{ name: 'Ada, Love', phone: '123' }])
assert.ok(csv.includes('"Ada, Love"'))
assert.ok(csv.startsWith('Name,Phone'))

console.log('verify-visitors-month-csv: ok')
