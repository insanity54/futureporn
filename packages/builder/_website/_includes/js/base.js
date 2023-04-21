
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import auth from '/@includes/alpine/auth.js'
import player from '/@includes/alpine/player.js'
import user from '/@includes/alpine/user.js'

Alpine.plugin(persist)
Alpine.data('auth', auth)
Alpine.data('user', user)
Alpine.data('player', player)
Alpine.store('env', {
  backendUrl: document.querySelector('#backend-url').innerHTML, // can't access $refs at this point
  jwt: Alpine.$persist('')
})
window.Alpine = Alpine

Alpine.start()


// handler for the burger menu
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});


