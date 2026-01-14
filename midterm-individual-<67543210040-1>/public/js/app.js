(() => {
	const $ = s => document.querySelector(s);
	const $$ = s => Array.from(document.querySelectorAll(s));

	// Elements
	const studentList = $('#student-list');
	const loadingEl = $('#loading');
	const statActive = $('#stat-active');
	const statGraduated = $('#stat-graduated');
	const statSuspended = $('#stat-suspended');
	const statTotal = $('#stat-total');
	const statGpa = $('#stat-gpa');

	const addBtn = $('#add-btn');
	const filterBtns = $$('.filter-btn');

	// Modals & forms
	const studentModal = $('#student-modal');
	const modalTitle = $('#modal-title');
	const studentForm = $('#student-form');
	const studentIdInput = $('#student-id');
	const student_code = $('#student_code');
	const first_name = $('#first_name');
	const last_name = $('#last_name');
	const email = $('#email');
	const major = $('#major');
	const cancelBtn = $('#cancel-btn');

	const gpaModal = $('#gpa-modal');
	const gpaForm = $('#gpa-form');
	const gpaStudentId = $('#gpa-student-id');
	const gpaInput = $('#gpa');
	const gpaCancel = $('#gpa-cancel');
	const gpaClose = $('#gpa-close');

	const statusModal = $('#status-modal');
	const statusForm = $('#status-form');
	const statusStudentId = $('#status-student-id');
	const statusSelect = $('#status');
	const statusCancel = $('#status-cancel');
	const statusClose = $('#status-close');

	const closeButtons = $$('.modal .close');

	let currentFilter = 'all';

	// Helpers
	const show = el => el && (el.style.display = '');
	const hide = el => el && (el.style.display = 'none');
	const openModal = (modal) => { modal && (modal.style.display = 'block'); };
	const closeModal = (modal) => { modal && (modal.style.display = 'none'); };

	const api = (path, opts = {}) => fetch(path, opts).then(async r => {
		const text = await r.text();
		let body = text ? (() => { try { return JSON.parse(text); } catch (e) { return text; } })() : null;
		if (!r.ok) {
			const msg = (body && body.error) || r.statusText || 'Error';
			throw new Error(msg);
		}
		return body;
	});

	// Render
	function renderStudents(students) {
		if (!students || students.length === 0) {
			studentList.innerHTML = '<div class="no-students">🎓 No students found</div>';
			return;
		}
		studentList.innerHTML = students.map(s => {
			const gpa = (s.gpa !== undefined && s.gpa !== null) ? Number(s.gpa).toFixed(2) : '0.00';
			return `
			<div class="student-card" data-id="${s.id}" data-status="${s.status}">
				<div class="student-head">
					<h3>${escapeHtml(s.first_name)} ${escapeHtml(s.last_name)}</h3>
					<span class="student-code">🆔 ${escapeHtml(s.student_code)}</span>
				</div>
				<p><strong>Major:</strong> ${escapeHtml(s.major)} &nbsp; <strong>GPA:</strong> ${gpa}</p>
				<p><strong>Email:</strong> ${escapeHtml(s.email)}</p>
				<p><strong>Status:</strong> ${escapeHtml(s.status)}</p>
				<div class="card-actions">
					<button class="btn btn-sm edit-btn">Edit</button>
					<button class="btn btn-sm gpa-btn">GPA</button>
					<button class="btn btn-sm status-btn">Status</button>
					<button class="btn btn-sm danger delete-btn">Delete</button>
				</div>
			</div>`;
		}).join('');

		$$('.edit-btn').forEach(b => b.addEventListener('click', onEdit));
		$$('.gpa-btn').forEach(b => b.addEventListener('click', onGpa));
		$$('.status-btn').forEach(b => b.addEventListener('click', onStatus));
		$$('.delete-btn').forEach(b => b.addEventListener('click', onDelete));
	}

	function updateStats(statObj) {
		if (!statObj) return;
		statActive.textContent = statObj.active ?? 0;
		statGraduated.textContent = statObj.graduated ?? 0;
		statSuspended.textContent = statObj.suspended ?? 0;
		statTotal.textContent = statObj.total ?? 0;
		const avg = statObj.averageGPA ?? 0;
		statGpa.textContent = Number.isFinite(avg) ? avg.toFixed(2) : parseFloat(avg || 0).toFixed(2);
	}

	// Load
	async function loadStudents() {
		loadingEl && (loadingEl.style.display = '');
		studentList && (studentList.innerHTML = '');
		try {
			const qs = currentFilter && currentFilter !== 'all' ? `?status=${encodeURIComponent(currentFilter)}` : '';
			const data = await api(`/api/students${qs}`);
			if (data && data.students) {
				renderStudents(data.students);
				updateStats(data.statistics);
			} else if (Array.isArray(data)) {
				renderStudents(data);
			} else {
				renderStudents([]);
			}
		} catch (err) {
			alert('Failed to load students: ' + err.message);
		} finally {
			loadingEl && (loadingEl.style.display = 'none');
		}
	}

	// Events
	addBtn && addBtn.addEventListener('click', () => {
		modalTitle.textContent = 'Add New Student';
		studentForm.reset();
		studentIdInput.value = '';
		openModal(studentModal);
	});

	filterBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			filterBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentFilter = btn.dataset.filter;
			loadStudents();
		});
	});

	cancelBtn && cancelBtn.addEventListener('click', () => closeModal(studentModal));

	closeButtons.forEach(b => b.addEventListener('click', (e) => {
		const modal = e.target.closest('.modal');
		closeModal(modal);
	}));

	// Form submit (add/update)
	studentForm && studentForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const id = studentIdInput.value;
		const payload = {
			student_code: student_code.value.trim(),
			first_name: first_name.value.trim(),
			last_name: last_name.value.trim(),
			email: email.value.trim(),
			major: major.value
		};

		try {
			if (id) {
				await api(`/api/students/${id}`, {
					method: 'PUT',
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify(payload)
				});
			} else {
				await api('/api/students', {
					method: 'POST',
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify(payload)
				});
			}
			closeModal(studentModal);
			loadStudents();
		} catch (err) {
			alert('Save failed: ' + err.message);
		}
	});

	// Edit handler
	async function onEdit(e) {
		const card = e.target.closest('.student-card');
		const id = card.dataset.id;
		try {
			const student = await api(`/api/students/${id}`);
			modalTitle.textContent = 'Edit Student';
			studentIdInput.value = student.id;
			student_code.value = student.student_code;
			first_name.value = student.first_name;
			last_name.value = student.last_name;
			email.value = student.email;
			major.value = student.major;
			openModal(studentModal);
		} catch (err) {
			alert('Failed to load student: ' + err.message);
		}
	}

	// GPA handlers
	function onGpa(e) {
		const card = e.target.closest('.student-card');
		gpaStudentId.value = card.dataset.id;
		gpaForm.reset();
		openModal(gpaModal);
	}
	gpaForm && gpaForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const id = gpaStudentId.value;
		const value = parseFloat(gpaInput.value);
		try {
			await api(`/api/students/${id}/gpa`, {
				method: 'PATCH',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify({ gpa: value })
			});
			closeModal(gpaModal);
			loadStudents();
		} catch (err) {
			alert('Update GPA failed: ' + err.message);
		}
	});
	gpaCancel && gpaCancel.addEventListener('click', () => closeModal(gpaModal));
	gpaClose && gpaClose.addEventListener('click', () => closeModal(gpaModal));

	// Status handlers
	function onStatus(e) {
		const card = e.target.closest('.student-card');
		statusStudentId.value = card.dataset.id;
		statusForm.reset();
		openModal(statusModal);
	}
	statusForm && statusForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const id = statusStudentId.value;
		const value = statusSelect.value;
		try {
			await api(`/api/students/${id}/status`, {
				method: 'PATCH',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify({ status: value })
			});
			closeModal(statusModal);
			loadStudents();
		} catch (err) {
			alert('Update status failed: ' + err.message);
		}
	});
	statusCancel && statusCancel.addEventListener('click', () => closeModal(statusModal));
	statusClose && statusClose.addEventListener('click', () => closeModal(statusModal));

	// Delete
	async function onDelete(e) {
		const card = e.target.closest('.student-card');
		const id = card.dataset.id;
		if (!confirm('Are you sure you want to delete this student?')) return;
		try {
			await api(`/api/students/${id}`, { method: 'DELETE' });
			loadStudents();
		} catch (err) {
			alert('Delete failed: ' + err.message);
		}
	}

	// Click outside modal to close
	window.addEventListener('click', (ev) => {
		[studentModal, gpaModal, statusModal].forEach(modal => {
			if (modal && ev.target === modal) closeModal(modal);
		});
	});

	// Escape HTML to prevent XSS
	function escapeHtml(text) {
		const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
		return String(text == null ? '' : text).replace(/[&<>"']/g, m => map[m]);
	}

	// Init
	document.addEventListener('DOMContentLoaded', () => {
		hide(loadingEl);
		loadStudents();
	});
})();