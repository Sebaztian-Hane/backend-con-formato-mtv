// Import the particles.js library dynamically
export const initializeParticles = () => {
  const script = document.createElement('script');
  script.src = 'http://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 5, density: { enable: true, value_area: 800 } },
        color: { value: '#20362e' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#8aa967' },
          polygon: { nb_sides: 7 },
          image: { src: 'img/github.svg', width: 100, height: 100 },
        },
        opacity: {
          value: 0.27980301867485297,
          random: false,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 187.8677411102584,
          random: true,
          anim: {
            enable: false,
            speed: 75.66019417475735,
            size_min: 39.64401294498385,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 5.690254677548571,
          direction: 'top',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: false, mode: 'repulse' },
          onclick: { enable: false, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  };

  return () => {
    document.body.removeChild(script);
  };
};
