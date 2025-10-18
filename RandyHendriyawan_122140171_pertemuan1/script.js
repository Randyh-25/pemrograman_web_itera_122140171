class TaskManager {
    constructor() {
        this.tasks = [];
        this.editingTaskId = null;
        this.currentFilter = {
            status: '',
            subject: '',
            priority: '',
            search: ''
        };
        this.init();
    }

    init() {
        this.loadTasks();
        this.bindEvents();
        this.updateDisplay();
        this.populateSubjectFilter();
    }
    bindEvents() {
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.filterTasks();
        });

        document.getElementById('filterSubject').addEventListener('change', (e) => {
            this.currentFilter.subject = e.target.value;
            this.filterTasks();
        });

        document.getElementById('filterPriority').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.filterTasks();
        });

        document.getElementById('searchTask').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.filterTasks();
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
    validateForm() {
        const taskName = document.getElementById('taskName').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const deadline = document.getElementById('deadline').value;
        const priority = document.getElementById('priority').value;

        let isValid = true;

        this.clearErrors();

        if (!taskName) {
            this.showError('taskNameError', 'Nama tugas tidak boleh kosong');
            document.getElementById('taskName').classList.add('error');
            isValid = false;
        } else if (taskName.length < 3) {
            this.showError('taskNameError', 'Nama tugas minimal 3 karakter');
            document.getElementById('taskName').classList.add('error');
            isValid = false;
        }

        if (!subject) {
            this.showError('subjectError', 'Mata kuliah tidak boleh kosong');
            document.getElementById('subject').classList.add('error');
            isValid = false;
        }

        if (!deadline) {
            this.showError('deadlineError', 'Deadline harus diisi');
            document.getElementById('deadline').classList.add('error');
            isValid = false;
        } else {
            const deadlineDate = new Date(deadline);
            const now = new Date();
            if (deadlineDate <= now) {
                this.showError('deadlineError', 'Deadline harus di masa depan');
                document.getElementById('deadline').classList.add('error');
                isValid = false;
            }
        }

        if (!priority) {
            this.showError('priorityError', 'Prioritas harus dipilih');
            document.getElementById('priority').classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-group input, .form-group select');
        
        errorElements.forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });

        inputElements.forEach(el => {
            el.classList.remove('error');
        });
    }
    handleFormSubmit() {
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        
        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, formData);
        } else {
            this.addTask(formData);
        }

        this.resetForm();
        this.updateDisplay();
        this.saveTasks();
    }

    getFormData() {
        return {
            name: document.getElementById('taskName').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            deadline: document.getElementById('deadline').value,
            priority: document.getElementById('priority').value,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        this.editingTaskId = null;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> <span>Tambah Tugas</span>';
        document.getElementById('cancelBtn').style.display = 'none';
        this.clearErrors();
    }

    cancelEdit() {
        this.resetForm();
    }
    addTask(taskData) {
        const task = {
            id: this.generateId(),
            ...taskData
        };
        this.tasks.push(task);
        this.populateSubjectFilter();
        this.showNotification('Tugas berhasil ditambahkan!', 'success');
    }

    updateTask(id, taskData) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...taskData };
            this.showNotification('Tugas berhasil diperbarui!', 'success');
        }
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.updateDisplay();
            this.saveTasks();
            this.populateSubjectFilter();
            this.showNotification('Tugas berhasil dihapus!', 'success');
        }
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.status = task.status === 'pending' ? 'completed' : 'pending';
            task.completedAt = task.status === 'completed' ? new Date().toISOString() : null;
            this.updateDisplay();
            this.saveTasks();
            const message = task.status === 'completed' ? 'Tugas ditandai selesai!' : 'Tugas ditandai belum selesai!';
            this.showNotification(message, 'success');
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            
            // Fill form with task data
            document.getElementById('taskName').value = task.name;
            document.getElementById('subject').value = task.subject;
            document.getElementById('deadline').value = task.deadline;
            document.getElementById('priority').value = task.priority;
            
            // Update form UI
            document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> <span>Update Tugas</span>';
            document.getElementById('cancelBtn').style.display = 'inline-flex';
            
            document.querySelector('.task-form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }
    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showNotification('Gagal menyimpan data!', 'error');
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
            this.showNotification('Gagal memuat data!', 'error');
        }
    }
    updateDisplay() {
        this.displayTasks();
        this.updateStats();
    }

    displayTasks(tasksToShow = null) {
        const container = document.getElementById('tasksContainer');
        const tasks = tasksToShow || this.tasks;

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="no-tasks">
                    <i class="fas fa-clipboard"></i>
                    <p>Belum ada tugas. Tambahkan tugas pertama Anda!</p>
                </div>
            `;
            return;
        }

        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            
            const aDeadline = new Date(a.deadline);
            const bDeadline = new Date(b.deadline);
            
            return aDeadline - bDeadline;
        });

        container.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const isOverdue = deadlineDate < now && task.status === 'pending';
        const isUrgent = deadlineDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && task.status === 'pending';
        
        let deadlineClass = '';
        if (isOverdue) deadlineClass = 'overdue';
        else if (isUrgent) deadlineClass = 'urgent';

        const completedClass = task.status === 'completed' ? 'completed' : '';
        const completeButtonText = task.status === 'completed' ? 'Batal Selesai' : 'Tandai Selesai';
        const completeButtonIcon = task.status === 'completed' ? 'fas fa-undo' : 'fas fa-check';

        return `
            <div class="task-item ${completedClass}">
                <div class="task-header">
                    <div class="task-info">
                        <div class="task-name">${this.escapeHtml(task.name)}</div>
                        <div class="task-subject">${this.escapeHtml(task.subject)}</div>
                        <div class="task-deadline ${deadlineClass}">
                            <i class="fas fa-calendar-alt"></i>
                            ${this.formatDeadline(task.deadline)}
                        </div>
                    </div>
                    <div class="priority-badge priority-${task.priority}">
                        ${task.priority}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" onclick="taskManager.toggleTaskStatus(${task.id})">
                        <i class="${completeButtonIcon}"></i> ${completeButtonText}
                    </button>
                    <button class="btn-edit" onclick="taskManager.editTask(${task.id})" ${task.status === 'completed' ? 'disabled' : ''}>
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="taskManager.showDeleteConfirm(${task.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
    }

    filterTasks() {
        let filteredTasks = [...this.tasks];

        // Filter by status
        if (this.currentFilter.status) {
            filteredTasks = filteredTasks.filter(task => task.status === this.currentFilter.status);
        }

        // Filter by subject
        if (this.currentFilter.subject) {
            filteredTasks = filteredTasks.filter(task => task.subject === this.currentFilter.subject);
        }

        // Filter by priority
        if (this.currentFilter.priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === this.currentFilter.priority);
        }

        // Filter by search
        if (this.currentFilter.search) {
            filteredTasks = filteredTasks.filter(task => 
                task.name.toLowerCase().includes(this.currentFilter.search) ||
                task.subject.toLowerCase().includes(this.currentFilter.search)
            );
        }

        this.displayTasks(filteredTasks);
    }

    populateSubjectFilter() {
        const filterSelect = document.getElementById('filterSubject');
        const subjects = [...new Set(this.tasks.map(task => task.subject))];
        
        const currentValue = filterSelect.value;
        
        filterSelect.innerHTML = '<option value="">Semua Mata Kuliah</option>';
        subjects.forEach(subject => {
            filterSelect.innerHTML += `<option value="${this.escapeHtml(subject)}">${this.escapeHtml(subject)}</option>`;
        });
        
        if (subjects.includes(currentValue)) {
            filterSelect.value = currentValue;
        }
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;
        const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
        
        const now = new Date();
        const urgentTasks = this.tasks.filter(task => {
            if (task.status === 'completed') return false;
            const deadline = new Date(task.deadline);
            return deadline <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('urgentTasks').textContent = urgentTasks;
    }
    showDeleteConfirm(id) {
        this.taskToDelete = id;
        const task = this.tasks.find(t => t.id === id);
        document.getElementById('confirmMessage').textContent = 
            `Apakah Anda yakin ingin menghapus tugas "${task.name}"?`;
        document.getElementById('confirmModal').classList.add('show');
    }

    confirmDelete() {
        if (this.taskToDelete) {
            this.deleteTask(this.taskToDelete);
            this.taskToDelete = null;
        }
        this.hideModal();
    }

    hideModal() {
        document.getElementById('confirmModal').classList.remove('show');
    }
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatDeadline(deadline) {
        const date = new Date(deadline);
        const now = new Date();
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return date.toLocaleDateString('id-ID', options);
    }

    showNotification(message, type = 'info') {
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

let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});