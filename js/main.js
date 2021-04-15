'use strict';

window.addEventListener('load', async () => {
  const ul = document.querySelector('ul');
  const rfrsh = document.querySelector('#refresh');
  const form = document.querySelector('form');
  const username = 'Matias';
  const greeting = form.elements.greeting;
  console.log('hello');

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const message = {
            username: username,
            greeting: greeting.value
          }
          try {
            saveData('outbox', message);
            await registration.sync.register('send-message');
          } catch (e) {
            console.error(e.message);
          }
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  const init = async () => {
    const data = [];
    try {
      const greetings = await getGreetingsByUser(username);
      for (const message of greetings) {
        data.push(message);
      }
    }
    catch (e) {
      console.log(e.message);
    }

    ul.innerHTML = '';
    data.forEach(item => {
      ul.innerHTML += `<ul>${item.username}: ${item.greeting}</ul>`;
    });
  };

  init();

  rfrsh.addEventListener('click', init);
});
