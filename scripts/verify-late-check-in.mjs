import assert from 'node:assert/strict'

const LATE_CHECK_IN_GRACE_MS = 0

function isVisitorLate(visitor, now = new Date()) {
  const start = new Date(visitor.startTime)
  if (Number.isNaN(start.getTime())) return false
  const due = start.getTime() + LATE_CHECK_IN_GRACE_MS

  if (visitor.status === 'pending') {
    return now.getTime() > due
  }

  if (visitor.checkedInAt) {
    const checkedIn = new Date(visitor.checkedInAt)
    if (Number.isNaN(checkedIn.getTime())) return false
    return checkedIn.getTime() > due
  }

  return false
}

const now = new Date('2026-07-29T12:00:00.000Z')

assert.equal(
  isVisitorLate(
    { status: 'pending', startTime: '2026-07-29T11:00:00.000Z', checkedInAt: '' },
    now,
  ),
  true,
)

assert.equal(
  isVisitorLate(
    { status: 'pending', startTime: '2026-07-29T13:00:00.000Z', checkedInAt: '' },
    now,
  ),
  false,
)

assert.equal(
  isVisitorLate(
    {
      status: 'checked_in',
      startTime: '2026-07-29T10:00:00.000Z',
      checkedInAt: '2026-07-29T11:30:00.000Z',
    },
    now,
  ),
  true,
)

assert.equal(
  isVisitorLate(
    {
      status: 'checked_in',
      startTime: '2026-07-29T10:00:00.000Z',
      checkedInAt: '2026-07-29T09:45:00.000Z',
    },
    now,
  ),
  false,
)

assert.equal(
  isVisitorLate(
    { status: 'canceled', startTime: '2026-07-29T10:00:00.000Z', checkedInAt: '' },
    now,
  ),
  false,
)

console.log('verify-late-check-in: ok')
