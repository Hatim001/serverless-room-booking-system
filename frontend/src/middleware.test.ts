test('isPublicPath should match the pattern for public paths using regex', () => {
  const publicPathsRegex = new RegExp(`^(${PUBLIC_PATHS.join('|')})`);
  expect(isPublicPath('/user/login')).toBe(true);
  expect(isPublicPath('/rooms')).toBe(true);
  expect(isPublicPath('/user/login/mfa-verify')).toBe(true);
  expect(isPublicPath('/api/user/login')).toBe(false);
  expect(isPublicPath('/_next/static/css/main.css')).toBe(false);
  expect(isPublicPath('/favicon.ico')).toBe(false);
});
