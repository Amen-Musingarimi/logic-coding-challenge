const { Hono } = require('hono');
const jwt = require('jsonwebtoken');
const { serveStatic } = require('hono/bun');

const app = new Hono();

app.use('*', serveStatic({ root: './dist' }));

app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || username.trim() === '') {
    return c.json({ message: 'Username required' }, 400);
  }
  if (!password || password.trim() === '') {
    return c.json({ message: 'Password required' }, 400);
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
        res.status
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

    return c.json({ message: 'Login success', user: userData }, 200);
  } catch (error) {
    console.log(error.message);
    return c.json({ message: 'Internal Server Error!!!' }, 500);
  }
});

module.exports = app;
