// script.js
document.addEventListener('DOMContentLoaded', () => {
    //
    // ─── BUDGET TRACKER (Money Page Only) ─────────────────────────────────
    //
    if (document.body.classList.contains('money')) {
      const calculateBudgetTotal = () => {
        const inputs = Array.from(document.querySelectorAll('.budget-input'));
        const total = inputs.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
        document.getElementById('budget-total').textContent = `$${total.toFixed(2)}`;
      };
      document.querySelectorAll('.budget-input')
        .forEach(input => input.addEventListener('input', calculateBudgetTotal));
      calculateBudgetTotal();
  
      document.getElementById('add-expense').addEventListener('click', () => {
        const catIn = document.getElementById('new-expense-category');
        const amtIn = document.getElementById('new-expense-amount');
        const cat = catIn.value.trim();
        const amount = parseFloat(amtIn.value);
        if (!cat || isNaN(amount)) return;
        const tbody = document.querySelector('#budget-table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${cat}</td>
          <td><input type="number" class="budget-input" value="${amount.toFixed(2)}"></td>
        `;
        tbody.appendChild(newRow);
        newRow.querySelector('.budget-input').addEventListener('input', calculateBudgetTotal);
        calculateBudgetTotal();
        catIn.value = '';
        amtIn.value = '';
      });
    }
  
    //
    // ─── CALENDAR WITH INLINE EVENTS & ADDITION ───────────────────────────
    //
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) {
      const tasks = [
        { date: '2025-05-12', text: 'Book apartment tour' },
        { date: '2025-05-20', text: 'Pack dorm room' },
        { date: '2025-05-25', text: 'New job starts' }
      ];
      let currentYear, currentMonth;
      function generateCalendar(year, month) {
        currentYear = year;
        currentMonth = month;
        calendarContainer.innerHTML = '';
        const date = new Date(year, month, 1);
        const table = document.createElement('table');
        table.className = 'calendar-table';
  
        // Header
        const header = document.createElement('tr');
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
          const th = document.createElement('th');
          th.textContent = d;
          header.appendChild(th);
        });
        table.appendChild(header);
  
        // Days
        let row = document.createElement('tr');
        for (let i = 0; i < date.getDay(); i++) {
          row.appendChild(document.createElement('td'));
        }
        while (date.getMonth() === month) {
          const cell = document.createElement('td');
          const dayStr = date.toISOString().slice(0,10);
          cell.textContent = date.getDate();
          cell.className = 'calendar-day';
          if (dayStr === new Date().toISOString().slice(0,10)) {
            cell.classList.add('today');
          }
          tasks.filter(t => t.date === dayStr).forEach(t => {
            const ev = document.createElement('div');
            ev.className = 'event-item';
            ev.textContent = t.text;
            cell.appendChild(ev);
          });
          row.appendChild(cell);
          if (date.getDay() === 6) {
            table.appendChild(row);
            row = document.createElement('tr');
          }
          date.setDate(date.getDate() + 1);
        }
        if (row.children.length) {
          for (let i = row.children.length; i < 7; i++) {
            row.appendChild(document.createElement('td'));
          }
          table.appendChild(row);
        }
        calendarContainer.appendChild(table);
      }
      (function initCalendar(){
        const now = new Date();
        generateCalendar(now.getFullYear(), now.getMonth());
      })();
  
      const addEvtBtn = document.getElementById('add-event-button');
      if (addEvtBtn) {
        addEvtBtn.addEventListener('click', () => {
          const dateVal = document.getElementById('new-event-date').value;
          const textVal = document.getElementById('new-event-text').value.trim();
          if (dateVal && textVal) {
            tasks.push({ date: dateVal, text: textVal });
            generateCalendar(currentYear, currentMonth);
            document.getElementById('new-event-date').value = '';
            document.getElementById('new-event-text').value = '';
          }
        });
      }
    }
  
    //
    // ─── TABS ───────────────────────────────────────────────────────────────
    //
    document.querySelectorAll('.tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tabs button')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content')
          .forEach(tc => tc.style.display = (tc.id === btn.dataset.tab ? 'block' : 'none'));
      });
    });
  
    //
    // ─── MOOD-BOARD & LIGHTBOX ─────────────────────────────────────────────
    //
    document.querySelectorAll('.masonry-item').forEach((item, i) => {
      item.style.animationDelay = `${i * 0.2}s`;
      item.addEventListener('click', () => {
        const lb = document.getElementById('lightbox');
        if (!lb) return;
        lb.querySelector('.lightbox-img').src = item.dataset.full;
        lb.querySelector('.caption').textContent = item.querySelector('.overlay').textContent;
        lb.classList.add('show');
      });
    });
    document.querySelectorAll('.lightbox .close').forEach(btn => {
      btn.addEventListener('click', () => {
        const lb = document.getElementById('lightbox');
        if (lb) lb.classList.remove('show');
      });
    });
  
    //
    // ─── GUIDE & MAP + LOCAL PHOTOS ───────────────────────────────────────
    //
    const guideMap   = document.getElementById('dallas-guide-map');
    const photoGrid  = document.getElementById('map-photos');
    if (guideMap && photoGrid) {
      const photoSources = {
        'coffee shops Dallas': ['./images/coffee1.jpg','./images/coffee2.jpg'],
        'yoga studios Dallas': ['./images/yoga1.jpg','./images/yoga2.jpg'],
        'parks Dallas':        ['./images/park1.jpg','./images/park2.jpg']
      };
      document.querySelectorAll('.map-filters button').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.query;
          guideMap.src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
          photoGrid.innerHTML = '';
          (photoSources[q]||[]).forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            photoGrid.appendChild(img);
          });
        });
      });
    }
  
    //
    // ─── BUCKET LIST & HOVER PREVIEW ───────────────────────────────────────
    //
    const bucketList = document.getElementById('bucket-list');
    const tooltip    = document.getElementById('preview-tooltip');
    if (bucketList && tooltip) {
      bucketList.addEventListener('mouseover', e => {
        if (e.target.tagName==='LI' && e.target.dataset.img) {
          tooltip.innerHTML = `<img src="${e.target.dataset.img}"/><div>${e.target.textContent}</div>`;
          tooltip.style.display = 'block';
        }
      });
      bucketList.addEventListener('mousemove', e => {
        tooltip.style.top  = `${e.pageY + 15}px`;
        tooltip.style.left = `${e.pageX + 15}px`;
      });
      bucketList.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });
      const addBucketBtn = document.getElementById('add-bucket');
      if (addBucketBtn) {
        addBucketBtn.addEventListener('click', () => {
          const inp = document.getElementById('new-bucket-item');
          if (!inp.value.trim()) return;
          const li = document.createElement('li');
          li.textContent = inp.value.trim();
          li.dataset.img = '';
          bucketList.appendChild(li);
          inp.value = '';
        });
      }
    }
  
    //
    // ─── “THE MOVE” FUNCTIONALITY ─────────────────────────────────────────
    //
    if (document.body.classList.contains('move')) {
      // Filtering cards
      const filterBtns = document.querySelectorAll('.filter-btn');
      const cards      = document.querySelectorAll('.task-card:not(.add-new)');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.category;
          cards.forEach(c => c.classList.toggle('hidden', cat !== 'all' && !c.classList.contains(cat)));
        });
      });
  
      // Checklist & progress
      const toggleBtns  = document.querySelectorAll('.toggle-section');
      const sections    = document.querySelectorAll('.checklist-section');
      const progressBar = document.getElementById('progress-bar');
      const progressTxt = document.getElementById('progress-text');
  
      toggleBtns.forEach((btn,i) => {
        btn.addEventListener('click', () => {
          const ul   = sections[i];
          const open = ul.style.display !== 'none';
          ul.style.display = open ? 'none' : 'block';
          btn.textContent = btn.textContent.replace(open ? '⬆' : '⬇', open ? '⬇' : '⬆');
          updateProgress();
        });
      });
  
      function updateProgress(){
        const allChecks = Array.from(document.querySelectorAll('.checklist-section input'));
        const done = allChecks.filter(i=>i.checked).length;
        const pct  = allChecks.length ? Math.round(done/allChecks.length*100) : 0;
        progressBar.style.width = `${pct}%`;
        progressTxt.textContent  = `${pct}% Complete`;
      }
      document.querySelectorAll('.checklist-section input')
        .forEach(cb => cb.addEventListener('change', updateProgress));
      updateProgress();
  
      // Packing list move on click
      document.getElementById('to-pack').addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
          document.getElementById('packed').appendChild(e.target);
        }
      });
    }
  
    //
    // ─── HOUSING PAGE: Live Map & Apartment Ranking ───────────────────────
    //
    if (document.body.classList.contains('housing')) {
      // Interactive map buttons
      const mapFrame = document.getElementById('dallas-map');
      document.querySelectorAll('.view-map-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.query;
          mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
        });
      });
      document.querySelectorAll('.map-switch').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.query;
          mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
        });
      });
      const searchBtn = document.getElementById('map-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          const term = document.getElementById('map-search').value.trim();
          if (term) {
            mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(term)}&output=embed`;
          }
        });
      }
  
      // Apartment ranking: auto-number + drag-and-drop
      const aptList = document.getElementById('apartment-list');
  
      function updateApartmentNumbers() {
        aptList.querySelectorAll('li').forEach((li, idx) => {
          const span = li.querySelector('.rank-number');
          if (span) span.textContent = `${idx + 1}.`;
        });
      }
  
      function initApartmentDrag() {
        let dragged = null;
  
        aptList.querySelectorAll('li').forEach(li => {
          li.draggable = true;
  
          li.addEventListener('dragstart', () => {
            dragged = li;
            li.classList.add('hidden');
          });
  
          li.addEventListener('dragend', () => {
            li.classList.remove('hidden');
            updateApartmentNumbers();
          });
  
          li.addEventListener('dragover', e => e.preventDefault());
  
          li.addEventListener('dragenter', () => {
            if (li !== dragged) li.classList.add('over');
          });
  
          li.addEventListener('dragleave', () => {
            li.classList.remove('over');
          });
  
          li.addEventListener('drop', e => {
            e.preventDefault();
            if (li !== dragged) {
              aptList.insertBefore(dragged, li.nextSibling);
            }
            aptList.querySelectorAll('li').forEach(item => item.classList.remove('over'));
          });
        });
      }
  
      // initialize numbering and drag
      updateApartmentNumbers();
      initApartmentDrag();
    }
  
  });
  
  
  
  
    
  
  
  
  
