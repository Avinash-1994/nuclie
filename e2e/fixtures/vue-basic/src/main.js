// Vue basic fixture — minimal app entry
const app = document.createElement('div');
app.id = 'app';
app.innerHTML = '<h1>Hello from Vue Basic Fixture</h1>';
document.body.appendChild(app);

// Vue-like reactive counter (plain JS to avoid needing the full Vue runtime)
let count = 0;
const btn = document.createElement('button');
btn.textContent = 'Click me';
btn.addEventListener('click', () => {
    count++;
    btn.textContent = `Clicked ${count} times`;
});
app.appendChild(btn);
