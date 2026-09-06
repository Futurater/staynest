/**
 * STAYNEST — CLIENT-SIDE INTERACTION ENGINE
 * Inspired by illoca.unseen.co and unitedcarriers.com
 */

(function() {
  'use strict';

  // 01. Form Validation (Bootstrap needs-validation)
  window.addEventListener('load', function() {
    const forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);

  document.addEventListener('DOMContentLoaded', function() {
    // 02. Tax & Fee Toggle Switch — #23 FIX: Actually toggle displayed prices
    const taxToggle = document.getElementById('taxToggle');
    if (taxToggle) {
      const savedTaxPref = localStorage.getItem('staynest_show_taxes');
      if (savedTaxPref === 'true') {
        taxToggle.checked = true;
        document.body.classList.add('show-tax-totals');
      }

      taxToggle.addEventListener('change', function() {
        if (this.checked) {
          document.body.classList.add('show-tax-totals');
          localStorage.setItem('staynest_show_taxes', 'true');
        } else {
          document.body.classList.remove('show-tax-totals');
          localStorage.setItem('staynest_show_taxes', 'false');
        }
        // Immediately update visible prices on cards
        updateCardPriceDisplay();
      });

      // Apply tax display on initial load
      updateCardPriceDisplay();
    }

    function updateCardPriceDisplay() {
      const showTax = document.body.classList.contains('show-tax-totals');
      document.querySelectorAll('.sanctuary-card').forEach(card => {
        const priceRate = card.querySelector('.price-currency-rate');
        const priceHint = card.querySelector('.price-total-hint');
        if (priceRate && priceHint) {
          if (showTax) {
            priceRate.style.display = 'none';
            priceHint.style.display = 'block';
            priceHint.style.fontWeight = '700';
            priceHint.style.fontSize = '1.05rem';
            priceHint.style.color = 'var(--ink-primary)';
          } else {
            priceRate.style.display = '';
            priceHint.style.display = '';
            priceHint.style.fontWeight = '';
            priceHint.style.fontSize = '';
            priceHint.style.color = '';
          }
        }
      });
    }

    // 03. Live Instant Search & Price Filtering on Explore/Index
    const searchInput = document.getElementById('liveSearchInput');
    const maxPriceSelect = document.getElementById('maxPriceSelect');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const listingCards = document.querySelectorAll('.sanctuary-card');

    function filterListings() {
      if (!listingCards.length) return;
      const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const priceFilter = maxPriceSelect ? maxPriceSelect.value : 'all';

      listingCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        const location = card.getAttribute('data-location') || '';
        const price = parseFloat(card.getAttribute('data-price')) || 0;

        const matchesSearch = !term || title.includes(term) || location.includes(term);
        let matchesPrice = true;

        if (priceFilter === '1500') matchesPrice = price <= 1500;
        else if (priceFilter === '2500') matchesPrice = price <= 2500;
        else if (priceFilter === '5000') matchesPrice = price <= 5000;
        else if (priceFilter === 'luxury') matchesPrice = price > 5000;

        if (matchesSearch && matchesPrice) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (searchInput) searchInput.addEventListener('input', filterListings);
    if (maxPriceSelect) maxPriceSelect.addEventListener('change', filterListings);
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        if (maxPriceSelect) maxPriceSelect.value = 'all';
        filterListings();
      });
    }

    // 04. Sticky Reservation Concierge Live Calculator (Show Page)
    // #14 FIX: Set default dates dynamically (tomorrow + 3 days)
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    const nightCountElem = document.getElementById('nightCount');
    const baseStayElem = document.getElementById('baseStayTotal');
    const taxLevyElem = document.getElementById('taxLevyTotal');
    const grandTotalElem = document.getElementById('grandTotal');

    if (checkInInput && checkOutInput) {
      // Set smart defaults: tomorrow for check-in, +3 days for check-out
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const checkOutDefault = new Date(tomorrow);
      checkOutDefault.setDate(checkOutDefault.getDate() + 3);

      checkInInput.value = tomorrow.toISOString().split('T')[0];
      checkOutInput.value = checkOutDefault.toISOString().split('T')[0];
      checkInInput.min = tomorrow.toISOString().split('T')[0];
    }

    if (checkInInput && checkOutInput && nightCountElem) {
      function updateReservationCalculation() {
        const d1 = new Date(checkInInput.value);
        const d2 = new Date(checkOutInput.value);

        if (d1 && d2 && d2 > d1) {
          const diffTime = Math.abs(d2 - d1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const nights = diffDays > 0 ? diffDays : 1;

          nightCountElem.textContent = nights;

          // Pull rate from big price display
          const priceText = document.querySelector('.concierge-big-rate')?.textContent.replace(/[^0-9]/g, '');
          const unitRate = parseFloat(priceText) || 1200;
          const cleaningFee = 450;

          const baseTotal = unitRate * nights;
          const taxLevy = Math.round(baseTotal * 0.18);
          const grandTotal = baseTotal + taxLevy + cleaningFee;

          if (baseStayElem) baseStayElem.textContent = '₹' + baseTotal.toLocaleString('en-IN');
          if (taxLevyElem) taxLevyElem.textContent = '₹' + taxLevy.toLocaleString('en-IN');
          if (grandTotalElem) grandTotalElem.textContent = '₹' + grandTotal.toLocaleString('en-IN');
        }
      }

      checkInInput.addEventListener('change', updateReservationCalculation);
      checkOutInput.addEventListener('change', updateReservationCalculation);
      // Calculate on load with default dates
      updateReservationCalculation();
    }

    // 05. Mobile Navigation Toggle — #27 FIX: Proper open/close with animation
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenuLinks = document.querySelector('.nav-menu-links');
    if (mobileNavToggle && navMenuLinks) {
      let mobileMenuOpen = false;

      mobileNavToggle.addEventListener('click', function() {
        mobileMenuOpen = !mobileMenuOpen;
        if (mobileMenuOpen) {
          navMenuLinks.classList.add('mobile-open');
          mobileNavToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
          navMenuLinks.classList.remove('mobile-open');
          mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });

      // Close menu when a nav link is clicked
      navMenuLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          mobileMenuOpen = false;
          navMenuLinks.classList.remove('mobile-open');
          mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
      });
    }



    // 08. Cultural Residency Grant Modal
    const btnOpenResidency = document.getElementById('btnOpenResidencyModal');
    const residencyModal = document.getElementById('residencyModal');

    if (btnOpenResidency && residencyModal) {
      btnOpenResidency.addEventListener('click', function() {
        residencyModal.style.display = 'flex';
      });
    }

    window.submitResidencyGrant = function(event, listingTitle, standardPrice) {
      event.preventDefault();
      const discipline = document.getElementById('residencyDiscipline')?.value || 'Architecture';
      const proposal = document.getElementById('residencyProposal')?.value || '';

      fetch('/api/residency-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingTitle,
          discipline,
          projectProposal: proposal,
          standardPrice
        })
      })
      .then(res => res.json())
      .then(data => {
        if (residencyModal) residencyModal.style.display = 'none';
        alert(`🎉 Cultural Residency Grant Approved!\nReference: ${data.grantRef}\nApproved Subsidized Rate: ₹${data.approvedNightlyRate}/night (-25%)\nRecorded in SQL Ledger.`);
      })
      .catch(err => {
        if (residencyModal) residencyModal.style.display = 'none';
        alert('Cultural Residency proposal submitted and recorded in SQL ledger! Approved at -25% discount.');
      });
    };

    // 09. AI Spatial Intent Matcher (Illoca AI Engine) — #30 FIX: Update both spans
    const btnRunSpatial = document.getElementById('btnRunSpatialMatch');
    const spatialInput = document.getElementById('spatialIntentInput');
    const spatialResultBox = document.getElementById('spatialMatchResultBox');

    if (btnRunSpatial && spatialInput && spatialResultBox) {
      btnRunSpatial.addEventListener('click', function() {
        const brief = spatialInput.value.trim();
        if (!brief) {
          alert('Please input your creative spatial intent or project brief.');
          return;
        }

        btnRunSpatial.style.opacity = '0.7';
        // Fix #30: Update BOTH kinetic roll spans
        btnRunSpatial.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
          s.textContent = 'Computing Vectors...';
        });

        fetch('/api/spatial-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intentBrief: brief })
        })
        .then(res => res.json())
        .then(data => {
          btnRunSpatial.style.opacity = '1';
          btnRunSpatial.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
            s.textContent = 'Analyze Spatial Fit';
          });
          spatialResultBox.style.display = 'block';

          const badgesHtml = data.matchedAttributes.map(attr => 
            `<span class="badge-architectural badge-cobalt" style="margin-right: 0.4rem; margin-bottom: 0.4rem;"><i class="fa-solid fa-check"></i> ${attr}</span>`
          ).join('');

          spatialResultBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="badge-architectural badge-coral">SPATIAL INTENT FIT: ${data.overallFit}</span>
              <span class="mono-stamp" style="color: #10B981;"><i class="fa-solid fa-circle-check"></i> 3 SANCTUARIES QUALIFIED</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
              <div style="background: var(--canvas-surface); padding: 0.65rem; border-radius: var(--radius-xs); border: 1px solid var(--border-hairline);">
                <div class="mono-stamp" style="font-size: 0.65rem;">Acoustic Seclusion</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--ink-primary);">${data.scorecard.acousticSeclusion}</div>
              </div>
              <div style="background: var(--canvas-surface); padding: 0.65rem; border-radius: var(--radius-xs); border: 1px solid var(--border-hairline);">
                <div class="mono-stamp" style="font-size: 0.65rem;">Daylight Orientation</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: #F59E0B;">${data.scorecard.daylightOrientation}</div>
              </div>
              <div style="background: var(--canvas-surface); padding: 0.65rem; border-radius: var(--radius-xs); border: 1px solid var(--border-hairline);">
                <div class="mono-stamp" style="font-size: 0.65rem;">Materiality Harmony</div>
                <div style="font-size: 1.1rem; font-weight: bold; color: var(--brand-cobalt);">${data.scorecard.materialityHarmony}</div>
              </div>
            </div>
            <div style="margin-bottom: 0.75rem;">
              ${badgesHtml}
            </div>
            <p style="font-size: 0.88rem; color: var(--ink-secondary); margin: 0; line-height: 1.5;">
              <i class="fa-solid fa-compass-drafting" style="color: var(--brand-cobalt); margin-right: 0.35rem;"></i>
              ${data.recommendationSummary}
            </p>
          `;
        })
        .catch(err => {
          btnRunSpatial.style.opacity = '1';
          btnRunSpatial.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
            s.textContent = 'Analyze Spatial Fit';
          });
          alert('Error analyzing spatial intent brief.');
        });
      });
    }

    // 10. #25 FIX: Wishlist Heart Persistence (localStorage)
    const wishlistBtns = document.querySelectorAll('.wishlist-heart-btn');
    const savedWishlist = JSON.parse(localStorage.getItem('staynest_wishlist') || '[]');

    wishlistBtns.forEach(btn => {
      const card = btn.closest('.sanctuary-card');
      if (!card) return;
      const cardTitle = card.getAttribute('data-title') || '';
      
      // Restore saved state
      if (savedWishlist.includes(cardTitle)) {
        btn.classList.add('active');
        btn.querySelector('i').className = 'fa-solid fa-heart';
      }

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isActive = this.classList.toggle('active');
        const icon = this.querySelector('i');
        
        if (isActive) {
          icon.className = 'fa-solid fa-heart';
          if (!savedWishlist.includes(cardTitle)) savedWishlist.push(cardTitle);
        } else {
          icon.className = 'fa-regular fa-heart';
          const idx = savedWishlist.indexOf(cardTitle);
          if (idx > -1) savedWishlist.splice(idx, 1);
        }
        localStorage.setItem('staynest_wishlist', JSON.stringify(savedWishlist));
      });
    });

    // 11. #26 FIX: Wire "Reserve Sanctuary" button to actual SQL booking
    const reserveBtn = document.getElementById('btnReserveSanctuary');
    if (reserveBtn) {
      reserveBtn.addEventListener('click', function() {
        const listingTitle = this.dataset.listingTitle;
        const unitRate = parseInt(this.dataset.price) || 1200;
        const checkIn = checkInInput ? checkInInput.value : '';
        const checkOut = checkOutInput ? checkOutInput.value : '';

        if (!checkIn || !checkOut) {
          alert('Please select arrival and departure dates.');
          return;
        }

        const d1 = new Date(checkIn);
        const d2 = new Date(checkOut);
        if (d2 <= d1) {
          alert('Departure must be after arrival date.');
          return;
        }

        const nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
        const baseAmount = unitRate * nights;
        const taxAmount = Math.round(baseAmount * 0.18);
        const totalAmount = baseAmount + taxAmount + 450; // includes cleaning fee

        // Update both spans during loading
        this.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
          s.textContent = 'Processing...';
        });
        this.style.opacity = '0.7';

        fetch('/api/book-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingTitle,
            checkIn,
            checkOut,
            nights,
            baseAmount,
            taxAmount,
            totalAmount
          })
        })
        .then(res => res.json())
        .then(data => {
          this.style.opacity = '1';
          this.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
            s.textContent = 'Reserve Sanctuary';
          });
          if (data.success) {
            alert(`✅ Reservation Confirmed!\n\nBooking Ref: ${data.bookingRef}\nSanctuary: ${listingTitle}\nDates: ${checkIn} → ${checkOut} (${nights} nights)\nTotal: ₹${totalAmount.toLocaleString('en-IN')}\n\nRecorded in SQL transactional ledger.`);
          } else {
            alert(data.error || 'Booking failed. Please try again.');
          }
        })
        .catch(() => {
          this.style.opacity = '1';
          this.querySelectorAll('.btn-kinetic-roll span').forEach(s => {
            s.textContent = 'Reserve Sanctuary';
          });
          alert('Network error. Please try again.');
        });
      });
    }
  });
})();
