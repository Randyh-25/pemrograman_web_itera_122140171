/**
 * Aplikasi Manajemen Profil Mahasiswa
 * Implementasi ES6+ untuk mengelola data mahasiswa dengan localStorage
 */

class StudentProfile {
    constructor(name, studentId, email, program, semester, gpa) {
        this.id = this.generateId();
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.program = program;
        this.semester = parseInt(semester);
        this.gpa = parseFloat(gpa);
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    generateId() {
        return 'student_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000).toString();
    }

    updateProfile(updates) {
        const { studentName, email, program, semester, gpa } = updates;
        if (studentName) this.name = studentName;
        if (email) this.email = email;
        if (program) this.program = program;
        if (semester) this.semester = parseInt(semester);
        if (gpa !== undefined) this.gpa = parseFloat(gpa);
        this.updatedAt = new Date().toISOString();
    }

    getGPACategory() {
        if (this.gpa >= 3.5) return 'excellent';
        if (this.gpa >= 3.0) return 'good';
        if (this.gpa >= 2.5) return 'average';
        return 'poor';
    }

    getDisplayInfo() {
        return `${this.name} (${this.studentId}) - ${this.program} Semester ${this.semester}`;
    }
}

class StudentManagementApp {
    constructor() {
        this.students = [];
        this.editingStudentId = null;
        this.pendingDeleteId = null;
        this.currentFilter = {
            search: '',
            program: '',
            semester: ''
        };
        this.init();
    }

    init() {
        this.loadStudents();
        this.bindEvents();
        this.updateDisplay();
        this.populateFilterOptions();
    }

    loadStudents() {
        try {
            const saved = localStorage.getItem('studentProfiles');
            if (saved) {
                const data = JSON.parse(saved);
                this.students = data.map(student => {
                    const profile = new StudentProfile(
                        student.name,
                        student.studentId,
                        student.email,
                        student.program,
                        student.semester,
                        student.gpa
                    );
                    profile.id = student.id;
                    profile.createdAt = student.createdAt;
                    profile.updatedAt = student.updatedAt;
                    return profile;
                });
            }
        } catch (error) {
            this.students = [];
            this.showNotification('Gagal memuat data mahasiswa!', 'error');
        }
    }

    saveStudents() {
        try {
            localStorage.setItem('studentProfiles', JSON.stringify(this.students));
        } catch (error) {
            this.showNotification('Gagal menyimpan data!', 'error');
        }
    }

    bindEvents() {
        const form = document.getElementById('profileForm');
        const searchInput = document.getElementById('searchStudent');
        const filterProgram = document.getElementById('filterProgram');
        const filterSemester = document.getElementById('filterSemester');
        const exportBtn = document.getElementById('exportBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        searchInput.addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.filterStudents();
        });

        filterProgram.addEventListener('change', (e) => {
            this.currentFilter.program = e.target.value;
            this.filterStudents();
        });

        filterSemester.addEventListener('change', (e) => {
            this.currentFilter.semester = e.target.value;
            this.filterStudents();
        });

        exportBtn.addEventListener('click', () => {
            this.handleExport();
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelEdit();
        });

        document.getElementById('confirmYes').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.getElementById('confirmNo').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                this.hideModal();
            }
        });
    }

    handleFormSubmit() {
        const formData = this.getFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            if (this.editingStudentId) {
                this.updateStudent(this.editingStudentId, formData);
                this.showNotification('Profil mahasiswa berhasil diperbarui!', 'success');
            } else {
                if (this.students.some(s => s.studentId === formData.studentId)) {
                    this.showNotification('NIM sudah terdaftar!', 'error');
                    return;
                }
                this.addStudent(formData);
                this.showNotification('Profil mahasiswa berhasil ditambahkan!', 'success');
            }

            this.resetForm();
            this.updateDisplay();
            this.populateFilterOptions();
            this.saveStudents();
        } catch (error) {
            this.showNotification('Gagal menyimpan data mahasiswa', 'error');
        }
    }

    getFormData() {
        return {
            studentName: document.getElementById('studentName').value.trim(),
            studentId: document.getElementById('studentId').value.trim(),
            email: document.getElementById('email').value.trim(),
            program: document.getElementById('program').value,
            semester: document.getElementById('semester').value,
            gpa: document.getElementById('gpa').value
        };
    }

    validateForm(data) {
        const { studentName, studentId, email, program, semester, gpa } = data;
        let isValid = true;

        this.clearErrors();

        if (!studentName || studentName.length < 2) {
            this.showFieldError('studentName', 'Nama minimal 2 karakter');
            isValid = false;
        }

        if (!studentId || studentId.length < 5) {
            this.showFieldError('studentId', 'NIM minimal 5 karakter');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            this.showFieldError('email', 'Format email tidak valid');
            isValid = false;
        }

        if (!program) {
            this.showFieldError('program', 'Program studi harus dipilih');
            isValid = false;
        }

        if (!semester || semester < 1 || semester > 8) {
            this.showFieldError('semester', 'Semester harus antara 1-8');
            isValid = false;
        }

        const gpaNum = parseFloat(gpa);
        if (!gpa || isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
            this.showFieldError('gpa', 'IPK harus antara 0.00-4.00');
            isValid = false;
        }

        return isValid;
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-group input, .form-group select');
        
        errorElements.forEach(element => {
            element.classList.remove('show');
            element.textContent = '';
        });

        inputElements.forEach(element => {
            element.classList.remove('error');
        });
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    addStudent(studentData) {
        const { studentName, studentId, email, program, semester, gpa } = studentData;
        const student = new StudentProfile(studentName, studentId, email, program, semester, gpa);
        this.students.push(student);
    }

    updateStudent(studentId, data) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            student.updateProfile(data);
        }
    }

    deleteStudent(studentId) {
        const index = this.students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            this.students.splice(index, 1);
            this.updateDisplay();
            this.saveStudents();
            this.populateFilterOptions();
            this.showNotification('Profil mahasiswa berhasil dihapus!', 'success');
        }
    }

    resetForm() {
        document.getElementById('profileForm').reset();
        this.editingStudentId = null;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> <span>Tambah Profil</span>';
        document.getElementById('cancelBtn').style.display = 'none';
        this.clearErrors();
    }

    cancelEdit() {
        this.resetForm();
        this.showNotification('Mode edit dibatalkan.', 'success');
    }

    updateDisplay() {
        this.displayStudents();
        this.updateStats();
    }

    displayStudents(studentsToShow = null) {
        const container = document.getElementById('studentsContainer');
        const students = studentsToShow || this.students;

        if (students.length === 0) {
            container.innerHTML = `
                <div class="no-students">
                    <i class="fas fa-user-plus" aria-hidden="true"></i>
                    <p>${this.students.length === 0 ? 'Belum ada mahasiswa. Tambahkan profil mahasiswa pertama Anda!' : 'Tidak ada mahasiswa yang sesuai dengan filter.'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = students.map(student => this.createStudentHTML(student)).join('');
    }

    createStudentHTML(student) {
        const gpaCategory = student.getGPACategory();
        
        return `
            <div class="student-card">
                <div class="student-header">
                    <div class="student-info">
                        <div class="student-name">${this.escapeHtml(student.name)}</div>
                        <div class="student-id">NIM: ${this.escapeHtml(student.studentId)}</div>
                        <div class="student-email">
                            <i class="fas fa-envelope" aria-hidden="true"></i>
                            ${this.escapeHtml(student.email)}
                        </div>
                    </div>
                </div>
                
                <div class="student-details">
                    <div class="detail-item">
                        <div class="detail-label">Program Studi</div>
                        <div class="detail-value">${this.escapeHtml(student.program)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Semester</div>
                        <div class="detail-value">Semester ${student.semester}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">IPK</div>
                        <div class="detail-value">
                            <span class="gpa-badge gpa-${gpaCategory}">${student.gpa.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Ditambahkan</div>
                        <div class="detail-value">${new Date(student.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                </div>

                <div class="student-actions">
                    <button onclick="window.studentApp.editStudent('${student.id}')" class="btn-edit">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                        <span>Edit</span>
                    </button>
                    <button onclick="window.studentApp.showDeleteConfirm('${student.id}')" class="btn-delete">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                        <span>Hapus</span>
                    </button>
                </div>
            </div>
        `;
    }

    filterStudents() {
        let filteredStudents = [...this.students];

        if (this.currentFilter.search) {
            filteredStudents = filteredStudents.filter(student => 
                student.name.toLowerCase().includes(this.currentFilter.search) ||
                student.studentId.toLowerCase().includes(this.currentFilter.search) ||
                student.email.toLowerCase().includes(this.currentFilter.search)
            );
        }

        if (this.currentFilter.program) {
            filteredStudents = filteredStudents.filter(student => student.program === this.currentFilter.program);
        }

        if (this.currentFilter.semester) {
            filteredStudents = filteredStudents.filter(student => student.semester === parseInt(this.currentFilter.semester));
        }

        this.displayStudents(filteredStudents);
    }

    populateFilterOptions() {
        const programs = [...new Set(this.students.map(s => s.program))];
        const filterProgram = document.getElementById('filterProgram');
        
        const currentValue = filterProgram.value;
        
        filterProgram.innerHTML = '<option value="">Semua Program Studi</option>';
        programs.forEach(program => {
            filterProgram.innerHTML += `<option value="${this.escapeHtml(program)}">${this.escapeHtml(program)}</option>`;
        });
        
        if (programs.includes(currentValue)) {
            filterProgram.value = currentValue;
        }
    }

    updateStats() {
        const totalStudents = this.students.length;
        const uniquePrograms = [...new Set(this.students.map(s => s.program))].length;
        const averageGPA = totalStudents > 0 ? 
            this.students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents : 0;
        const highAchievers = this.students.filter(s => s.gpa >= 3.5).length;

        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('totalPrograms').textContent = uniquePrograms;
        document.getElementById('averageGPA').textContent = averageGPA.toFixed(2);
        document.getElementById('highAchievers').textContent = highAchievers;
    }

    editStudent(studentId) {
        try {
            const student = this.students.find(s => s.id === studentId);
            if (!student) return;

            const { name, studentId: nim, email, program, semester, gpa } = student;

            document.getElementById('studentName').value = name;
            document.getElementById('studentId').value = nim;
            document.getElementById('email').value = email;
            document.getElementById('program').value = program;
            document.getElementById('semester').value = semester;
            document.getElementById('gpa').value = gpa;

            this.editingStudentId = studentId;
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> <span>Update Profil</span>';
            document.getElementById('cancelBtn').style.display = 'inline-flex';

            document.querySelector('.profile-form-section').scrollIntoView({ behavior: 'smooth' });

            this.showNotification('Mode edit aktif. Ubah data dan klik Update Profil.', 'success');
        } catch (error) {
            this.showNotification('Gagal memuat data untuk edit', 'error');
        }
    }

    showDeleteConfirm(studentId) {
        try {
            const student = this.students.find(s => s.id === studentId);
            if (!student) return;

            document.getElementById('confirmMessage').textContent = 
                `Apakah Anda yakin ingin menghapus profil ${student.name}?`;
            document.getElementById('confirmModal').classList.add('show');
            document.getElementById('confirmModal').setAttribute('aria-hidden', 'false');
            
            this.pendingDeleteId = studentId;
        } catch (error) {
            this.showNotification('Terjadi kesalahan saat menghapus profil', 'error');
        }
    }

    confirmDelete() {
        if (this.pendingDeleteId) {
            this.deleteStudent(this.pendingDeleteId);
            this.pendingDeleteId = null;
        }
        this.hideModal();
    }

    hideModal() {
        document.getElementById('confirmModal').classList.remove('show');
        document.getElementById('confirmModal').setAttribute('aria-hidden', 'true');
    }

    handleExport() {
        try {
            if (this.students.length === 0) {
                this.showNotification('Tidak ada data untuk diekspor', 'error');
                return;
            }

            const exportData = this.students.map(student => ({
                Nama: student.name,
                NIM: student.studentId,
                Email: student.email,
                'Program Studi': student.program,
                Semester: student.semester,
                IPK: student.gpa,
                'Tanggal Ditambahkan': new Date(student.createdAt).toLocaleDateString('id-ID')
            }));

            const csvContent = this.convertToCSV(exportData);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `data-mahasiswa-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            this.showNotification('Data berhasil diekspor!', 'success');
        } catch (error) {
            this.showNotification('Gagal mengekspor data', 'error');
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
        );

        return [csvHeaders, ...csvRows].join('\n');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" aria-hidden="true"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.studentApp = new StudentManagementApp();
});

window.addEventListener('load', () => {
    if (!window.studentApp) {
        window.studentApp = new StudentManagementApp();
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);