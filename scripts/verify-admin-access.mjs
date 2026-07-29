import assert from 'node:assert/strict'

function canAccessAdminApp(role) {
  return role === 'admin' || role === 'organization'
}

function homePathForRole(role) {
  if (role === 'admin') return '/dashboard/organizations'
  if (role === 'organization') return '/org'
  return null
}

function isPathAllowedForRole(role, pathname) {
  if (role === 'admin') return pathname.startsWith('/dashboard')
  if (role === 'organization') return pathname.startsWith('/org')
  return false
}

function isSafeRedirectForRole(role, redirect) {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return false
  }
  return isPathAllowedForRole(role, redirect)
}

assert.equal(canAccessAdminApp('admin'), true)
assert.equal(canAccessAdminApp('organization'), true)
assert.equal(canAccessAdminApp('user'), false)
assert.equal(canAccessAdminApp('driver'), false)
assert.equal(canAccessAdminApp(undefined), false)

assert.equal(homePathForRole('admin'), '/dashboard/organizations')
assert.equal(homePathForRole('organization'), '/org')
assert.equal(homePathForRole('user'), null)

assert.equal(isPathAllowedForRole('admin', '/dashboard/users'), true)
assert.equal(isPathAllowedForRole('admin', '/org'), false)
assert.equal(isPathAllowedForRole('organization', '/org/users'), true)
assert.equal(isPathAllowedForRole('organization', '/dashboard'), false)
assert.equal(isPathAllowedForRole('user', '/org'), false)

assert.equal(isSafeRedirectForRole('organization', '/org/emergencies'), true)
assert.equal(isSafeRedirectForRole('organization', '/dashboard/users'), false)
assert.equal(isSafeRedirectForRole('admin', '//evil.com'), false)
assert.equal(isSafeRedirectForRole('user', '/org'), false)

console.log('verify-admin-access: ok')
