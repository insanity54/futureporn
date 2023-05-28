
window.backend = document.querySelector('#backend-url').innerHTML
window.companionUrl = document.querySelector('#companion-url').innerHTML

import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import registerEnvStore from '/@includes/alpine/stores/env.js'
import registerAuthStore from '/@includes/alpine/stores/auth.js'
import registerUserStore from '/@includes/alpine/stores/user.js'
import auth from '/@includes/alpine/components/auth.js'
import player from '/@includes/alpine/components/player.js'
import user from '/@includes/alpine/components/user.js'
import upload from '/@includes/alpine/components/upload.js'
import tagger from '/@includes/alpine/components/tagger.js'

Alpine.plugin(persist)
registerEnvStore(Alpine)
registerAuthStore(Alpine)
registerUserStore(Alpine)

window.auth = auth;
window.player = player;
window.upload = upload;
window.user = user;
window.tagger = tagger;
window.Alpine = Alpine;

queueMicrotask(() => {
  Alpine.start();
});


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


