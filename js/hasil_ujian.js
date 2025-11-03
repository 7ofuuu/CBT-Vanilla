const searchInput = document.getElementById('searchInput');
const examCards = document.querySelectorAll('.exam-card');
const studentTable = document.querySelector('.student-table');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const keyword = searchInput.value.toLowerCase().trim();

    if (examCards && examCards.length > 0) {
      examCards.forEach(card => {
        const headerEl = card.querySelector('.exam-header');
        const title = headerEl ? headerEl.textContent.toLowerCase() : '';
        card.style.display = title.includes(keyword) ? 'block' : 'none';
      });
      return;
    }

    if (studentTable) {
      const rows = studentTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = keyword === '' || text.includes(keyword) ? '' : 'none';
      });
    }
  });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const confirmLogout = confirm('Apakah Anda yakin ingin logout?');
    if (confirmLogout) {
      window.location.href = '../../login.html';
    }
  });
}

const examGrid = document.getElementById('examGrid');
function loadExams(){
  const raw = localStorage.getItem('exams');
  if (!raw){
    return [];
  }
  try{
    const parsed = JSON.parse(raw);
    const seededIds = ['e1','e2','e3'];
    const seededTitles = ['Matematika','Kimia','Fisika'];
    let filtered = parsed.filter(x => !seededIds.includes(x.id));
    if (!localStorage.getItem('examsCleaned')){
      filtered = filtered.filter(x => !(seededTitles.includes(x.title) && String(x.span||'').toLowerCase().includes('xii')));
      localStorage.setItem('exams', JSON.stringify(filtered));
      localStorage.setItem('examsCleaned', '1');
    } else {
      if (filtered.length !== parsed.length) {
        localStorage.setItem('exams', JSON.stringify(filtered));
      }
    }
    return filtered;
  }catch(e){
    return [];
  }
}

function saveExams(exams){
  localStorage.setItem('exams', JSON.stringify(exams));
}

function renderExamCards(){
  if (!examGrid) return;
  let exams = loadExams();
  try{
    const seededIds = ['e1','e2','e3'];
    if (exams.length > 0 && exams.every(x=> seededIds.includes(x.id))){
      localStorage.removeItem('exams');
      exams = [];
    }
  }catch(e){}
  examGrid.innerHTML = '';
  if (exams.length === 0){
    const ph = document.createElement('div');
    ph.style.padding = '24px';
    ph.style.color = '#6b7280';
    ph.textContent = 'Belum ada ujian. Klik "Tambah Ujian" untuk membuat ujian baru.';
    examGrid.appendChild(ph);
    return;
  }

  exams.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exam-card';
    card.dataset.id = ex.id;
    card.innerHTML = `
      <div class="exam-header">${ex.title} <span>${ex.span || ''}</span></div>
      <div class="exam-body">
        <p>Jumlah kelas: <strong>${ex.classes || 0}</strong></p>
        <p>Total siswa: <strong>${ex.total || 0}</strong></p>
        <p>Selesai: <strong>${ex.finished || 0}</strong></p>
        <div class="card-actions" style="margin-top:8px;display:flex;gap:8px">
          <button class="edit-card-btn" data-id="${ex.id}" style="padding:6px 8px;border-radius:6px">Edit</button>
          <button class="delete-card-btn" data-id="${ex.id}" style="padding:6px 8px;border-radius:6px;background:#fee2e2;color:#991b1b;border:none">Hapus</button>
        </div>
      </div>
    `;
    const header = card.querySelector('.exam-header');
    header.style.cursor='pointer';
    header.addEventListener('click', () => {
      const headerText = header.textContent || '';
      if (headerText.toLowerCase().includes('matematika')){
        window.location.href = 'list_kelas.html';
        return;
      }
      alert('Detail ujian: ' + headerText);
    });

    card.querySelectorAll('.delete-card-btn').forEach(btn => {
      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const id = btn.dataset.id;
        const confirmDel = confirm('Hapus ujian ini?');
        if (!confirmDel) return;
        const all = loadExams().filter(x=>x.id!==id);
        saveExams(all);
        renderExamCards();
      });
    });

    card.querySelectorAll('.edit-card-btn').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const id = btn.dataset.id;
        window.location.href = `edit_exam.html?id=${id}`;
      });
    });

    examGrid.appendChild(card);
  });
}

if (examGrid){
  renderExamCards();
  const addBtn = document.getElementById('addExamBtn');
  if (addBtn) addBtn.addEventListener('click', ()=> window.location.href='create_exam.html');
}

const nilaiEssayBtn = document.getElementById('nilaiEssayBtn');
if (nilaiEssayBtn) {
  nilaiEssayBtn.addEventListener('click', () => {
    window.location.href = 'berikan_nilaiessay.html';
  });
}

const studentRows = document.querySelectorAll('.student-table tbody tr');
if (studentRows && studentRows.length > 0) {
  studentRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      window.location.href = 'detail_nilai.html';
    });
  });
}

const saveEssayButtons = document.querySelectorAll('.save-essay-btn');
if (saveEssayButtons && saveEssayButtons.length > 0) {
  saveEssayButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = btn.closest('.score-row');
      if (!row) return;
      const input = row.querySelector('.essay-score-input');
      if (!input) return;
      const val = input.value.trim();
      if (val === '' || isNaN(Number(val))) {
        alert('Masukkan nilai yang valid (0-100)');
        return;
      }
      const n = Number(val);
      if (n < 0 || n > 100) {
        alert('Nilai harus antara 0 dan 100');
        return;
      }
      const ok = row.querySelector('.save-ok');
      if (ok) ok.classList.add('ok');
      input.disabled = true;
      btn.disabled = true;
      btn.textContent = 'Tersimpan';
    });
  });
}

;(function(){
  const pageBtns = document.querySelectorAll('.page-btn');
  const pages = document.querySelectorAll('.essay-page');
  if (!pageBtns || pageBtns.length === 0 || !pages || pages.length === 0) return;

  function showPage(pageNum){
    pages.forEach(p => {
      p.style.display = p.dataset.page === String(pageNum) ? 'block' : 'none';
    });
    pageBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === String(pageNum));
    });
    const visibleSaveBtns = document.querySelectorAll('.essay-page[data-page="'+pageNum+'"] .save-essay-btn');
    visibleSaveBtns.forEach(b => {
    });
  }

  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.dataset.page || btn.getAttribute('data-page');
      showPage(p);
      const container = document.querySelector('.essay-container');
      if (container) container.scrollIntoView({behavior:'smooth'});
    });
  });

  showPage(1);

  const submitBtn = document.querySelector('.submit-all-btn');
  if (submitBtn){
    submitBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.essay-score-input');
      const results = [];
      inputs.forEach((inp, idx) => {
        const v = inp.value.trim();
        results.push({index: idx+1, value: v === '' ? null : Number(v)});
      });
      const confirmed = confirm('Submit semua nilai? Pastikan nilai sudah tersimpan (Tersimpan).');
      if (!confirmed) return;
      submitBtn.textContent = 'Terkirim';
      submitBtn.disabled = true;
      alert('Nilai telah dikirim (dummy).');
    });
  }

})();
