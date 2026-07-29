import assert from 'node:assert/strict'

function emptyToBlank(value) {
  if (value == null) return null
  const trimmed = String(value).trim()
  return trimmed.length === 0 ? null : trimmed
}

function stars(count, max) {
  return '*'.repeat(Math.min(Math.max(count, 0), max))
}

function maskName(value) {
  const v = emptyToBlank(value)
  if (!v) return ''
  if (v.length <= 2) return v
  return v.slice(0, 2) + stars(v.length - 2, 5)
}

function maskEmail(value) {
  const v = emptyToBlank(value)
  if (!v) return ''

  const at = v.lastIndexOf('@')
  if (at <= 0 || at === v.length - 1) {
    return maskName(v)
  }

  const local = v.slice(0, at)
  const domain = v.slice(at + 1)
  const maskedLocal =
    local.length <= 2 ? local : local.slice(0, 2) + stars(local.length - 2, 5)

  const parts = domain.split('.')
  if (parts.length === 1) {
    const d = parts[0]
    const masked = d.length <= 1 ? d : d.slice(0, 1) + stars(d.length - 1, 5)
    return `${maskedLocal}@${masked}`
  }

  const tld = parts[parts.length - 1]
  const labels = parts.slice(0, -1).map((label) => {
    if (label.length <= 1) return label
    return label.slice(0, 1) + stars(label.length - 1, 5)
  })

  return `${maskedLocal}@${labels.join('.')}.${tld}`
}

function maskPhone(value) {
  const v = emptyToBlank(value)
  if (!v) return ''

  const digits = v.replace(/\D/g, '')
  if (digits.length === 0) return v
  if (digits.length <= 4) return v

  const visibleTail = digits.slice(-4)
  let digitIndex = 0
  const totalDigits = digits.length

  return [...v]
    .map((ch) => {
      if (!/\d/.test(ch)) return ch
      const fromEnd = totalDigits - digitIndex
      digitIndex += 1
      return fromEnd <= 4 ? visibleTail[4 - fromEnd] : '*'
    })
    .join('')
}

function maskAddress(value) {
  const v = emptyToBlank(value)
  if (!v) return ''
  if (v.length <= 4) return v
  return v.slice(0, 4) + stars(v.length - 4, 8)
}

assert.equal(maskName(null), '')
assert.equal(maskName(''), '')
assert.equal(maskName('Jo'), 'Jo')
assert.equal(maskName('John'), 'Jo**')
assert.equal(maskName('Jonathan'), 'Jo*****')

assert.equal(maskEmail('john@gmail.com'), 'jo**@g****.com')
assert.equal(maskEmail('ab@x.co'), 'ab@x.co')
assert.equal(maskEmail(undefined), '')

assert.equal(maskPhone('+2348012348901'), '+*********8901')
assert.equal(maskPhone('08012348901'), '*******8901')
assert.equal(maskPhone('1234'), '1234')

assert.equal(maskAddress('12 Main Street'), '12 M********')
assert.equal(maskAddress('Hi'), 'Hi')
assert.equal(maskAddress(null), '')

console.log('verify-mask-pii: ok')
