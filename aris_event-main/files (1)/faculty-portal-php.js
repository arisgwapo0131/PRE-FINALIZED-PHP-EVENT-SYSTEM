// Faculty Portal - PHP Version
var CU = null;

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

function gf(id) {
 var el = document.getElementById(id);
 return el ? el.value.trim() : '';
}

function rf(id) {
 var el = document.getElementById(id);
 if (!el) return;
 if (el.tagName === 'SELECT') el.selectedIndex = 0;
 else el.value = '';
}

function mkBadge(s) {
 var m = { approved: 'b-ap', pending: 'b-pe', rejected: 'b-re' };
 return '<span class="badge ' + (m[s] || 'b-pe') + '">' + s + '</span>';
}

function toast(msg, type) {
 var t = document.getElementById('toast');
 t.textContent = msg;
 t.className = 'toast show ' + (type || 'ok');
 setTimeout(function() {
 t.classList.remove('show');
 }, 3200);
}

async function fillDD() {
 const result = await apiGet('getEvents', { organizer: CU.username });
 var html = '<option value="">-- Select event --</option>';
 
 if (result.success) {
 result.data.forEach(function(e) {
 html += '<option value="' + e.event_id + '" data-title="' + e.title + '">' + e.title + '</option>';
 });
 }
 
 ['vev', 'rev', 'vev2'].forEach(function(id) {
 var el = document.getElementById(id);
 if (el) el.innerHTML = html;
 });
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
 var u = gf('un'),
 p = gf('pw');
 var err = document.getElementById('lerr');
 err.textContent = '';
 
 if (!u || !p) {
 err.textContent = 'Please fill both fields.';
 return;
 }
 
 const result = await apiCall('login', { username: u, password: p, role: 'faculty' });
 
 if (result.success) {
 CU = result.data;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 fillDD();
 checkAnnBadge();
 renderDash();
 } else {
 err.textContent = result.message;
 }
}

async function doLogout() {
 window.location.href = 'logout.php';
}

async function checkAnnBadge() {
 const result = await apiGet('getAnnouncements', { audience: 'faculty' });
 var nb = document.getElementById('ann-nb');
 if (nb) nb.style.display = (result.success && result.data.length) ? 'inline' : 'none';
}

async function renderDash() {
 showPage('dash');
 
 const stats = await apiGet('getDashboardStats');
 if (stats.success) {
 document.getElementById('f-tot').textContent = stats.data.my_events || 0;
 document.getElementById('f-app').textContent = stats.data.approved_events || 0;
 document.getElementById('f-pen').textContent = stats.data.pending_events || 0;
 document.getElementById('f-reg').textContent = stats.data.total_registrations || 0;
 }
 
 const anns = await apiGet('getAnnouncements', { audience: 'faculty' });
 document.getElementById('f-ann').textContent = (anns.success ? anns.data.length : 0);
 
 const events = await apiGet('getEvents', { organizer: CU.username });
 const regs = await apiGet('getRegistrations');
 
 var tb = document.getElementById('dash-tb');
 
 if (!events.success || events.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="4" class="emp">No events yet.</td></tr>';
 return;
 }
 
 const regCounts = {};
 if (regs.success) {
 regs.data.forEach(r => {
 regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
 });
 }
 
 tb.innerHTML = events.data.slice(0, 6).map(function(e) {
 const regCount = regCounts[e.event_id] || 0;
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + e.date + '</td><td>' + mkBadge(e.status) + '</td><td><span class="rc">' + regCount + '/' + e.capacity + '</span></td></tr>';
 }).join('');
}

async function doCreateEvent() {
 var title = gf('ev-title'),
 category = gf('ev-cat'),
 date = gf('ev-date'),
 time = gf('ev-time'),
 location = gf('ev-loc'),
 capacity = gf('ev-cap');
 
 if (!title) { toast('Event title is required.', 'er'); return; }
 if (!category) { toast('Please select a category.', 'er'); return; }
 if (!date) { toast('Please select a date.', 'er'); return; }
 if (!time) { toast('Please select a time.', 'er'); return; }
 if (!location) { toast('Location is required.', 'er'); return; }
 if (!capacity || parseInt(capacity) < 1) { toast('Please enter a valid capacity.', 'er'); return; }
 
 const result = await apiCall('createEvent', {
 title: title,
 category: category,
 date: date,
 time: time,
 location: location,
 capacity: capacity,
 budget: gf('ev-bud') || 0,
 description: document.getElementById('ev-desc').value.trim()
 });
 
 if (result.success) {
 toast('Event created! Pending admin approval.', 'ok');
 ['ev-title', 'ev-date', 'ev-time', 'ev-loc', 'ev-cap', 'ev-bud', 'ev-desc'].forEach(rf);
 rf('ev-cat');
 renderEvList();
 fillDD();
 renderDash();
 showPage('events');
 } else {
 toast(result.message, 'er');
 }
}

async function renderEvList() {
 showPage('events');
 fillDD();
 
 const events = await apiGet('getEvents', { organizer: CU.username });
 const regs = await apiGet('getRegistrations');
 
 var tb = document.getElementById('ev-tb');
 
 if (!events.success || events.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="7" class="emp">No events yet.</td></tr>';
 return;
 }
 
 const regCounts = {};
 if (regs.success) {
 regs.data.forEach(r => {
 regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
 });
 }
 
 tb.innerHTML = events.data.map(function(e) {
 const regCount = regCounts[e.event_id] || 0;
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + e.date + '</td><td>' + e.location + '</td><td>' + e.category + '</td><td>' + mkBadge(e.status) + '</td><td><span class="rc">' + regCount + '/' + e.capacity + '</span></td><td><button class="bsm bdel" onclick="deleteEvent(\'' + e.event_id + '\')">Delete</button></td></tr>';
 }).join('');
}

async function deleteEvent(event_id) {
 if (!confirm('Delete this event?')) return;
 
 const result = await apiCall('deleteEvent', { event_id });
 
 if (result.success) {
 toast('Event deleted.', 'er');
 renderEvList();
 fillDD();
 renderDash();
 showPage('events');
 } else {
 toast(result.message, 'er');
 }
}

async function renderRegs() {
 showPage('regs');
 
 const events = await apiGet('getEvents', { organizer: CU.username });
 if (!events.success) return;
 
 const myEventIds = events.data.map(e => e.event_id);
 const regs = await apiGet('getRegistrations');
 
 var tb = document.getElementById('regs-tb');
 
 if (!regs.success || regs.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="4" class="emp">No student registrations yet.</td></tr>';
 return;
 }
 
 const myRegs = regs.data.filter(r => myEventIds.includes(r.event_id));
 
 if (myRegs.length === 0) {
 tb.innerHTML = '<tr><td colspan="4" class="emp">No student registrations yet.</td></tr>';
 return;
 }
 
 tb.innerHTML = myRegs.map(function(r) {
 return '<tr><td>' + r.student_name + '</td><td>' + r.event_title + '</td><td>' + r.event_date + '</td><td>' + r.registered_at.split(' ')[0] + '</td></tr>';
 }).join('');
}

async function assignVol() {
 var name = gf('vn'),
 email = gf('ve'),
 evId = gf('vev'),
 task = gf('vt');
 
 if (!name || !email || !evId || !task) {
 toast('Please fill all volunteer fields.', 'er');
 return;
 }
 
 const evSelect = document.getElementById('vev');
 const eventTitle = evSelect.options[evSelect.selectedIndex].getAttribute('data-title');
 
 const result = await apiCall('addVolunteer', {
 name: name,
 email: email,
 event_id: evId,
 event_title: eventTitle,
 task: task
 });
 
 if (result.success) {
 toast('Volunteer assigned!', 'ok');
 ['vn', 've', 'vt'].forEach(rf);
 rf('vev');
 renderVols();
 } else {
 toast(result.message, 'er');
 }
}

async function renderVols() {
 showPage('vols');
 fillDD();
 
 const volunteers = await apiGet('getVolunteers');
 var tb = document.getElementById('vol-tb');
 
 if (!volunteers.success || volunteers.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No volunteers assigned yet.</td></tr>';
 return;
 }
 
 tb.innerHTML = volunteers.data.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.email + '</td><td>' + v.event_title + '</td><td>' + v.task + '</td><td><button class="bsm bdel" onclick="deleteVol(\'' + v.vol_id + '\')">Remove</button></td></tr>';
 }).join('');
}

async function deleteVol(vol_id) {
 if (!confirm('Remove volunteer?')) return;
 
 const result = await apiCall('deleteVolunteer', { vol_id });
 
 if (result.success) {
 toast('Volunteer removed.', 'er');
 renderVols();
 }
}

async function addRes() {
 var name = gf('rn'),
 type = gf('rt'),
 qty = gf('rq'),
 evId = gf('rev');
 
 if (!name || !type || !qty || !evId) {
 toast('Please fill all resource fields.', 'er');
 return;
 }
 
 const evSelect = document.getElementById('rev');
 const eventTitle = evSelect.options[evSelect.selectedIndex].getAttribute('data-title');
 
 const result = await apiCall('addResource', {
 name: name,
 type: type,
 qty: qty,
 event_id: evId,
 event_title: eventTitle
 });
 
 if (result.success) {
 toast('Resource added!', 'ok');
 ['rn', 'rq'].forEach(rf);
 rf('rt');
 rf('rev');
 renderResList();
 } else {
 toast(result.message, 'er');
 }
}

async function renderResList() {
 showPage('res');
 fillDD();
 
 const resources = await apiGet('getResources');
 var tb = document.getElementById('res-tb');
 
 if (!resources.success || resources.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No resources added yet.</td></tr>';
 return;
 }
 
 tb.innerHTML = resources.data.map(function(r) {
 return '<tr><td>' + r.name + '</td><td>' + r.type + '</td><td>' + r.qty + '</td><td>' + r.event_title + '</td><td><button class="bsm bdel" onclick="deleteRes(\'' + r.res_id + '\')">Remove</button></td></tr>';
 }).join('');
}

async function deleteRes(res_id) {
 if (!confirm('Remove resource?')) return;
 
 const result = await apiCall('deleteResource', { res_id });
 
 if (result.success) {
 toast('Resource removed.', 'er');
 renderResList();
 }
}

async function reserveVen() {
 var name = gf('vnn'),
 evId = gf('vev2'),
 capacity = gf('vca'),
 date = gf('vda');
 
 if (!name || !evId || !capacity || !date) {
 toast('Please fill all venue fields.', 'er');
 return;
 }
 
 const evSelect = document.getElementById('vev2');
 const eventTitle = evSelect.options[evSelect.selectedIndex].getAttribute('data-title');
 
 const result = await apiCall('addVenue', {
 name: name,
 event_id: evId,
 event_title: eventTitle,
 capacity: capacity,
 date: date
 });
 
 if (result.success) {
 toast('Venue reserved!', 'ok');
 ['vnn', 'vca', 'vda'].forEach(rf);
 rf('vev2');
 renderVenList();
 } else {
 toast(result.message, 'er');
 }
}

async function renderVenList() {
 showPage('ven');
 fillDD();
 
 const venues = await apiGet('getVenues');
 var tb = document.getElementById('ven-tb');
 
 if (!venues.success || venues.data.length === 0) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No venue reservations yet.</td></tr>';
 return;
 }
 
 tb.innerHTML = venues.data.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.event_title + '</td><td>' + v.date + '</td><td>' + v.capacity + '</td><td><button class="bsm bdel" onclick="deleteVen(\'' + v.venue_id + '\')">Remove</button></td></tr>';
 }).join('');
}

async function deleteVen(venue_id) {
 if (!confirm('Remove venue reservation?')) return;
 
 const result = await apiCall('deleteVenue', { venue_id });
 
 if (result.success) {
 toast('Venue reservation removed.', 'er');
 renderVenList();
 }
}

function ptag(p) {
 var c = { normal: 'pt-n', important: 'pt-i', urgent: 'pt-u' };
 var l = { normal: 'Normal', important: ' Important', urgent: ' Urgent' };
 return '<span class="ptag ' + (c[p] || 'pt-n') + '">' + (l[p] || p) + '</span>';
}

async function renderAnn() {
 showPage('ann');
 document.getElementById('ann-nb').style.display = 'none';
 
 const result = await apiGet('getAnnouncements', { audience: 'faculty' });
 
 document.getElementById('ann-empty').style.display = (!result.success || result.data.length === 0) ? 'block' : 'none';
 
 if (!result.success || result.data.length === 0) {
 document.getElementById('ann-list').innerHTML = '';
 return;
 }
 
 document.getElementById('ann-list').innerHTML = result.data.map(function(a) {
 var d = new Date(a.posted_at);
 var ds = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
 var exp = a.expiry ? '<span style="color:var(--warning);font-size:11px;"> Expires ' + a.expiry + '</span>' : '';
 
 return '<div class="ann-card p-' + a.priority + '">' +
 '<div class="ann-title">' + a.title + '</div>' +
 '<div class="ann-meta"><span> ' + ds + '</span><span> ' + a.posted_by + '</span>' + exp + '</div>' +
 '<div class="ann-body">' + a.body.replace(/\n/g, '<br>') + '</div>' +
 '<div class="ann-foot">' + ptag(a.priority) + '</div>' +
 '</div>';
 }).join('');
}

var calDate = new Date();

async function renderCal() {
 showPage('cal');
 
 var yr = calDate.getFullYear(),
 mo = calDate.getMonth();
 document.getElementById('cal-lbl').textContent = calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
 
 var wdHtml = '';
 ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function(d) {
 wdHtml += '<div class="cdn">' + d + '</div>';
 });
 document.getElementById('cal-wd').innerHTML = wdHtml;
 
 const events = await apiGet('getEvents', { organizer: CU.username });
 const eventDates = {};
 if (events.success) {
 events.data.forEach(e => {
 eventDates[e.date] = true;
 });
 }
 
 var first = new Date(yr, mo, 1).getDay(),
 days = new Date(yr, mo + 1, 0).getDate(),
 prev = new Date(yr, mo, 0).getDate(),
 html = '';
 
 for (var i = first - 1; i >= 0; i--) html += '<div class="cd other">' + (prev - i) + '</div>';
 
 for (var d = 1; d <= days; d++) {
 var ds = yr + '-' + String(mo + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
 var hev = eventDates[ds];
 var isToday = new Date().toDateString() === new Date(yr, mo, d).toDateString();
 html += '<div class="cd' + (isToday ? ' today' : (hev ? ' hev' : '')) + '">' + d + '</div>';
 }
 
 var rem = 42 - (first + days);
 for (var x = 1; x <= rem; x++) html += '<div class="cd other">' + x + '</div>';
 
 document.getElementById('cal-days').innerHTML = html;
}

// Event listeners
window.onload = function() {
 document.getElementById('btn-login').onclick = doLogin;
 document.getElementById('pw').onkeydown = function(e) { if (e.key === 'Enter') doLogin(); };
 document.getElementById('un').onkeydown = function(e) { if (e.key === 'Enter') doLogin(); };
 document.getElementById('btn-logout').onclick = doLogout;
 document.getElementById('nav-dash').onclick = renderDash;
 document.getElementById('nav-events').onclick = renderEvList;
 document.getElementById('nav-regs').onclick = renderRegs;
 document.getElementById('nav-vols').onclick = renderVols;
 document.getElementById('nav-res').onclick = renderResList;
 document.getElementById('nav-ven').onclick = renderVenList;
 document.getElementById('nav-ann').onclick = renderAnn;
 document.getElementById('nav-cal').onclick = renderCal;
 document.getElementById('btn-create-ev').onclick = doCreateEvent;
 document.getElementById('btn-assign-vol').onclick = assignVol;
 document.getElementById('btn-add-res').onclick = addRes;
 document.getElementById('btn-reserve-ven').onclick = reserveVen;
 document.getElementById('cal-prev').onclick = function() { calDate.setMonth(calDate.getMonth() - 1); renderCal(); };
 document.getElementById('cal-next').onclick = function() { calDate.setMonth(calDate.getMonth() + 1); renderCal(); };
};
