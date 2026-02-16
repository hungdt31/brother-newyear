(() => {
  const footerYear = document.getElementById("currentYear");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  const quoteElement = document.getElementById("wishQuote");
  const newWishButton = document.getElementById("newWishButton");

  if (quoteElement && newWishButton) {
    const wishMessages = [
      "\"Chuc anh nam moi ngap tran tieng cuoi, may man va suc khoe.\"",
      "\"Chuc anh va gia dinh don Tet am ap, doan vien va hanh phuc.\"",
      "\"Nam moi binh an, tai loc day nha, van su hanh thong anh nhe.\"",
      "\"Mong anh luon vui ve, lac quan va gap nhieu dieu tot dep.\"",
      "\"Chuc anh mot nam moi ruc ro, moi ngay deu la mot ngay vui.\"",
    ];
    let previousWishIndex = 0;

    newWishButton.addEventListener("click", () => {
      if (wishMessages.length === 1) {
        quoteElement.textContent = wishMessages[0];
        return;
      }

      let nextWishIndex = previousWishIndex;
      while (nextWishIndex === previousWishIndex) {
        nextWishIndex = Math.floor(Math.random() * wishMessages.length);
      }

      previousWishIndex = nextWishIndex;
      quoteElement.textContent = wishMessages[nextWishIndex];
    });
  }

  const canvasElement = document.getElementById("fireworksCanvas");
  const heroSection = document.querySelector(".hero");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (
    !(canvasElement instanceof HTMLCanvasElement) ||
    !(heroSection instanceof HTMLElement) ||
    reduceMotionQuery.matches
  ) {
    return;
  }

  const context = canvasElement.getContext("2d");
  if (!context) {
    return;
  }

  const particleColors = ["#ffd166", "#ffffff", "#ffc857", "#ffe5a5", "#ff9aad"];
  const particles = [];
  const gravity = 0.03;
  const friction = 0.985;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrameId = 0;

  /**
   * Sync canvas size with hero section while preserving sharp rendering.
   */
  function resizeCanvas() {
    const heroRect = heroSection.getBoundingClientRect();
    const deviceScale = window.devicePixelRatio || 1;

    canvasWidth = heroRect.width;
    canvasHeight = heroRect.height;

    canvasElement.width = Math.floor(canvasWidth * deviceScale);
    canvasElement.height = Math.floor(canvasHeight * deviceScale);
    canvasElement.style.width = `${canvasWidth}px`;
    canvasElement.style.height = `${canvasHeight}px`;

    context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  }

  function createBurst(centerX, centerY, count = 28) {
    for (let index = 0; index < count; index += 1) {
      const spreadAngle = (index / count) * Math.PI * 2;
      const randomOffset = (Math.random() - 0.5) * 0.28;
      const speed = 1.4 + Math.random() * 2.8;

      particles.push({
        x: centerX,
        y: centerY,
        velocityX: Math.cos(spreadAngle + randomOffset) * speed,
        velocityY: Math.sin(spreadAngle + randomOffset) * speed,
        alpha: 1,
        life: 36 + Math.random() * 32,
        size: 1.1 + Math.random() * 2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      });
    }
  }

  function spawnRandomBurst() {
    const randomX = canvasWidth * (0.12 + Math.random() * 0.76);
    const randomY = canvasHeight * (0.15 + Math.random() * 0.45);
    createBurst(randomX, randomY, 22 + Math.floor(Math.random() * 10));
  }

  function updateParticles() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.velocityX *= friction;
      particle.velocityY *= friction;
      particle.velocityY += gravity;
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life -= 1;
      particle.alpha = Math.max(0, particle.life / 60);

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      context.beginPath();
      context.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function animateFireworks() {
    if (Math.random() < 0.06) {
      spawnRandomBurst();
    }

    updateParticles();
    animationFrameId = window.requestAnimationFrame(animateFireworks);
  }

  resizeCanvas();
  spawnRandomBurst();
  spawnRandomBurst();
  animateFireworks();

  window.addEventListener("resize", resizeCanvas);

  // Pause animation when tab is hidden to reduce CPU usage.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      return;
    }

    if (animationFrameId === 0) {
      animateFireworks();
    }
  });
})();
