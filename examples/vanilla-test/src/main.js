let count = 0;

function updateCount() {
  count++;
  document.getElementById('count').textContent = count;
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('countBtn');
  button.addEventListener('click', updateCount);
});
