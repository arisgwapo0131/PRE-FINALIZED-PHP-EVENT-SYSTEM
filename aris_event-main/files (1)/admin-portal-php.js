// Admin Portal - PHP Version
var CU = null;
var evFilter = 'all';

// API call helper
async function apiCall(action, data = {}, method = 'POST') {
 try {
 const formData = new FormData();
 formData.append('action', action);
 
 for (const key in data) {
 formData.append(key, data[key]);
 }
 
 const response = await fetch('api.php', {
 method: method,
 body: method === 'POST' ? formData : null
 });
 
 return await response.json();
 } catch (error) {
 console.error('API Error:', error);
 return { success: false, message: 'Network error' };
 }
}

// API GET helper
async function apiGet(action, params = {}) {
 const queryString = new URLSearchParams({ action, ...params }).toString();
 try {
 const response = await fetch(`api.php?${queryString}`);
 return await response.json();
 } catch (error) {
 console.error('API Error:', error);
 return { success: false, message: 'Network error' };
 }
}

function toast(msg, type) {
 var t = document.getElementById('toast');
 t.textContent = msg;
 t.className = 'toast show ' + (type || 'ok');
 setTimeout(function() {
 t.classList.remove('show');
 }, 3200);
}

function showPage(id) {
 document.querySelectorAll('.pg').forEach(function(el) {
 el.classList.remove('active');
 });
 document.querySelectorAll('.ni').forEach(function(el) {
 el.classList.remove('active');
 });
 document.getElementById('pg-' + id).classList.add('active');
 var nav = document.getElementById('nav-' + id);
 if (nav) nav.classList.add('active');
}

async function doLogin() {
 var u = document.getElementById('un').value.trim();
 var p = document.getElementById('pw').value.trim();
 var err = document.getElementById('lerr');
 err.textContent = '';
 
 if (!u || !p) {
 err.textContent = 'Please fill both fields.';
 return;
 }
 
 const result = await apiCall('login', { username: u, password: p, role: 'admin' });
 
 if (result.success) {
 CU = result.data;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 renderDash();
 } else {
 err.textContent = result.message;
 }
}

async function doLogout() {
 window.location.href = 'logout.php';
}

function mkBadge(s) {
 var m = { approved: 'b-ap', pending: 'b-pe', rejected: 'b-re' };
 return '<span class="badge ' + (m[s] || 'b-pe') + '">' + s + '</span>';
}

function roleBadge(r) {
 var m = { student: 'b-st', faculty: 'b-fa', admin: 'b-ad' };
 return '<span class="badge ' + (m[r] || 'b-ad') + '">' + r + '</span>';
}

async function renderDash() {
 showPage('dash');
 
 const stats = await apiGet('getDashboardStats');
 if (stats.success) {
 document.getElementById('d-us').textContent = stats.data.total_users || 0;
 document.getElementById('d-ev').textContent = stats.data.total_events || 0;
 document.getElementById('d-rg').textContent = stats.data.total_registrations || 0;
 document.getElementById('d-pe').textContent = stats.data.pending_events || 0;
 document.getElementById('d-an').textContent = stats.data.total_announcements || 0;
 }
 
 const events = await apiGet('getEvents', { status: 'pending' });
 var tb = document.getElementById('pend-tb');
 
 if (!events.success || events.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No pending events!</td></tr>';
 return;
 }
 
 tb.innerHTML = events.data.map(function(e) {
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + (e.organizer_name || e.organizer) + '</td><td>' + e.date + '</td><td>' + e.category + '</td><td><button class="bsm bap" onclick="setStatus(\'' + e.event_id + '\',\'approved\')"> Approve</button><button class="bsm brj" onclick="setStatus(\'' + e.event_id + '\',\'rejected\')"> Reject</button></td></tr>';
 }).join('');
}

function setFilter(f) {
 evFilter = f;
 document.querySelectorAll('.fb').forEach(function(b) {
 b.classList.remove('on');
 });
 document.getElementById('fa-' + f).classList.add('on');
 renderEvents();
}

async function renderEvents() {
 showPage('events');
 
 const params = evFilter !== 'all' ? { status: evFilter } : {};
 const result = await apiGet('getEvents', params);
 
 var tb = document.getElementById('ev-tb');
 
 if (!result.success || result.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="7" class="emp">No events found.</td></tr>';
 return;
 }
 
 // Get registration counts
 const regs = await apiGet('getRegistrations');
 const regCounts = {};
 if (regs.success) {
 regs.data.forEach(r => {
 regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
 });
 }
 
 tb.innerHTML = result.data.map(function(e) {
 var a = '';
 if (e.status === 'pending') {
 a = '<button class="bsm bap" onclick="setStatus(\'' + e.event_id + '\',\'approved\')">Approve</button><button class="bsm brj" onclick="setStatus(\'' + e.event_id + '\',\'rejected\')">Reject</button>';
 } else if (e.status === 'approved') {
 a = '<button class="bsm brj" onclick="setStatus(\'' + e.event_id + '\',\'rejected\')">Revoke</button>';
 } else {
 a = '<button class="bsm bap" onclick="setStatus(\'' + e.event_id + '\',\'approved\')">Re-approve</button>';
 }
 a += '<button class="bsm bdl" onclick="delEvent(\'' + e.event_id + '\')">Delete</button>';
 
 const regCount = regCounts[e.event_id] || 0;
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + (e.organizer_name || e.organizer) + '</td><td>' + e.date + '</td><td>' + e.category + '</td><td><span class="cnt">' + regCount + '/' + e.capacity + '</span></td><td>' + mkBadge(e.status) + '</td><td>' + a + '</td></tr>';
 }).join('');
}

async function setStatus(event_id, status) {
 const result = await apiCall('updateEventStatus', { event_id, status });
 
 if (result.success) {
 toast('Event ' + status + '.', status === 'approved' ? 'ok' : 'wn');
 renderDash();
 renderEvents();
 } else {
 toast(result.message, 'er');
 }
}

async function delEvent(event_id) {
 if (!confirm('Permanently delete this event?')) return;
 
 const result = await apiCall('deleteEvent', { event_id });
 
 if (result.success) {
 toast('Event deleted.', 'er');
 renderEvents();
 renderDash();
 } else {
 toast(result.message, 'er');
 }
}

async function renderRegs() {
 showPage('regs');
 
 const result = await apiGet('getRegistrations');
 var tb = document.getElementById('rg-tb');
 
 if (!result.success || result.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No registrations yet.</td></tr>';
 return;
 }
 
 tb.innerHTML = result.data.map(function(r) {
 return '<tr><td>' + r.student_name + '</td><td>' + r.event_title + '</td><td>' + r.event_date + '</td><td>' + r.student_id + '</td><td>' + r.registered_at.split(' ')[0] + '</td></tr>';
 }).join('');
}

async function renderUsers() {
 showPage('users');
 
 const result = await apiGet('getUsers');
 var tb = document.getElementById('us-tb');
 
 if (!result.success || result.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No users.</td></tr>';
 return;
 }
 
 tb.innerHTML = result.data.map(function(u) {
 return '<tr><td><strong>' + u.name + '</strong></td><td><code>' + u.username + '</code></td><td>' + u.email + '</td><td>' + roleBadge(u.role) + '</td><td><span class="badge b-ap">' + (u.status || 'active') + '</span></td></tr>';
 }).join('');
}

async function renderRes() {
 showPage('res');
 
 const resources = await apiGet('getResources');
 const volunteers = await apiGet('getVolunteers');
 const venues = await apiGet('getVenues');
 
 document.getElementById('rs-tb').innerHTML = resources.success && resources.data.length ? 
 resources.data.map(r => '<tr><td>' + r.name + '</td><td>' + r.type + '</td><td>' + r.qty + '</td><td>' + r.event_title + '</td><td>' + r.added_by + '</td><td><button class="bsm bdl" onclick="delRes(\'' + r.res_id + '\')">Delete</button></td></tr>').join('') :
 '<tr><td colspan="6" class="emp">No resources yet.</td></tr>';
 
 document.getElementById('vo-tb').innerHTML = volunteers.success && volunteers.data.length ?
 volunteers.data.map(v => '<tr><td>' + v.name + '</td><td>' + v.email + '</td><td>' + v.event_title + '</td><td>' + v.task + '</td><td><button class="bsm bdl" onclick="delVol(\'' + v.vol_id + '\')">Delete</button></td></tr>').join('') :
 '<tr><td colspan="5" class="emp">No volunteers yet.</td></tr>';
 
 document.getElementById('vn-tb').innerHTML = venues.success && venues.data.length ?
 venues.data.map(v => '<tr><td>' + v.name + '</td><td>' + v.event_title + '</td><td>' + v.date + '</td><td>' + v.capacity + '</td><td>' + v.reserved_by + '</td><td><button class="bsm bdl" onclick="delVen(\'' + v.venue_id + '\')">Delete</button></td></tr>').join('') :
 '<tr><td colspan="6" class="emp">No venue reservations yet.</td></tr>';
}

async function delRes(res_id) {
 if (!confirm('Delete?')) return;
 const result = await apiCall('deleteResource', { res_id });
 if (result.success) {
 toast('Deleted.', 'er');
 renderRes();
 }
}

async function delVol(vol_id) {
 if (!confirm('Delete?')) return;
 const result = await apiCall('deleteVolunteer', { vol_id });
 if (result.success) {
 toast('Deleted.', 'er');
 renderRes();
 }
}

async function delVen(venue_id) {
 if (!confirm('Delete?')) return;
 const result = await apiCall('deleteVenue', { venue_id });
 if (result.success) {
 toast('Deleted.', 'er');
 renderRes();
 }
}

async function postAnn() {
 var title = document.getElementById('ann-title').value.trim();
 var priority = document.getElementById('ann-priority').value;
 var audience = document.getElementById('ann-audience').value;
 var expiry = document.getElementById('ann-expiry').value;
 var body = document.getElementById('ann-body').value.trim();
 
 if (!title) {
 toast('Title is required.', 'er');
 return;
 }
 if (!body) {
 toast('Message is required.', 'er');
 return;
 }
 
 const result = await apiCall('postAnnouncement', { title, priority, audience, expiry, body });
 
 if (result.success) {
 toast('Announcement posted!', 'ok');
 document.getElementById('ann-title').value = '';
 document.getElementById('ann-body').value = '';
 document.getElementById('ann-expiry').value = '';
 document.getElementById('ann-priority').selectedIndex = 0;
 document.getElementById('ann-audience').selectedIndex = 0;
 renderAnn();
 renderDash();
 } else {
 toast(result.message, 'er');
 }
}

async function deleteAnn(ann_id) {
 if (!confirm('Delete this announcement?')) return;
 
 const result = await apiCall('deleteAnnouncement', { ann_id });
 
 if (result.success) {
 toast('Announcement deleted.', 'er');
 renderAnn();
 renderDash();
 }
}

function audLabel(a) {
 return { all: 'Everyone', students: 'Students Only', faculty: 'Faculty Only' }[a] || a;
}

function ptag(p) {
 var c = { normal: 'pt-n', important: 'pt-i', urgent: 'pt-u' };
 var l = { normal: 'Normal', important: 'Important', urgent: ' Urgent' };
 return '<span class="ptag ' + (c[p] || 'pt-n') + '">' + (l[p] || p) + '</span>';
}

async function renderAnn() {
 showPage('ann');
 
 const result = await apiGet('getAnnouncements', { audience: 'all' });
 var list = document.getElementById('ann-list');
 var empty = document.getElementById('ann-empty');
 
 if (!result.success || result.data.length === 0) {
 empty.style.display = 'block';
 list.innerHTML = '';
 return;
 }
 
 empty.style.display = 'none';
 list.innerHTML = result.data.map(function(a) {
 var d = new Date(a.posted_at);
 var ds = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
 var exp = a.expiry ? '<span style="color:var(--warning);font-size:11px;"> Expires ' + a.expiry + '</span>' : '';
 
 return '<div class="ann-card p-' + a.priority + '">' +
 '<div class="ann-hdr"><div class="ann-title">' + a.title + '</div><button class="bsm bdl" onclick="deleteAnn(\'' + a.ann_id + '\')">Delete</button></div>' +
 '<div class="ann-meta"><span> ' + ds + '</span><span> ' + a.posted_by + '</span><span class="atag">' + audLabel(a.audience) + '</span>' + exp + '</div>' +
 '<div class="ann-body">' + a.body.replace(/\n/g, '<br>') + '</div>' +
 '<div class="ann-foot">' + ptag(a.priority) + '</div>' +
 '</div>';
 }).join('');
}

async function renderReports() {
 showPage('reports');
 
 const events = await apiGet('getEvents');
 const feedback = await apiGet('getFeedback');
 
 if (events.success) {
 // Events by status
 const statusCounts = { pending: 0, approved: 0, rejected: 0 };
 const catCounts = {};
 
 events.data.forEach(e => {
 statusCounts[e.status]++;
 catCounts[e.category] = (catCounts[e.category] || 0) + 1;
 });
 
 document.getElementById('rp-status').innerHTML = Object.entries(statusCounts)
 .map(([k, v]) => '<div class="ri"><span>' + k + '</span><span class="rv">' + v + '</span></div>')
 .join('');
 
 document.getElementById('rp-cat').innerHTML = Object.entries(catCounts)
 .map(([k, v]) => '<div class="ri"><span>' + k + '</span><span class="rv">' + v + '</span></div>')
 .join('');
 }
 
 if (feedback.success && feedback.data.length) {
 document.getElementById('rp-fb').innerHTML = feedback.data.slice(0, 5)
 .map(f => '<div class="ri"><span>' + f.student_name + '</span><span class="rv"> ' + f.rating + '</span></div>')
 .join('');
 }
}

// Event listeners
window.onload = function() {
 document.getElementById('btn-login').onclick = doLogin;
 document.getElementById('pw').onkeydown = function(e) {
 if (e.key === 'Enter') doLogin();
 };
 document.getElementById('un').onkeydown = function(e) {
 if (e.key === 'Enter') doLogin();
 };
 document.getElementById('btn-logout').onclick = doLogout;
 document.getElementById('nav-dash').onclick = renderDash;
 document.getElementById('nav-events').onclick = function() { setFilter('all'); };
 document.getElementById('nav-regs').onclick = renderRegs;
 document.getElementById('nav-users').onclick = renderUsers;
 document.getElementById('nav-res').onclick = renderRes;
 document.getElementById('nav-ann').onclick = renderAnn;
 document.getElementById('nav-reports').onclick = renderReports;
 document.getElementById('btn-rf-dash').onclick = renderDash;
 document.getElementById('btn-rf-ev').onclick = renderEvents;
 document.getElementById('btn-rf-rg').onclick = renderRegs;
 document.getElementById('btn-rf-us').onclick = renderUsers;
 document.getElementById('btn-rf-rs').onclick = renderRes;
 document.getElementById('btn-rf-an').onclick = renderAnn;
 document.getElementById('btn-rf-rp').onclick = renderReports;
 document.getElementById('fa-all').onclick = function() { setFilter('all'); };
 document.getElementById('fa-pending').onclick = function() { setFilter('pending'); };
 document.getElementById('fa-approved').onclick = function() { setFilter('approved'); };
 document.getElementById('fa-rejected').onclick = function() { setFilter('rejected'); };
 document.getElementById('btn-post-ann').onclick = postAnn;
};
