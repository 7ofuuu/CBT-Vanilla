document.addEventListener('DOMContentLoaded', () => {
    const banksoalGrid = document.querySelector('.banksoal-grid');
    const searchInput = document.querySelector('.search-box input');

    // Function to get card header color based on mapel
    function getCardColorClass(mapel) {
        const mapelColors = {
            'Matematika': 'head-blue',
            'Fisika': 'head-blue',
            'Kimia': 'head-blue',
            'Biologi': 'head-blue',
            'Sejarah': 'head-green',
            'Sosiologi': 'head-orange',
            'Geografi': 'head-orange',
            'Ekonomi': 'head-orange',
            'Bahasa Indonesia': 'head-pink',
            'Bahasa Inggris': 'head-pink'
        };
        return mapelColors[mapel] || 'head-teal';
    }

    // Function to create card HTML
    function createBankSoalCard(bankSoal) {
        return `
            <div class="card ${getCardColorClass(bankSoal.mapel)}">
                <h3>${bankSoal.title}</h3>
                <p class="sub">${bankSoal.tingkat} - ${bankSoal.jurusan}</p>
                <div class="info">
                    <p>Isi Pilihan Ganda : <b>${bankSoal.totalPilgan || 0}</b></p>
                    <p>Isi Essay : <b>${bankSoal.totalEssay || 0}</b></p>
                    <p>Dibuat pada : <span>${bankSoal.createdAt || '-'}</span></p>
                </div>
            </div>
        `;
    }

    // Function to load and display bank soal
    function loadBankSoal(searchQuery = '') {
        const bankSoalList = JSON.parse(localStorage.getItem('bankSoalList') || '[]');
        
        // Filter based on search query
        const filteredList = bankSoalList.filter(bank => {
            const searchString = `${bank.title} ${bank.mapel} ${bank.tingkat} ${bank.jurusan}`.toLowerCase();
            return searchString.includes(searchQuery.toLowerCase());
        });

        // Clear existing content
        banksoalGrid.innerHTML = '';

        // Add cards
        filteredList.forEach(bankSoal => {
            banksoalGrid.insertAdjacentHTML('beforeend', createBankSoalCard(bankSoal));
        });

        // Add click listeners to cards
        document.querySelectorAll('.card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const bankSoal = filteredList[index];
                // Save the current bank soal data for detail page
                localStorage.setItem('currentBankSoal', JSON.stringify(bankSoal));
                window.location.href = `tambah-banksoal.html?edit=true&id=${bankSoal.id}`;
            });
            card.style.cursor = 'pointer';
        });
    }

    // Initial load
    loadBankSoal();

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        loadBankSoal(e.target.value);
    });
});