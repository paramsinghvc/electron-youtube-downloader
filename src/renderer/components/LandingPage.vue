<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/video-camera.svg" alt="electron-vue">
    <main>
		<downloader/>
    </main>
  </div>
</template>

<script>
  import Downloader from './LandingPage/Downloader'

  export default {
    name: 'landing-page',
    components: { Downloader }
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
	margin: auto;
    width: 50px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }
</style>
