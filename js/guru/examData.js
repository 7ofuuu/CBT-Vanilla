// Central data store for exam schedules
const examData = {
    // Initialize schedules from sessionStorage or empty array
    get schedules() {
        return JSON.parse(sessionStorage.getItem('examSchedules') || '[]');
    },

    // Save schedules to sessionStorage
    set schedules(value) {
        sessionStorage.setItem('examSchedules', JSON.stringify(value));
    },

    // Add a new schedule
    addSchedule(schedule) {
        const currentSchedules = this.schedules;
        currentSchedules.push(schedule);
        this.schedules = currentSchedules;
    },

    // Get all schedules
    getAllSchedules() {
        return this.schedules;
    },

    // Update an existing schedule
    updateSchedule(updatedSchedule) {
        const currentSchedules = this.schedules;
        const index = currentSchedules.findIndex(schedule => schedule.id === updatedSchedule.id);
        if (index !== -1) {
            currentSchedules[index] = updatedSchedule;
            this.schedules = currentSchedules;
        }
    },

    // Delete a schedule
    deleteSchedule(id) {
        const currentSchedules = this.schedules;
        this.schedules = currentSchedules.filter(schedule => schedule.id !== id);
    },

    // Get a schedule by ID
    getScheduleById(id) {
        return this.schedules.find(schedule => schedule.id === id);
    },

    // Clear all schedules
    clearSchedules() {
        this.schedules = [];
    }
};

// Add some sample initial data if no data exists
if (examData.getAllSchedules().length === 0) {
    examData.addSchedule({
        id: 1,
        nama: "Ujian Akhir Semester",
        tanggal: "20 Juni 2025",
        pukul: "08:30",
        jurusanTingkat: "XII - IPA",
        mapel: "Matematika",
        status: "Tidak Aktif",
        dimulaiPada: "08:30 , 20 Juni 2025",
        berakhirPada: "09:30 , 20 Juni 2025"
    });
}

// Make it available globally
window.examData = examData;