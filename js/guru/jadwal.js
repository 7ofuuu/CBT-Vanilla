// Load and display exam schedules from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const cardsGrid = document.querySelector('.cards-grid');
    const searchInput = document.querySelector('.search-input input');
    const filterSelects = document.querySelectorAll('.filter select');
  
    loadExamSchedules();
    searchInput.addEventListener('input', filterCards);
    filterSelects.forEach(select => {
        select.addEventListener('change', filterCards);
    });

    function loadExamSchedules() {
        const schedules = JSON.parse(localStorage.getItem('examSchedules') || '[]');
        cardsGrid.innerHTML = '';

        const bgColors = ['bg-teal', 'bg-blue', 'bg-orange', 'bg-yellow', 'bg-purple'];

        schedules.forEach((schedule, index) => {
            const bgColor = bgColors[index % bgColors.length];
            const card = createCardElement(schedule, bgColor);
            cardsGrid.appendChild(card);
        });
    }

    function deleteSchedule(id) {
        let schedules = JSON.parse(localStorage.getItem('examSchedules') || '[]');
        schedules = schedules.filter(schedule => schedule.id !== id);
        localStorage.setItem('examSchedules', JSON.stringify(schedules));
    }

    function editSchedule(schedule) {
        localStorage.setItem('editingSchedule', JSON.stringify(schedule));
        window.location.href = 'tambah-ujian.html?mode=edit';
    }

    function createCardElement(schedule, bgColor) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', schedule.id);
        card.innerHTML = `
            <div class="card-header ${bgColor}">
                ${schedule.nama}
                <div class="card-actions">
                    <button class="btn-edit" title="Edit">✎</button>
                </div>
            </div>
            <div class="card-body">
                <p><strong>Mapel :</strong> ${schedule.mapel}</p>
                <p><strong>Jurusan/Tingkat :</strong> ${schedule.jurusanTingkat}</p>
                <p><strong>Status :</strong> ${schedule.status}</p>
                <p><strong>Dimulai pada :</strong> ${schedule.dimulaiPada}</p>
                <p><strong>Berakhir pada :</strong> ${schedule.berakhirPada}</p>
            </div>
        `;
        //delete
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-edit')) return;
            
            if (confirm('Apakah Anda yakin ingin menghapus jadwal ujian ini?')) {
                deleteSchedule(schedule.id);
                card.remove();
            }
        });

        //edit
        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            editSchedule(schedule);
        });

        return card;
    }

    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        const [jurusan, tingkat, kelas] = Array.from(filterSelects).map(select => select.value);

        const schedules = JSON.parse(localStorage.getItem('examSchedules') || '[]');
        const filteredSchedules = schedules.filter(schedule => {
            const matchesSearch = 
                schedule.nama.toLowerCase().includes(searchTerm) ||
                schedule.mapel.toLowerCase().includes(searchTerm);

            const matchesFilters = 
                (jurusan === 'Semua Jurusan' || schedule.jurusanTingkat.includes(jurusan)) &&
                (tingkat === 'Semua Tingkat' || schedule.jurusanTingkat.includes(tingkat));

            return matchesSearch && matchesFilters;
        });
        cardsGrid.innerHTML = '';
        const bgColors = ['bg-teal', 'bg-blue', 'bg-orange', 'bg-yellow', 'bg-purple'];
        
        filteredSchedules.forEach((schedule, index) => {
            const bgColor = bgColors[index % bgColors.length];
            const card = createCardElement(schedule, bgColor);
            cardsGrid.appendChild(card);
        });
    }
});
