document.addEventListener("DOMContentLoaded", async () => {
  const addBtn = document.getElementById("addQuestionBtn");
  const container = document.getElementById("questionContainer");
  const titleInput = document.getElementById("bankTitle");
  const descInput = document.querySelector(".desc-input");
  const tingkatSelect = document.querySelector(".dropdowns select:nth-child(1)");
  const jurusanSelect = document.querySelector(".dropdowns select:nth-child(2)");
  const mapelSelect = document.querySelector(".dropdowns select:nth-child(3)");
  const addBankBtn = document.getElementById("addBankBtn");

  if (!localStorage.getItem('bankSoalList')) {
    localStorage.setItem('bankSoalList', '[]');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const isEdit = urlParams.get('edit') === 'true';

  if (isEdit) {
    if (addBankBtn) {
      addBankBtn.textContent = 'Simpan Perubahan';
    }
    
    const deleteBankBtn = document.createElement('button');
    deleteBankBtn.id = 'deleteBankBtn';
    deleteBankBtn.textContent = 'Hapus Bank Soal';
    deleteBankBtn.className = 'delete-bank-btn';
    deleteBankBtn.style.marginLeft = '10px';
    deleteBankBtn.style.backgroundColor = '#dc3545';
    deleteBankBtn.style.color = 'white';
    deleteBankBtn.style.border = 'none';
    deleteBankBtn.style.padding = '8px 16px';
    deleteBankBtn.style.borderRadius = '4px';
    deleteBankBtn.style.cursor = 'pointer';
    
    addBankBtn.parentNode.insertBefore(deleteBankBtn, addBankBtn.nextSibling);
    
    deleteBankBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus bank soal ini?')) {
        try {
          const bankSoalList = JSON.parse(localStorage.getItem('bankSoalList') || '[]');
          const newBankSoalList = bankSoalList.filter(bank => bank.id !== editId);
          localStorage.setItem('bankSoalList', JSON.stringify(newBankSoalList));
          alert('Bank soal berhasil dihapus!');
          window.location.href = 'banksoal.html';
        } catch (error) {
          console.error('Error deleting bank soal:', error);
          alert('Terjadi kesalahan saat menghapus bank soal');
        }
      }
    });
  }

  function collectQuestionsData() {
    const questions = [];
    const cards = container.querySelectorAll('.question-card');
    
    cards.forEach((card, index) => {
      const questionText = card.querySelector('.question-text').value;
      const type = card.querySelector('.question-type').value;
      const questionData = {
        id: index + 1,
        type: type,
        question: questionText
      };

      if (type === 'pilgan') {
        const options = [];
        card.querySelectorAll('.option-item').forEach(item => {
          const optionText = item.querySelector('input[type="text"]').value;
          const isCorrect = item.querySelector('input[type="radio"]').checked;
          options.push(optionText);
          if (isCorrect) {
            questionData.correctAnswer = options.length - 1;
          }
        });
        questionData.options = options;
      } else {
        questionData.answer = card.querySelector('.essay-answer').value;
      }

      questions.push(questionData);
    });
    return questions;
  }

  async function saveBankSoal() {
    try {
      const bankSoalList = JSON.parse(localStorage.getItem('bankSoalList') || '[]');
      
      const questions = collectQuestionsData();
      const newBankSoal = {
        id: editId || `bank_${Date.now()}`,
        title: titleInput.textContent,
        description: descInput.value,
        tingkat: tingkatSelect.value,
        jurusan: jurusanSelect.value,
        mapel: mapelSelect.value,
        questions: questions,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        totalPilgan: questions.filter(q => q.type === 'pilgan').length,
        totalEssay: questions.filter(q => q.type === 'essay').length
      };
      if (editId) {
        const index = bankSoalList.findIndex(bank => bank.id === editId);
        if (index !== -1) {
          bankSoalList[index] = newBankSoal;
        }
      } else {
        bankSoalList.push(newBankSoal);
      }

      localStorage.setItem('bankSoalList', JSON.stringify(bankSoalList));

      alert(`Bank soal berhasil ${editId ? 'diperbarui' : 'ditambahkan'}!`);
      window.location.href = 'banksoal.html';
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Terjadi kesalahan saat menyimpan bank soal');
    }
  }

  addBankBtn.addEventListener('click', saveBankSoal);

  if (editId) {
    try {
      const bankSoalList = JSON.parse(localStorage.getItem('bankSoalList') || '[]');
      const data = bankSoalList.find(bank => bank.id === editId);
      
      if (data) {
        titleInput.textContent = data.title || '';
        descInput.value = data.description || '';
        tingkatSelect.value = data.tingkat || '';
        jurusanSelect.value = data.jurusan || '';
        mapelSelect.value = data.mapel || '';

        if (data.questions && Array.isArray(data.questions)) {
          data.questions.forEach(question => {
            if (question.type === 'pilgan') {
              addQuestionCard(question);
            } else if (question.type === 'essay') {
              addEssayCard(question);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  document.querySelectorAll(".toolbar button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.execCommand(btn.dataset.cmd, false, null);
      titleInput.focus();
    });
  });

  addBtn.addEventListener("click", () => addQuestionCard());
  document.querySelector('button[title="Tambah Soal Essay"]').addEventListener("click", () => addEssayCard());

  function addQuestionCard(data = null) {
    const card = document.createElement("div");
    card.classList.add("question-card");
    card.innerHTML = `
      <div class="question-top">
        <textarea class="question-text" placeholder="Tulis pertanyaan di sini...">${data ? data.question : ''}</textarea>
        <div class="question-controls">
          <select class="question-type">
            <option value="pilgan" ${data && data.type === 'pilgan' ? 'selected' : ''}>Pilihan Ganda</option>
            <option value="essay" ${data && data.type === 'essay' ? 'selected' : ''}>Essay</option>
          </select>
        </div>
      </div>
      <div class="question-body">${data ? getPilganTemplate(data) : getPilganTemplate()}</div>
      <div class="card-actions">
        <button class="copy-btn">Tambah</button>
        <button class="delete-btn">Hapus</button>
      </div>
    `;

    container.appendChild(card);

    const select = card.querySelector(".question-type");
    const deleteBtn = card.querySelector(".delete-btn");
    const copyBtn = card.querySelector(".copy-btn");

    select.addEventListener("change", e => {
      const body = card.querySelector(".question-body");
      if (e.target.value === "pilgan") {
        body.innerHTML = getPilganTemplate();
        initOptionHandlers(card);
      } else {
        body.innerHTML = getEssayTemplate();
      }
    });

    deleteBtn.addEventListener("click", () => card.remove());
    copyBtn.addEventListener("click", () => {
      const clone = card.cloneNode(true);
      container.appendChild(clone);
      initOptionHandlers(clone);
      clone.querySelector(".question-type").addEventListener("change", e => {
        const body = clone.querySelector(".question-body");
        if (e.target.value === "pilgan") {
          body.innerHTML = getPilganTemplate();
          initOptionHandlers(clone);
        } else {
          body.innerHTML = getEssayTemplate();
        }
      });
      clone.querySelector(".delete-btn").addEventListener("click", () => clone.remove());
    });

    initOptionHandlers(card);
  }

  function initOptionHandlers(card) {
    const addOpt = card.querySelector(".add-option");
    if (!addOpt) return;
    addOpt.addEventListener("click", () => {
      const options = card.querySelector(".options");
      const opt = document.createElement("div");
      opt.classList.add("option-item");
      opt.innerHTML = `
        <input type="radio" name="pilgan${Date.now()}">
        <input type="text" placeholder="Tulis opsi jawaban">
        <button class="remove-option">✖</button>
      `;
      options.insertBefore(opt, addOpt);
      opt.querySelector(".remove-option").addEventListener("click", () => opt.remove());
    });
  }

  function getPilganTemplate(data = null) {
    const timestamp = Date.now();
    let optionsHtml = '';
    
    if (data && data.options) {
      // Jika ada data opsi, gunakan data tersebut
      data.options.forEach((option, index) => {
        optionsHtml += `
          <div class="option-item">
            <input type="radio" name="pilgan${timestamp}" ${data.correctAnswer === index ? 'checked' : ''}>
            <input type="text" placeholder="Tulis opsi jawaban" value="${option}">
            <button class="remove-option">✖</button>
          </div>
        `;
      });
    } else {
      // Jika tidak ada data, buat template default dengan 2 opsi kosong
      optionsHtml = `
        <div class="option-item">
          <input type="radio" name="pilgan${timestamp}">
          <input type="text" placeholder="Tulis opsi jawaban">
          <button class="remove-option">✖</button>
        </div>
        <div class="option-item">
          <input type="radio" name="pilgan${timestamp}">
          <input type="text" placeholder="Tulis opsi jawaban">
          <button class="remove-option">✖</button>
        </div>
      `;
    }

    return `
      <div class="options">
        ${optionsHtml}
        <button class="add-option">+ Tambah Opsi</button>
      </div>
    `;
  }

  function getEssayTemplate(data = null) {
    return `<textarea class="essay-answer" placeholder="Tulis jawaban di sini...">${data ? data.answer || '' : ''}</textarea>`;
  }

  function addEssayCard(data = null) {
    const card = document.createElement("div");
    card.classList.add("question-card");
    card.innerHTML = `
      <div class="question-top">
        <textarea class="question-text" placeholder="Tulis pertanyaan di sini...">${data ? data.question : ''}</textarea>
        <div class="question-controls">
          <select class="question-type">
            <option value="essay" selected>Essay</option>
            <option value="pilgan">Pilihan Ganda</option>
          </select>
        </div>
      </div>
      <div class="question-body">${getEssayTemplate(data)}</div>
      <div class="card-actions">
        <button class="copy-btn">📄</button>
        <button class="delete-btn">❌</button>
      </div>
    `;

    container.appendChild(card);

    const select = card.querySelector(".question-type");
    const deleteBtn = card.querySelector(".delete-btn");
    const copyBtn = card.querySelector(".copy-btn");

    select.addEventListener("change", e => {
      const body = card.querySelector(".question-body");
      if (e.target.value === "pilgan") {
        body.innerHTML = getPilganTemplate();
        initOptionHandlers(card);
      } else {
        body.innerHTML = getEssayTemplate();
      }
    });

    deleteBtn.addEventListener("click", () => card.remove());
    copyBtn.addEventListener("click", () => {
      const clone = card.cloneNode(true);
      container.appendChild(clone);
    });
  }
});
