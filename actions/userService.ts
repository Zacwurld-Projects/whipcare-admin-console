export const userService = {
  authenticate,
};

async function authenticate(email: string, password: string) {
  if (email !== 'whipcare@zacwurld.com' || password !== 'whipcare2024') {
    return null;
  }

  const user = {
    id: '9001',
    name: 'Zacwurld',
    email: 'whipcare@zacwurld.com',
  };

  return user;
}
