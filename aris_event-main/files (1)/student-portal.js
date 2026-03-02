var KEYS = {
 EV: 'eventhub_events',
 US: 'eventhub_users',
 RG: 'eventhub_registrations',
 FB: 'eventhub_feedback',
 AN: 'eventhub_announcements'
};

function ld(k) {
 try {
 var d = localStorage.getItem(k);
 return d ? JSON.parse(d) : [];
 } catch (e) {
 return [];
 }
}

function sd(k, a) {
 localStorage.setItem(k, JSON.stringify(a));
}

function seedData() {
 if (!localStorage.getItem(KEYS.EV)) sd(KEYS.EV, [{
 id: 'evt_001',
 title: 'Annual Tech Summit 2026',
 date: '2026-03-15',
 time: '09:00',
 location: 'Main Auditorium',
 description: 'A comprehensive summit on the latest technology trends.',
 organizer: 'faculty',
 organizerName: 'Dr. Jane Faculty',
 category: 'Academic',
 capacity: 500,
 status: 'approved',
 budget: 50000,
 createdAt: '2026-02-01'
 }, {
 id: 'evt_002',
 title: 'Campus Fun Run 5K',
 date: '2026-03-22',
 time: '06:00',
 location: 'Campus Grounds',
 description: 'Join us for a fun community run around campus.',
 organizer: 'faculty',
 organizerName: 'Dr. Jane Faculty',
 category: 'Sports',
 capacity: 200,
 status: 'approved',
 budget: 20000,
 createdAt: '2026-02-05'
 }, {
 id: 'evt_003',
 title: 'Cultural Night 2026',
 date: '2026-04-10',
 time: '18:00',
 location: 'University Theater',
 description: 'Celebrate diversity with student performances.',
 organizer: 'faculty',
 organizerName: 'Dr. Jane Faculty',
 category: 'Cultural',
 capacity: 300,
 status: 'approved',
 budget: 35000,
 createdAt: '2026-02-10'
 }]);
 if (!localStorage.getItem(KEYS.US)) sd(KEYS.US, [{
 username: 'student',
 password: '123',
 role: 'student',
 name: 'John Student',
 email: 'student@uni.edu',
 status: 'active'
 }, {
 username: 'student2',
 password: '123',
 role: 'student',
 name: 'Maria Santos',
 email: 'student2@uni.edu',
 status: 'active'
 }, {
 username: 'faculty',
 password: '123',
 role: 'faculty',
 name: 'Dr. Jane Faculty',
 email: 'faculty@uni.edu',
 status: 'active'
 }, {
 username: 'admin',
 password: '123',
 role: 'admin',
 name: 'Admin User',
 email: 'admin@uni.edu',
 status: 'active'
 }]);
 if (!localStorage.getItem(KEYS.RG)) sd(KEYS.RG, []);
 if (!localStorage.getItem(KEYS.FB)) sd(KEYS.FB, []);
 if (!localStorage.getItem(KEYS.AN)) sd(KEYS.AN, []);
}
var CU = null;

function myRegs() {
 return ld(KEYS.RG).filter(function(r) {
 return r.studentId === CU.username;
 });
}

function isReg(id) {
 return myRegs().some(function(r) {
 return r.eventId === id;
 });
}

function banCls(c) {
 return {
 Academic: 'ba',
 Sports: 'bs',
 Cultural: 'bc',
 Workshop: 'bw'
 } [c] || 'bg_';
}

function banIco(c) { return ''; } [c] || '';
}

function sBadge(s) {
 var m = {
 approved: 's-ap',
 pending: 's-pe',
 rejected: 's-re'
 };
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

function eCard(ev) {
 var reg = isReg(ev.id);
 return '<div class="ecard"><div class="ebanner ' + banCls(ev.category) + '">' + banIco(ev.category) + '</div><div class="ebody"><div class="etitle">' + ev.title + ' ' + sBadge(ev.status) + '</div><div class="emeta"> ' + ev.date + ' &nbsp; ' + ev.time + '</div><div class="emeta"> ' + ev.location + '</div><div class="emeta"> ' + (ev.organizerName || ev.organizer) + '</div><span class="cbadge">' + ev.category + '</span><button class="btn-reg"' + (reg ? ' disabled' : '') + ' onclick="doRegister(\'' + ev.id + '\')">' + (reg ? ' Registered' : 'Register Now') + '</button></div></div>';
}

function getVisibleAnns() {
 return ld(KEYS.AN).filter(function(a) {
 return a.audience === 'all' || a.audience === 'students';
 });
}

function checkAnnBadge() {
 var nb = document.getElementById('ann-nb');
 if (nb) nb.style.display = getVisibleAnns().length ? 'inline' : 'none';
}

function doLogin() {
 var u = document.getElementById('un').value.trim(),
 p = document.getElementById('pw').value.trim();
 var err = document.getElementById('lerr');
 err.textContent = '';
 if (!u || !p) {
 err.textContent = 'Please fill both fields.';
 return;
 }
 var found = null,
 users = ld(KEYS.US);
 for (var i = 0; i < users.length; i++) {
 if (users[i].username === u && users[i].password === p && users[i].role === 'student') {
 found = users[i];
 break;
 }
 }
 if (!found) {
 err.textContent = 'Invalid credentials or not a student account.';
 return;
 }
 CU = found;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 populateFBDD();
 checkAnnBadge();
 renderDash();
}

function doLogout() {
 CU = null;
 document.getElementById('login-screen').classList.remove('hidden');
 document.getElementById('app').classList.remove('active');
 document.getElementById('un').value = '';
 document.getElementById('pw').value = '';
 document.getElementById('lerr').textContent = '';
}

function renderDash() {
 showPage('dash');
 var evs = ld(KEYS.EV);
 document.getElementById('s-ev').textContent = evs.length;
 document.getElementById('s-reg').textContent = myRegs().length;
 document.getElementById('s-ap').textContent = evs.filter(function(e) {
 return e.status === 'approved';
 }).length;
 // Show announcement banner if any
 var anns = getVisibleAnns();
 var wrap = document.getElementById('ann-dash-wrap');
 if (anns.length) {
 var urgent = anns.filter(function(a) {
 return a.priority === 'urgent';
 }).length;
 var label = urgent ? ' ' + urgent + ' urgent announcement' + (urgent > 1 ? 's' : '') : ' ' + anns.length + ' announcement' + (anns.length > 1 ? 's' : '');
 wrap.innerHTML = '<div class="ann-banner" onclick="renderAnn()"><div class="ann-banner-icon"></div><div class="ann-banner-text"><h3>New Announcements</h3><p>' + label + ' from administration</p></div><div class="ann-count">' + anns.length + '</div></div>';
 } else {
 wrap.innerHTML = '';
 }
 var featured = evs.filter(function(e) {
 return e.status === 'approved';
 }).slice(0, 3);
 var el = document.getElementById('feat-ev');
 el.innerHTML = featured.length ? featured.map(eCard).join('') : '<div class="emp">No approved events yet.</div>';
}

function renderBrowse() {
 showPage('browse');
 var term = document.getElementById('search').value.trim().toLowerCase();
 var evs = ld(KEYS.EV);
 if (term) evs = evs.filter(function(e) {
 return (e.title + e.description).toLowerCase().indexOf(term) !== -1;
 });
 document.getElementById('browse-ev').innerHTML = evs.length ? evs.map(eCard).join('') : '<div class="emp">No events match your search.</div>';
}

function doRegister(evId) {
 if (isReg(evId)) {
 toast('Already registered!', 'er');
 return;
 }
 var ev = ld(KEYS.EV).find(function(e) {
 return e.id === evId;
 });
 if (!ev) {
 toast('Event not found.', 'er');
 return;
 }
 var regs = ld(KEYS.RG);
 regs.push({
 id: 'reg_' + Date.now(),
 studentId: CU.username,
 studentName: CU.name,
 eventId: evId,
 eventTitle: ev.title,
 eventDate: ev.date,
 registeredAt: new Date().toISOString()
 });
 sd(KEYS.RG, regs);
 toast('Registered for ' + ev.title, 'ok');
 renderDash();
 renderBrowse();
}

function renderMine() {
 showPage('mine');
 var regs = myRegs(),
 evs = ld(KEYS.EV),
 el = document.getElementById('mine-cont');
 if (!regs.length) {
 el.innerHTML = '<div class="emp">You haven\'t registered for any events yet.</div>';
 return;
 }
 var html = '<div class="melist">';
 regs.forEach(function(r) {
 var ev = evs.find(function(e) {
 return e.id === r.eventId;
 });
 html += '<div class="merow"><div class="meinfo"><h4>' + r.eventTitle + ' ' + (ev ? sBadge(ev.status) : '') + '</h4><p> ' + r.eventDate + ' &nbsp;|&nbsp; ' + (ev ? ev.location : '') + ' &nbsp;|&nbsp; Registered: ' + (r.registeredAt || '').split('T')[0] + '</p></div><button class="btn-unreg" onclick="doUnreg(\'' + r.id + '\')">Cancel</button></div>';
 });
 el.innerHTML = html + '</div>';
}

function doUnreg(regId) {
 if (!confirm('Cancel this registration?')) return;
 sd(KEYS.RG, ld(KEYS.RG).filter(function(r) {
 return r.id !== regId;
 }));
 toast('Registration cancelled.', 'er');
 renderMine();
 renderDash();
}

function populateFBDD() {
 var evs = ld(KEYS.EV),
 sel = document.getElementById('fb-ev');
 sel.innerHTML = '<option value="">-- Choose an event --</option>';
 evs.forEach(function(e) {
 sel.innerHTML += '<option value="' + e.id + '">' + e.title + '</option>';
 });
}

function submitFB() {
 var evId = document.getElementById('fb-ev').value,
 rating = document.getElementById('fb-rt').value,
 text = document.getElementById('fb-txt').value.trim();
 if (!evId || !rating || !text) {
 toast('Please fill all feedback fields.', 'er');
 return;
 }
 var fb = ld(KEYS.FB);
 fb.push({
 id: 'fb_' + Date.now(),
 studentId: CU.username,
 studentName: CU.name,
 eventId: evId,
 rating: parseInt(rating),
 text: text,
 date: new Date().toISOString().split('T')[0]
 });
 sd(KEYS.FB, fb);
 toast('Feedback submitted! Thank you.', 'ok');
 document.getElementById('fb-ev').selectedIndex = 0;
 document.getElementById('fb-rt').selectedIndex = 0;
 document.getElementById('fb-txt').value = '';
}

function ptag(p) {
 var c = {
 normal: 'pt-n',
 important: 'pt-i',
 urgent: 'pt-u'
 };
 var l = {
 normal: 'Normal',
 important: ' Important',
 urgent: ' Urgent'
 };
 return '<span class="ptag ' + (c[p] || 'pt-n') + '">' + (l[p] || p) + '</span>';
}

function renderAnn() {
 showPage('ann');
 document.getElementById('ann-nb').style.display = 'none';
 var anns = getVisibleAnns();
 document.getElementById('ann-empty').style.display = anns.length ? 'none' : 'block';
 document.getElementById('ann-list').innerHTML = anns.map(function(a) {
 var d = new Date(a.postedAt);
 var ds = d.toLocaleDateString('en-US', {
 month: 'short',
 day: 'numeric',
 year: 'numeric'
 }) + ' ' + d.toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit'
 });
 var exp = a.expiry ? '<span style="color:var(--warning);font-size:11px;"> Expires ' + a.expiry + '</span>' : '';
 return '<div class="ann-card p-' + a.priority + '">' +
 '<div class="ann-title">' + a.title + '</div>' +
 '<div class="ann-meta"><span> ' + ds + '</span><span> ' + a.postedBy + '</span>' + exp + '</div>' +
 '<div class="ann-body">' + a.body.replace(/\n/g, '<br>') + '</div>' +
 '<div class="ann-foot">' + ptag(a.priority) + '</div>' +
 '</div>';
 }).join('');
}
var calDate = new Date();

function renderCal() {
 showPage('cal');
 var yr = calDate.getFullYear(),
 mo = calDate.getMonth();
 document.getElementById('cal-lbl').textContent = calDate.toLocaleDateString('en-US', {
 month: 'long',
 year: 'numeric'
 });
 var wdHtml = '';
 ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function(d) {
 wdHtml += '<div class="cdn">' + d + '</div>';
 });
 document.getElementById('cal-wd').innerHTML = wdHtml;
 var evs = ld(KEYS.EV),
 first = new Date(yr, mo, 1).getDay(),
 days = new Date(yr, mo + 1, 0).getDate(),
 prev = new Date(yr, mo, 0).getDate(),
 html = '';
 for (var i = first - 1; i >= 0; i--) html += '<div class="cd other">' + (prev - i) + '</div>';
 for (var d = 1; d <= days; d++) {
 var ds = yr + '-' + String(mo + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
 var hev = evs.some(function(e) {
 return e.date === ds;
 });
 var isToday = new Date().toDateString() === new Date(yr, mo, d).toDateString();
 html += '<div class="cd' + (isToday ? ' today' : (hev ? ' hev' : '')) + '">' + d + '</div>';
 }
 var rem = 42 - (first + days);
 for (var x = 1; x <= rem; x++) html += '<div class="cd other">' + x + '</div>';
 document.getElementById('cal-days').innerHTML = html;
}
window.onload = function() {
 seedData();
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