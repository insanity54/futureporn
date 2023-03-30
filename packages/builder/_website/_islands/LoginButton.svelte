<script>

  import { Session, login } from 'svelte-session-manager';
  const isBrowser = (typeof process === 'undefined')
  $: redirectUrl = (isBrowser) ? window.location : ''


  let session = new Session(localStorage);

</script>


<div class="navbar-item">
  {#if session.isValid}
    <a 
      href="https://gw.futureporn.net/auth/logout?redirect_url={redirectUrl}"
      class="button is-warning is-outlined"
    >
      <span class="icon">
        <i class="fas fa-right-from-bracket"></i>
      </span>
      <span>Log out</span>
    </a>
  {:else}
    <a 
      href="https://gw.futureporn.net/auth/oauth2/patreon?redirect_url={redirectUrl}" 
      class="button is-warning is-outlined"
    >
      <span class="icon">
        <i class="fab fa-patreon"></i>
      </span>
      <span>Log in</span>
    </a>
  {/if}
  <slot></slot>
</div>