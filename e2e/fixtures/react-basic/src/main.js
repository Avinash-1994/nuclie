// React basic fixture — minimal app entry
const root = document.createElement('div');
root.id = 'root';
root.innerHTML = '<h1>Hello from React Basic Fixture</h1>';
document.body.appendChild(root);

// React-like state counter (plain JS)
let count = 0;
const btn = document.createElement('button');
btn.textContent = 'Count: 0';
btn.addEventListener('click', () => {
    count++;
    btn.textContent = `Count: ${count}`;
});
root.appendChild(btn);
