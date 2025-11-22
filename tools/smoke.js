// simple smoke tests for local server

const base = 'http://localhost:5050';

async function run() {
  try {
    console.log('GET /');
    let r = await fetch(`${base}/`);
    console.log('status', r.status);
    const text = await r.text();
    console.log('body (first 200 chars):', text.slice(0, 200));

    console.log('\nGET /api/test');
    r = await fetch(`${base}/api/test`);
    console.log('status', r.status);
    console.log('body:', await r.text());

    console.log('\nSIGNUP (may fail if user exists)');
    r = await fetch(`${base}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'smoketest', email: 'smoke@example.com', password: 'Pass1234' }),
    });
    console.log('signup status', r.status);
    const signupBody = await r.text();
    console.log('signup body:', signupBody);

    console.log('\nLOGIN');
    r = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoke@example.com', password: 'Pass1234' }),
    });
    console.log('login status', r.status);
    const loginJson = await r.json().catch(() => null);
    console.log('login body:', loginJson);

    const token = loginJson?.token;
    if (!token) {
      console.warn('No token received; cannot continue task tests.');
      process.exit(0);
    }

    console.log('\nCREATE TASK');
    r = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Smoke task', description: 'Created by smoke test', status: 'pending' }),
    });
    console.log('create task status', r.status);
    console.log('create task body:', await r.json().catch(() => null));

    console.log('\nGET TASKS');
    r = await fetch(`${base}/api/tasks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('get tasks status', r.status);
    console.log('tasks:', await r.json().catch(() => null));

    console.log('\nSMOKE TESTS DONE');
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exit(2);
  }
}

run();
