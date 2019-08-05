<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="dark"
    class="bd-navbar"
  >
    <b-navbar-toggle target="nav_collapse" />
    <b-navbar-brand>{{ brand }}</b-navbar-brand>

    <b-collapse
      id="nav_collapse"
      is-nav
    >
      <b-navbar-nav>
        <b-nav-item
          :to="{ name: 'Home' }"
          exact
        >
          Home
        </b-nav-item>
        <b-nav-item
          :to="{ name: 'Tester' }"
        >
          Posts Tester
        </b-nav-item>
        <b-nav-item
          :to="{ name: 'Settings' }"
        >
          Settings
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>



<script>
export default {
  name: 'AppMenu',
  data() {
    return {
      brand: 'Test Interface',
    };
  },
};
</script>



<style scoped lang="scss">
/* Mostly stolen from the bootstrap docs */

  @import '~bootstrap/scss/_functions';
  @import '~bootstrap/scss/_variables';
  @import '~bootstrap/scss/mixins/_breakpoints';

  .bd-navbar {
    min-height: 4rem;
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .05), inset 0 -1px 0 rgba(0, 0, 0, .1);

    @include media-breakpoint-down(md) {
      padding-right: .5rem;
      padding-left: .5rem;

      .navbar-nav-scroll {
        max-width: 100%;
        height: 2.5rem;
        margin-top: .25rem;
        overflow: hidden;
        font-size: .875rem;

        .navbar-nav {
          padding-bottom: 2rem;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
      }
    }

    @include media-breakpoint-up(md) {
      @supports (position: sticky) {
        position: sticky;
        top: 0;
        // Tumblr iframe buttons have z-index of 99 and are positioned on the right side of the bar.
        z-index: 99;
      }
    }
  }
</style>
