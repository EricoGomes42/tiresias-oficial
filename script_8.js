
      let isGlobalMuted = false;

      // Single Interaction Observer to unlock audio context in browsers
      const unlockAudioContext = () => {
        if (isGlobalMuted) return;
        // Attempt to play ambient if it's paused or hasn't started due to strict autoplay policies
        if (AudioManager.ambient && AudioManager.ambient.paused) {
          AudioManager.ambient.volume = 0;
          let playPromise = AudioManager.ambient.play();
          if (playPromise !== undefined) {
            playPromise
              .then((_) => {
                // Fade in volume gracefully on first user interaction
                let vol = 0;
                let fade = setInterval(() => {
                  if (vol < 0.3) {
                    vol += 0.05;
                    AudioManager.ambient.volume = parseFloat(vol.toFixed(2));
                  } else {
                    clearInterval(fade);
                  }
                }, 200);
              })
              .catch((error) => {
                console.log(
                  "Audio unlock failed until explicit interaction.",
                  error,
                );
              });
          }
        }
        // Remove the event listeners after first interaction
        document.removeEventListener("click", unlockAudioContext);
        document.removeEventListener("touchstart", unlockAudioContext);
        document.removeEventListener("keydown", unlockAudioContext);
      };

      // Attach global interaction listeners for audio context unlocking
      document.addEventListener("click", unlockAudioContext, { once: true });
      document.addEventListener("touchstart", unlockAudioContext, {
        once: true,
      });
      document.addEventListener("keydown", unlockAudioContext, { once: true });

      const AudioManager = {
        ambient: null,
        start: null,
        loading: null,
        reveal: null,

        init: function () {
          this.ambient = document.getElementById("bgAmbient");
          this.start = document.getElementById("sndStart");
          this.loading = document.getElementById("sndLoading");
          this.reveal = document.getElementById("sndRevelation");

          // Set initial volumes
          if (this.ambient) this.ambient.volume = 0;

          // Attempt to play ambient on load
          this.startAmbientOnLoad();
        },

        toggleMute: function () {
          isGlobalMuted = !isGlobalMuted;
          const unmutedIcon = document.getElementById("icon-unmuted");
          const mutedIcon = document.getElementById("icon-muted");
          const mUnmuted = document.getElementById("mob-icon-unmuted");
          const mMuted = document.getElementById("mob-icon-muted");

          if (isGlobalMuted) {
            if (unmutedIcon) unmutedIcon.style.display = "none";
            if (mutedIcon) mutedIcon.style.display = "block";
            if (mUnmuted) mUnmuted.style.display = "none";
            if (mMuted) mMuted.style.display = "block";
            if (this.ambient) this.ambient.muted = true;
            if (this.start) this.start.muted = true;
            if (this.loading) this.loading.muted = true;
            if (this.reveal) this.reveal.muted = true;
          } else {
            if (unmutedIcon) unmutedIcon.style.display = "block";
            if (mutedIcon) mutedIcon.style.display = "none";
            if (mUnmuted) mUnmuted.style.display = "block";
            if (mMuted) mMuted.style.display = "none";
            if (this.ambient) this.ambient.muted = false;
            if (this.start) this.start.muted = false;
            if (this.loading) this.loading.muted = false;
            if (this.reveal) this.reveal.muted = false;

            // If ambient was stopped, resume it
            if (this.ambient && this.ambient.paused) {
              this.ambient.play().catch(() => {});
              this.ambient.volume = 0.5;
            }
          }
        },

        startAmbientOnLoad: function () {
          if (this.ambient) {
            // Try autoplaying unmuted first
            this.ambient.volume = 0.5;
            this.ambient.muted = false;
            this.ambient
              .play()
              .then(() => {
                // Success Auto-play
                isGlobalMuted = false;
                const u = document.getElementById("icon-unmuted");
                const m = document.getElementById("icon-muted");
                if (u) u.style.display = "block";
                if (m) m.style.display = "none";
                const mu = document.getElementById("mob-icon-unmuted");
                const mm = document.getElementById("mob-icon-muted");
                if (mu) mu.style.display = "block";
                if (mm) mm.style.display = "none";
              })
              .catch((error) => {
                // Browser blocked unmuted autoplay.
                // We do NOT mute it. We just wait for unlockAudioContext to handle it
                // on the first user interaction (click/touch anywhere).
                console.log(
                  "Autoplay blocked. Waiting for first interaction...",
                );
              });
          }
        },

        playAmbientInteracted: function () {
          if (this.ambient) {
            if (!isGlobalMuted) this.ambient.muted = false;

            if (this.ambient.paused) {
              this.ambient.volume = 0;
              this.ambient.play().catch(() => {});
            }

            // Fade In (0 to 0.5 in 2 seconds -> 0.05 every 200ms = 10 steps)
            let v = this.ambient.volume;
            const fade = setInterval(() => {
              v += 0.05;
              if (v >= 0.5) {
                this.ambient.volume = 0.5;
                clearInterval(fade);
              } else {
                this.ambient.volume = v;
              }
            }, 200);
          }
        },

        stopAmbient: function () {
          if (this.ambient && !this.ambient.paused) {
            let v = this.ambient.volume;
            const fade = setInterval(() => {
              v -= 0.05;
              if (v <= 0.05) {
                this.ambient.volume = 0;
                this.ambient.pause();
                clearInterval(fade);
              } else {
                this.ambient.volume = v;
              }
            }, 200);
          }
        },

        playStart: function () {
          if (this.start) {
            this.start.muted = isGlobalMuted;
            this.start.currentTime = 0;
            this.start.play().catch(() => {});
          }
        },

        playLoading: function () {
          if (this.loading) {
            this.loading.muted = isGlobalMuted;
            this.loading.currentTime = 0;
            this.loading.play().catch(() => {});
          }
        },

        stopLoading: function () {
          if (this.loading) {
            this.loading.pause();
            this.loading.currentTime = 0;
          }
        },

        playReveal: function () {
          if (this.reveal) {
            this.reveal.muted = isGlobalMuted;
            this.reveal.currentTime = 0;
            this.reveal.play().catch(() => {});
          }
        },
      };

      // Initialize Audio Manager when DOM is ready
      document.addEventListener("DOMContentLoaded", () => {
        AudioManager.init();
      });
    