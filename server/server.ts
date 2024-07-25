import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import { StatusCode } from 'hono/utils/http-status';

const app = new Hono();

app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || username.trim() === '') {
    return c.json({ message: 'Username required' }, 400 as StatusCode);
  }
  if (!password || password.trim() === '') {
    return c.json({ message: 'Password required' }, 400 as StatusCode);
  }

  try {
    const res = await fetch(
      'https://7qk9m2xvu2.us-west-2.awsapprunner.com/v1/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenantid': 'SchryverPruebas',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return c.json(
        { message: errorData.message || 'Invalid username or password' },
        res.status as StatusCode
      );
    }

    const data = await res.json();
    const token = data.access_token;

    if (!token) {
      throw new Error('No token received from the authentication server');
    }

    const userData = JSON.stringify(jwt.decode(token), null, 2);

    if (!userData) {
      throw new Error('Failed to decode the token');
    }

    return c.json(
      { message: 'Login success', user: userData },
      200 as StatusCode
    );
  } catch (error) {
    console.log(error.message);
    return c.json(
      { message: 'Oops, Internal Server Error' },
      500 as StatusCode
    );
  }
});

export default app;
