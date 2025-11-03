
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.jadwal-form');
    const btnCancel = document.querySelector('.btn-cancel');
    const editingSchedule = JSON.parse(localStorage.getItem('editingSchedule') || 'null');
    const isEditMode = new URLSearchParams(window.location.search).get('mode') === 'edit';
    

    if (isEditMode && editingSchedule) {
        form.nama.value = editingSchedule.nama;
        form.tanggal.value = editingSchedule.tanggal;
        form.pukul.value = editingSchedule.pukul;

        const [jurusan, tingkat] = editingSchedule.jurusanTingkat.split(' - ');
        form.querySelector('.select-row select:last-child').value = jurusan;
        form.querySelector('.select-row select:first-child').value = tingkat;
        
        form.querySelector('.pill.single').value = editingSchedule.mapel;
 
        document.querySelector('.breadcrumb h2 strong').textContent = '> Edit Jadwal';
        document.querySelector('.btn-save').textContent = 'Update';
    }

    //add & edit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            id: isEditMode ? editingSchedule.id : Date.now(),
            nama: form.nama.value,
            tanggal: form.tanggal.value,
            pukul: form.pukul.value,
            jurusanTingkat: `${form.querySelector('.select-row select:last-child').value} - ${form.querySelector('.select-row select:first-child').value}`,
            mapel: form.querySelector('.pill.single').value,
            status: 'Tidak Aktif',
            dimulaiPada: `${form.pukul.value} , ${form.tanggal.value}`,
            berakhirPada: calculateEndTime(form.pukul.value, form.tanggal.value)
        };

        if (!formData.nama || !formData.tanggal || !formData.pukul) {
            alert('Harap isi semua field yang diperlukan');
            return;
        }

    
        saveExamSchedule(formData);

    
        window.location.href = 'jadwal-ujian.html';
    });

    
    btnCancel.addEventListener('click', () => {
        window.location.href = 'jadwal-ujian.html';
    });

  
    function saveExamSchedule(data) {
        const existingSchedules = JSON.parse(localStorage.getItem('examSchedules') || '[]');
        if (isEditMode) {
            const index = existingSchedules.findIndex(schedule => schedule.id === data.id);
            if (index !== -1) {
                existingSchedules[index] = data;
            }
        } else {
            existingSchedules.push(data);
        }
        localStorage.setItem('examSchedules', JSON.stringify(existingSchedules));
        if (isEditMode) {
            localStorage.removeItem('editingSchedule');
        }
    }

    function calculateEndTime(startTime, date) {
        const [hours, minutes] = startTime.split(':');
        const endDate = new Date(`${date} ${hours}:${minutes}`);
        endDate.setHours(endDate.getHours() + 1);
        
        return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')} , ${date}`;
    }
});