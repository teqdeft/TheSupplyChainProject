/* ============================================================
   THE SUPPLY CHAIN PROJECT — main.js
   Progressive enhancement only: the site works with JS disabled.
   Handles nav, scroll header, counters, slider, donation tiers,
   form validation + GA4 conversion event stubs, scroll reveal.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Mark JS active so CSS may hide .reveal elements before they animate in.
  document.documentElement.classList.add('js');
  // Safety net: never leave content hidden. Reveal everything after 2.6s no matter what.
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.classList.add('in'); });
  }, 1500);

  /* ---- GA4 / dataLayer conversion event helper (Section 08 of brief) ----
     Replace the console stub with a real GA4 tag. Events are named exactly
     as the brief specifies so they can be imported into Google Ads. */
  window.tscpTrack = function (eventName, params) {
    params = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, params));
    }
    if (window.console) console.info('[tscp:conversion]', eventName, params);
  };

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- 1. Sticky header shadow on scroll ---- */
    var header = document.querySelector('[data-header]');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('scrolled', window.scrollY > 8);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- 2. Mobile menu ---- */
    var toggle = document.querySelector('[data-menu-toggle]');
    var links = document.querySelector('[data-nav-links]');
    var backdrop = document.querySelector('[data-nav-backdrop]');
    function setMenu(open) {
      if (!links) return;
      links.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (toggle) toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('open'));
    });
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    /* ---- 3. Animated counters ---- */
    var counters = document.querySelectorAll('[data-count]');
    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-decimals')) ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      if (reduce) { el.textContent = prefix + format(target, decimals) + suffix; return; }
      var dur = 1500, start = null;
      function fmtStep(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + format(target * eased, decimals) + suffix;
        if (p < 1) requestAnimationFrame(fmtStep);
        else el.textContent = prefix + format(target, decimals) + suffix;
      }
      requestAnimationFrame(fmtStep);
    }
    function format(n, d) {
      return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    if ('IntersectionObserver' in window && counters.length) {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animate(en.target); cObs.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { cObs.observe(c); });
    } else {
      counters.forEach(function (c) { animate(c); });
    }

    /* ---- 4. Scroll reveal ---- */
    // Opt section headings into the reveal system (before the observer queries them)
    document.querySelectorAll('.section-head').forEach(function (el) { el.classList.add('reveal'); });
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length && !reduce) {
      var rObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); rObs.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (r) { rObs.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add('in'); });
    }

    /* ---- 5. Testimonial slider ---- */
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var track = slider.querySelector('.slider-track');
      var slides = slider.querySelectorAll('.slide');
      var dotWrap = slider.querySelector('.slider-dots');
      if (!track || slides.length < 2) return;
      var idx = 0, timer;
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        b.addEventListener('click', function () { go(i); reset(); });
        dotWrap.appendChild(b);
      });
      var dots = dotWrap.querySelectorAll('button');
      function go(i) {
        idx = i;
        track.style.transform = 'translateX(-' + (i * 100) + '%)';
        dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
      }
      function next() { go((idx + 1) % slides.length); }
      function reset() { if (reduce) return; clearInterval(timer); timer = setInterval(next, 6000); }
      go(0); reset();
      slider.addEventListener('mouseenter', function () { clearInterval(timer); });
      slider.addEventListener('mouseleave', reset);
    });

    /* ---- 6. Donation tier selector ---- */
    document.querySelectorAll('[data-donate]').forEach(function (mod) {
      var amounts = mod.querySelectorAll('.amount');
      var custom = mod.querySelector('[data-custom-amount]');
      amounts.forEach(function (btn) {
        btn.addEventListener('click', function () {
          amounts.forEach(function (a) { a.classList.remove('active'); });
          btn.classList.add('active');
          if (custom) custom.value = btn.getAttribute('data-value') || '';
        });
      });
      var toggles = mod.querySelectorAll('.toggle button');
      toggles.forEach(function (t) {
        t.addEventListener('click', function () {
          toggles.forEach(function (x) { x.classList.remove('active'); });
          t.classList.add('active');
        });
      });
    });

    /* ---- 7. Form validation + conversion events ---- */
    document.querySelectorAll('[data-convert-form]').forEach(function (form) {
      var eventName = form.getAttribute('data-event') || 'form_submit';
      form.setAttribute('novalidate', 'novalidate');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        form.querySelectorAll('[required]').forEach(function (input) {
          var field = input.closest('.field');
          var valid = input.value.trim() !== '';
          if (input.type === 'email') valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
          if (field) field.classList.toggle('error', !valid);
          if (!valid && ok) { input.focus(); }
          if (!valid) ok = false;
        });
        if (!ok) return;
        // Fire the GA4 conversion event named in the brief (Section 08)
        window.tscpTrack(eventName, { page: form.getAttribute('data-page') || location.pathname });
        var success = form.parentNode.querySelector('.form-success');
        if (success) { form.style.display = 'none'; success.style.display = 'block';
          success.setAttribute('tabindex', '-1'); success.focus(); }
        else { form.reset(); alert('Thank you — your request has been received.'); }
      });
      form.querySelectorAll('input,select,textarea').forEach(function (input) {
        input.addEventListener('input', function () {
          var f = input.closest('.field'); if (f) f.classList.remove('error');
        });
      });
    });

    /* ---- 8. Donate/Register click tracking (micro events) ---- */
    document.querySelectorAll('[data-track-click]').forEach(function (el) {
      el.addEventListener('click', function () {
        window.tscpTrack(el.getAttribute('data-track-click'));
      });
    });

    /* ---- 9. Current year in footer ---- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ==================================================
       UI ENHANCEMENTS (all gated on !reduce)
       ================================================== */

    /* ---- 10. Header height shrink on scroll ---- */
    if (header) {
      var onScroll2 = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll2, { passive: true });
    }

    /* ---- 11. Staggered reveals within groups ---- */
    document.querySelectorAll('.grid,.router-cards,.lp-benefits,.stats,.footer-top').forEach(function (g) {
      var i = 0;
      [].forEach.call(g.children, function (k) {
        if (k.classList.contains('reveal')) { k.style.transitionDelay = (i * 70) + 'ms'; i++; }
      });
    });

    if (!reduce) {
      /* ---- 12. Inject hero parallax decor ---- */
      document.querySelectorAll('.hero').forEach(function (hero) {
        if (hero.querySelector('.hero-deco')) return;
        var d = document.createElement('div');
        d.className = 'hero-deco';
        d.setAttribute('aria-hidden', 'true');
        d.innerHTML =
          '<span class="blob b1" data-parallax="0.12"></span>' +
          '<span class="blob b2" data-parallax="-0.09"></span>' +
          '<span class="hero-grid-lines" data-parallax="0.05"></span>';
        hero.appendChild(d);
      });
      // gentle parallax on the impact route panel too
      document.querySelectorAll('.impact-media').forEach(function (el) {
        el.setAttribute('data-parallax', '0.06');
      });

      /* ---- 13. Scroll parallax (rAF-throttled) ---- */
      var pxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
      if (pxEls.length) {
        var ticking = false;
        var runPx = function () {
          var vh = window.innerHeight;
          pxEls.forEach(function (el) {
            var s = parseFloat(el.getAttribute('data-parallax')) || 0;
            var host = el.closest('section, .hero, figure') || el.parentElement;
            var r = host.getBoundingClientRect();
            var off = r.top + r.height / 2 - vh / 2;
            el.style.transform = 'translate3d(0,' + (off * s).toFixed(1) + 'px,0)';
          });
          ticking = false;
        };
        var reqPx = function () { if (!ticking) { ticking = true; requestAnimationFrame(runPx); } };
        window.addEventListener('scroll', reqPx, { passive: true });
        window.addEventListener('resize', reqPx);
        runPx();
      }

      /* ---- 14. Subtle pointer tilt on cards (fine pointers only) ---- */
      if (window.matchMedia('(pointer:fine)').matches) {
        document.querySelectorAll('.route-card,.card,.quote-card,.need-card').forEach(function (el) {
          var lift = (el.classList.contains('route-card') || el.classList.contains('card')) ? -6 : -3;
          el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
            var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
            el.removeAttribute('data-tilt-active');
            el.style.transform = 'perspective(820px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' +
              ry.toFixed(2) + 'deg) translateY(' + lift + 'px)';
          });
          el.addEventListener('pointerleave', function () {
            el.setAttribute('data-tilt-active', '');   // smooth the return
            el.style.transform = '';
          });
        });
      }
    }
  });
})();
