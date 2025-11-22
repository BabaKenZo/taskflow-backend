// helper: create a task with a description (uses smoke user)
const base = 'http://localhost:5050';

async function run(){
  try{
    console.log('Logging in...');
    const login = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: 'smoke@example.com', password: 'Pass1234' }),
    });
    const loginJson = await login.json();
    console.log('login status', login.status, loginJson);
    const token = loginJson?.token;
    if(!token){ console.error('No token'); process.exit(1); }
    console.log('Creating task with description...');
    const res = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Buy Milk', description: '2 liters, whole milk', status: 'pending' })
    });
    console.log('create status', res.status, await res.json().catch(()=>null));
    const tasks = await (await fetch(`${base}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } })).json();
    console.log('tasks:', tasks);
  }catch(e){ console.error(e); process.exit(2);} }
run();
