/* Simple Biography Intro Animation */
(function () {
  var overlay = document.createElement("div");
  overlay.className = "bio-intro";
  overlay.innerHTML = `
    <canvas class="bio-canvas"></canvas>
    <div class="bio-vignette"></div>
    <div class="bio-grid"></div>
    <div class="bio-scan"></div>
    <div class="bio-content">
      <div class="bio-ring"><img alt=""></div>
      <span class="bio-label">BIOGRAPHY</span>
      <h2 class="bio-name"></h2>
      <div class="bio-underline"></div>
      <p class="bio-tagline"></p>
    </div>
    <div class="bio-progress"></div>
    <div class="bio-skip">Click to skip</div>`;
  document.body.appendChild(overlay);

  var canvas = overlay.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var content = overlay.querySelector(".bio-content");
  var busy = false;
  var currentModalId = "";
  var finishTimer;
  var animationFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Halkay se moving light particles
  var particles = Array.from({ length: 45 }, function () {
    return { x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      size: Math.random() * 2 + 1, speed: Math.random() * 0.7 + 0.2 };
  });
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.y -= p.speed;
      if (p.y < 0) p.y = canvas.height;
      ctx.fillStyle = "rgba(215,255,89,.55)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    if (busy) animationFrame = requestAnimationFrame(drawParticles);
  }

  function closeIntro(modalId) {
    if (!busy) return;
    clearTimeout(finishTimer);
    var modal = document.getElementById(modalId);
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
    overlay.classList.add("leaving");
    setTimeout(function () {
      overlay.classList.remove("active", "leaving");
      busy = false;
      cancelAnimationFrame(animationFrame);
    }, 800);
  }

  function showIntro(button) {
    if (busy) return;
    busy = true;
    var modalId = button.getAttribute("data-bs-target").slice(1);
    currentModalId = modalId;
    var card = button.closest(".card");
    var name = card.querySelector(".card-title").textContent.trim();
    var photo = card.querySelector(".card-img-top").getAttribute("src");
    var tagline = card.querySelector(".card-text").textContent.trim();

    overlay.querySelector(".bio-ring img").src = photo;
    overlay.querySelector(".bio-name").textContent = name;
    overlay.querySelector(".bio-tagline").textContent = tagline;
    overlay.querySelector(".bio-progress").style.animationDuration = "3.8s";

    // Har letter ko alag animation dena
    var heading = overlay.querySelector(".bio-name");
    heading.innerHTML = "";
    name.split("").forEach(function (letter, index) {
      var span = document.createElement("span");
      span.className = "bio-letter";
      span.textContent = letter === " " ? "\u00a0" : letter;
      span.style.setProperty("--i", index);
      heading.appendChild(span);
    });

    overlay.classList.remove("leaving");
    void overlay.offsetWidth;
    overlay.classList.add("active");
    drawParticles();
    finishTimer = setTimeout(function () { closeIntro(modalId); }, 4200);
    overlay.onclick = function () { closeIntro(modalId); };
  }

  document.querySelectorAll('button[data-bs-target$="Bio"]').forEach(function (button) {
    button.removeAttribute("data-bs-toggle");
    button.addEventListener("click", function () { showIntro(button); });
  });

  document.addEventListener("keydown", function (event) {
    if (busy && (event.key === "Escape" || event.key === "Enter")) {
      closeIntro(currentModalId);
    }
  });
})();
