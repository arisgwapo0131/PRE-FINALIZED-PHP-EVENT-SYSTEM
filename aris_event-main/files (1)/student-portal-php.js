// Student Portal - PHP Version
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

function isReg(event_id, myRegs) {
 return myRegs.some(function(r) { return r.event_id === event_id; });
}

function banCls(c) {
 return { Academic: 'ba', Sports: 'bs', Cultural: 'bc', Workshop: 'bw' }[c] || 'bg_';
}

function banIco(c) {
 return { Academic: '', Sports: '', Cultural: '', Workshop: '' }[c] || '';
}

function sBadge(s) {
 var m = { approved: 's-ap', pending: 's-pe', rejected: 's-re' };
 return '<span class="sbadge ' + (m[s] || 's-pe') + '">' + s + '</span>';
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

function eCard(ev, myRegs) {
 var reg = isReg(ev.event_id, myRegs);
 return '<div class="ecard"><div class="ebanner ' + banCls(ev.category) + '">' + banIco(ev.category) + '</div><div class="ebody"><div class="etitle">' + ev.title + ' ' + sBadge(ev.status) + '</div><div class="emeta"> ' + ev.date + ' &nbsp; ' + ev.time + '</div><div class="emeta"> ' + ev.location + '</div><div class="emeta"> ' + (ev.organizer_name || ev.organizer) + '</div><span class="cbadge">' + ev.category + '</span><button class="btn-reg"' + (reg ? ' disabled' : '') + ' onclick="doRegister(\'' + ev.event_id + '\')">' + (reg ? ' Registered' : 'Register Now') + '</button></div></div>';
}

async function checkAnnBadge() {
 const result = await apiGet('getAnnouncements', { audience: 'students' });
 var nb = document.getElementById('ann-nb');
 if (nb) nb.style.display = (result.success && result.data.length) ? 'inline' : 'none';
}

async function doLogin() {
 var u = document.getElementById('un').value.trim(),
 p = document.getElementById('pw').value.trim();
 var err = document.getElementById('lerr');
 err.textContent = '';
 
 if (!u || !p) {
 err.textContent = 'Please fill both fields.';
 return;
 }
 
 const result = await apiCall('login', { username: u, password: p, role: 'student' });
 
 if (result.success) {
 CU = result.data;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 populateFBDD();
 checkAnnBadge();
 renderDash();
 } else {
 err.textContent = result.message;
 }
}

async function doLogout() {
 window.location.href = 'logout.php';
}

async function renderDash() {
 showPage('dash');
 
 const stats = await apiGet('getDashboardStats');
 if (stats.success) {
 document.getElementById('s-ev').textContent = stats.data.total_events || 0;
 document.getElementById('s-reg').textContent = stats.data.my_registrations || 0;
 document.getElementById('s-ap').textContent = stats.data.approved_events || 0;
 }
 
 // Show announcement banner if any
 const anns = await apiGet('getAnnouncements', { audience: 'students' });
 var wrap = document.getElementById('ann-dash-wrap');
 
 if (anns.success && anns.data.length) {
 var urgent = anns.data.filter(function(a) { return a.priority === 'urgent'; }).length;
 var label = urgent ? ' ' + urgent + ' urgent announcement' + (urgent > 1 ? 's' : '') : ' ' + anns.data.length + ' announcement' + (anns.data.length > 1 ? 's' : '');
 wrap.innerHTML = '<div class="ann-banner" onclick="renderAnn()"><div class="ann-banner-icon"></div><div class="ann-banner-text"><h3>New Announcements</h3><p>' + label + ' from administration</p></div><div class="ann-count">' + anns.data.length + '</div></div>';
 } else {
 wrap.innerHTML = '';
 }
 
 const events = await apiGet('getEvents', { status: 'approved' });
 const myRegs = await apiGet('getRegistrations', { student_id: CU.username });
 
 var el = document.getElementById('feat-ev');
 
 if (!events.success || events.data.length === 0) {
 el.innerHTML = '<div class="emp">No approved events yet.</div>';
 return;
 }
 
 const featured = events.data.slice(0, 3);
 el.innerHTML = featured.map(e => eCard(e, myRegs.success ? myRegs.data : [])).join('');
}

async function renderBrowse() {
 showPage('browse');
 
 var term = document.getElementById('search').value.trim().toLowerCase();
 const events = await apiGet('getEvents', { status: 'approved' });
 const myRegs = await apiGet('getRegistrations', { student_id: CU.username });
 
 if (!events.success) {
 document.getElementById('browse-ev').innerHTML = '<div class="emp">No events available.</div>';
 return;
 }
 
 var filtered = events.data;
 if (term) {
 filtered = filtered.filter(function(e) {
 return (e.title + e.description).toLowerCase().indexOf(term) !== -1;
 });
 }
 
 document.getElementById('browse-ev').innerHTML = filtered.length ?
 filtered.map(e => eCard(e, myRegs.success ? myRegs.data : [])).join('') :
 '<div class="emp">No events match your search.</div>';
}

async function doRegister(event_id) {
 const myRegs = await apiGet('getRegistrations', { student_id: CU.username });
 
 if (myRegs.success && isReg(event_id, myRegs.data)) {
 toast('Already registered!', 'er');
 return;
 }
 
 const result = await apiCall('registerEvent', { event_id });
 
 if (result.success) {
 toast('Registered successfully!', 'ok');
 renderDash();
 renderBrowse();
 } else {
 toast(result.message, 'er');
 }
}

async function renderMine() {
 showPage('mine');
 
 const myRegs = await apiGet('getRegistrations', { student_id: CU.username });
 const events = await apiGet('getEvents');
 
 var el = document.getElementById('mine-cont');
 
 if (!myRegs.success || myRegs.data.length === 0) {
 el.innerHTML = '<div class="emp">You haven\'t registered for any events yet.</div>';
 return;
 }
 
 var html = '<div class="melist">';
 myRegs.data.forEach(function(r) {
 var ev = events.success ? events.data.find(function(e) { return e.event_id === r.event_id; }) : null;
 html += '<div class="merow"><div class="meinfo"><h4>' + r.event_title + ' ' + (ev ? sBadge(ev.status) : '') + '</h4><p> ' + r.event_date + ' &nbsp;|&nbsp; ' + (ev ? ev.location : '') + ' &nbsp;|&nbsp; Registered: ' + r.registered_at.split(' ')[0] + '</p></div><button class="btn-unreg" onclick="doUnreg(\'' + r.reg_id + '\')">Cancel</button></div>';
 });
 el.innerHTML = html + '</div>';
}

async function doUnreg(reg_id) {
 if (!confirm('Cancel this registration?')) return;
 
 const result = await apiCall('unregisterEvent', { reg_id });
 
 if (result.success) {
 toast('Registration cancelled.', 'er');
 renderMine();
 renderDash();
 } else {
 toast(result.message, 'er');
 }
}

async function populateFBDD() {
 const events = await apiGet('getEvents', { status: 'approved' });
 var sel = document.getElementById('fb-ev');
 sel.innerHTML = '<option value="">-- Choose an event --</option>';
 
 if (events.success) {
 events.data.forEach(function(e) {
 sel.innerHTML += '<option value="' + e.event_id + '">' + e.title + '</option>';
 });
 }
}

async function submitFB() {
 var evId = document.getElementById('fb-ev').value,
 rating = document.getElementById('fb-rt').value,
 text = document.getElementById('fb-txt').value.trim();
 
 if (!evId || !rating || !text) {
 toast('Please fill all feedback fields.', 'er');
 return;
 }
 
 const result = await apiCall('submitFeedback', { event_id: evId, rating: rating, text: text });
 
 if (result.success) {
 toast('Feedback submitted! Thank you.', 'ok');
 document.getElementById('fb-ev').selectedIndex = 0;
 document.getElementById('fb-rt').selectedIndex = 0;
 document.getElementById('fb-txt').value = '';
 } else {
 toast(result.message, 'er');
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
 
 const result = await apiGet('getAnnouncements', { audience: 'students' });
 
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
 
 const events = await apiGet('getEvents', { status: 'approved' });
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
 document.getElementById('pw').onkeydown = function(e) {
 if (e.key === 'Enter') doLogin();
 };
 document.getElementById('un').onkeydown = function(e) {
 if (e.key === 'Enter') doLogin();
 };
 document.getElementById('btn-logout').onclick = doLogout;
 document.getElementById('nav-dash').onclick = renderDash;
 document.getElementById('nav-browse').onclick = renderBrowse;
 document.getElementById('nav-cal').onclick = renderCal;
 document.getElementById('nav-mine').onclick = renderMine;
 document.getElementById('nav-ann').onclick = renderAnn;
 document.getElementById('nav-fb').onclick = function() {
 showPage('fb');
 populateFBDD();
 };
 document.getElementById('btn-fb').onclick = submitFB;
 document.getElementById('search').oninput = renderBrowse;
 document.getElementById('cal-prev').onclick = function() {
 calDate.setMonth(calDate.getMonth() - 1);
 renderCal();
 };
 document.getElementById('cal-next').onclick = function() {
 calDate.setMonth(calDate.getMonth() + 1);
 renderCal();
 };
};
