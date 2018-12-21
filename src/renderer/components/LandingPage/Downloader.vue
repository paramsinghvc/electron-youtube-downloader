<template>
  <section class="container">
    <h2 class="title">Downloader</h2>
    <div class="group">
      <input type="text" required autofocus class="full-width" @input="getVideoInfo">
      <span class="highlight"></span>
      <span class="bar"></span>
      <label>Paste Link Here</label>
    </div>
    <h2 class="video-title">{{video.title}}</h2>
    <section class="progress-bar-holder" v-bind:class="{ hidden: !videoDownloading }">
      <p class="count">
        {{Math.round(downloadedPercentage)}} % -
        <span>{{downlinkSpeed}}</span>
      </p>
      <div class="progress-bar" v-bind:style="{ width: downloadedPercentage + '%' }"></div>
    </section>
    <ul class="videos-holder">
      <li v-for="vid in video.videos">
        <img :src="video.thumbnail_url">
        <p>{{vid.quality.toUpperCase()}}</p>
        <strong>{{vid.ext}}</strong>
        <button @click="downloadVideo(vid.url, `${video.title}.${vid.ext}`)">Download</button>
      </li>
    </ul>
  </section>
</template>

<script>
import YouTubeDownloader from "../../utils/Downloader.js";
import ProgressiveFetch from "../../utils/ProgressiveFetch.js";
import { downloadFileFromBlob } from "../../utils/misc.js";

export default {
  data() {
    return {
      videoDownloading: false,
      downloadedPercentage: 0,
      downlinkSpeed: 0
    };
  },
  computed: {
    video() {
      return this.$store.state.Main.video;
    }
  },
  methods: {
    updateDownloadingPercentage(perc) {
      this.downloadedPercentage = perc;
    },
    downloadVideo(url, videoName) {
      ProgressiveFetch(
        `http://localhost:8082/download-video?url=${encodeURIComponent(url)}`,
        {
          initAction: () => (this.videoDownloading = true),
          updateAction: ({ loaded, speed }) => {
            requestAnimationFrame(() => {
              this.updateDownloadingPercentage(loaded);
              this.downlinkSpeed = speed;
            });
          }
        }
      )
        .then(response => response.blob())
        .then(res => {
          console.log("Completed");
          this.videoDownloading = false;
          this.updateDownloadingPercentage(0);
          downloadFileFromBlob(res, videoName);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getVideoInfo(e) {
      try {
        YouTubeDownloader(e.target.value).then(videoData => {
          console.log("videos", videoData);
          this.$store.dispatch("setVideo", videoData);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style scoped lang="scss">
section.progress-bar-holder {
  height: 100px;
  p.count {
    font-size: 30px;
    font-weight: 300;
    text-align: center;
    margin-bottom: 20px;
    color: #e74c3c;
  }
  .progress-bar {
    transition: width 0.1s;
    width: 100%;
    border: 2px solid #e74c3c;
    height: 1px;
  }
  &.hidden {
    visibility: hidden;
  }
}
h2.video-title {
  margin-bottom: 20px;
}
ul.videos-holder {
  list-style: none;
  display: inline-flex;
  flex-wrap: wrap;
  > li {
    padding: 10px;
    margin: 10px;
    /* box-shadow: 0 0 12px rgba($color: #000000, $alpha: 0.2); */
    border: 2px solid rgb(210, 210, 210);
    border-radius: 3px;
    &:first-of-type {
      margin-left: 0;
    }
    display: flex;
    flex-direction: column;
    > img {
      margin-bottom: 10px;
    }
    > p,
    strong {
      font-size: 12px;
    }
    > button {
      margin-top: 15px;
    }
  }
}
button {
  background: none;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  padding: 10px 15px;
  border-radius: 3px;
  font-weight: bold;
  transition: 0.2s;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #e74c3c;
    color: #ffffff;
  }
  &:active {
    background: #b13b2e;
  }
}
.container {
  width: 100%;
}
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
  margin-bottom: 40px;
}

.group {
  position: relative;
  margin-bottom: 45px;
}
input {
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 300px;
  border: none;
  border-bottom: 1px solid #757575;
  background: none;

  &.full-width {
    width: 100%;
  }
}
input:focus {
  outline: none;
}

/* LABEL ======================================= */
label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

/* active state */
input:focus ~ label,
input:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #5264ae;
}

/* BOTTOM BARS ================================= */
.bar {
  position: relative;
  display: block;
  width: 100%;
}
.bar:before,
.bar:after {
  content: "";
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264ae;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}
.bar:before {
  left: 50%;
}
.bar:after {
  right: 50%;
}

/* active state */
input:focus ~ .bar:before,
input:focus ~ .bar:after {
  width: 50%;
}

/* HIGHLIGHTER ================================== */
.highlight {
  position: absolute;
  height: 60%;
  width: 100px;
  top: 25%;
  left: 0;
  pointer-events: none;
  opacity: 0.5;
}

/* active state */
input:focus ~ .highlight {
  -webkit-animation: inputHighlighter 0.3s ease;
  -moz-animation: inputHighlighter 0.3s ease;
  animation: inputHighlighter 0.3s ease;
}

/* ANIMATIONS ================ */
@-webkit-keyframes inputHighlighter {
  from {
    background: #5264ae;
  }
  to {
    width: 0;
    background: transparent;
  }
}
@-moz-keyframes inputHighlighter {
  from {
    background: #5264ae;
  }
  to {
    width: 0;
    background: transparent;
  }
}
@keyframes inputHighlighter {
  from {
    background: #5264ae;
  }
  to {
    width: 0;
    background: transparent;
  }
}
</style>
