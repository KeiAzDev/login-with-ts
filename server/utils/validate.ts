export const validateLogin = (username: string, email: string, password: string) => {
  if(!username || !email || !password) {
    return { error: 'All fields are required' };
  }
  return null;
};