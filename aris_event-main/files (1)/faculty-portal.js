var KEYS = {
 EV: 'eventhub_events',
 US: 'eventhub_users',
 RG: 'eventhub_registrations',
 VO: 'eventhub_volunteers',
 RS: 'eventhub_resources',
 VN: 'eventhub_venues',
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
 description: 'Technology summit.',
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
 description: 'Community run.',
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
 description: 'Cultural performances.',
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
 [KEYS.RG, KEYS.VO, KEYS.RS, KEYS.VN, KEYS.AN].forEach(function(k) {
 if (!localStorage.getItem(k)) sd(k, []);
 });
}
var CU = null;

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

function myEvs() {
 return ld(KEYS.EV).filter(function(e) {
 return e.organizer === CU.username;
 });
}

function regCount(id) {
 return ld(KEYS.RG).filter(function(r) {
 return r.eventId === id;
 }).length;
}

function mkBadge(s) {
 var m = {
 approved: 'b-ap',
 pending: 'b-pe',
 rejected: 'b-re'
 };
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

function fillDD() {
 var evs = myEvs();
 var html = '<option value="">-- Select event --</option>';
 evs.forEach(function(e) {
 html += '<option value="' + e.id + '">' + e.title + '</option>';
 });
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

function doLogin() {
 var u = gf('un'),
 p = gf('pw');
 var err = document.getElementById('lerr');
 err.textContent = '';
 if (!u || !p) {
 err.textContent = 'Please fill both fields.';
 return;
 }
 var found = null,
 users = ld(KEYS.US);
 for (var i = 0; i < users.length; i++) {
 if (users[i].username === u && users[i].password === p && users[i].role === 'faculty') {
 found = users[i];
 break;
 }
 }
 if (!found) {
 err.textContent = 'Invalid credentials or not a faculty account.';
 return;
 }
 CU = found;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 fillDD();
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

function checkAnnBadge() {
 var anns = getVisibleAnns();
 var nb = document.getElementById('ann-nb');
 if (nb) nb.style.display = anns.length ? 'inline' : 'none';
}

function getVisibleAnns() {
 var anns = ld(KEYS.AN);
 return anns.filter(function(a) {
 return a.audience === 'all' || a.audience === 'faculty';
 });
}

function renderDash() {
 showPage('dash');
 var evs = myEvs(),
 myIds = evs.map(function(e) {
 return e.id;
 }),
 regs = ld(KEYS.RG).filter(function(r) {
 return myIds.indexOf(r.eventId) !== -1;
 });
 document.getElementById('f-tot').textContent = evs.length;
 document.getElementById('f-app').textContent = evs.filter(function(e) {
 return e.status === 'approved';
 }).length;
 document.getElementById('f-pen').textContent = evs.filter(function(e) {
 return e.status === 'pending';
 }).length;
 document.getElementById('f-reg').textContent = regs.length;
 document.getElementById('f-ann').textContent = getVisibleAnns().length;
 var tb = document.getElementById('dash-tb');
 if (!evs.length) {
 tb.innerHTML = '<tr><td colspan="4" class="emp">No events yet.</td></tr>';
 return;
 }
 tb.innerHTML = evs.slice(0, 6).map(function(e) {
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + e.date + '</td><td>' + mkBadge(e.status) + '</td><td><span class="rc">' + regCount(e.id) + '/' + e.capacity + '</span></td></tr>';
 }).join('');
}

function doCreateEvent() {
 var title = gf('ev-title'),
 category = gf('ev-cat'),
 date = gf('ev-date'),
 time = gf('ev-time'),
 location = gf('ev-loc'),
 capacity = gf('ev-cap');
 if (!title) {
 toast('Event title is required.', 'er');
 return;
 }
 if (!category) {
 toast('Please select a category.', 'er');
 return;
 }
 if (!date) {
 toast('Please select a date.', 'er');
 return;
 }
 if (!time) {
 toast('Please select a time.', 'er');
 return;
 }
 if (!location) {
 toast('Location is required.', 'er');
 return;
 }
 if (!capacity || parseInt(capacity) < 1) {
 toast('Please enter a valid capacity.', 'er');
 return;
 }
 var newEv = {
 id: 'evt_' + Date.now(),
 title: title,
 category: category,
 date: date,
 time: time,
 location: location,
 capacity: parseInt(capacity),
 budget: parseInt(gf('ev-bud')) || 0,
 description: document.getElementById('ev-desc').value.trim(),
 organizer: CU.username,
 organizerName: CU.name,
 status: 'pending',
 createdAt: new Date().toISOString().split('T')[0]
 };
 var all = ld(KEYS.EV);
 all.push(newEv);
 sd(KEYS.EV, all);
 toast('Event created! Pending admin approval.', 'ok');
 ['ev-title', 'ev-date', 'ev-time', 'ev-loc', 'ev-cap', 'ev-bud', 'ev-desc'].forEach(rf);
 rf('ev-cat');
 renderEvList();
 fillDD();
 renderDash();
 showPage('events');
}

function renderEvList() {
 showPage('events');
 fillDD();
 var evs = myEvs(),
 tb = document.getElementById('ev-tb');
 if (!evs.length) {
 tb.innerHTML = '<tr><td colspan="7" class="emp">No events yet.</td></tr>';
 return;
 }
 tb.innerHTML = evs.map(function(e) {
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + e.date + '</td><td>' + e.location + '</td><td>' + e.category + '</td><td>' + mkBadge(e.status) + '</td><td><span class="rc">' + regCount(e.id) + '/' + e.capacity + '</span></td><td><button class="bsm bdel" onclick="deleteEvent(\'' + e.id + '\')">Delete</button></td></tr>';
 }).join('');
}

function deleteEvent(id) {
 if (!confirm('Delete this event?')) return;
 sd(KEYS.EV, ld(KEYS.EV).filter(function(e) {
 return e.id !== id;
 }));
 toast('Event deleted.', 'er');
 renderEvList();
 fillDD();
 renderDash();
 showPage('events');
}

function renderRegs() {
 showPage('regs');
 var myIds = myEvs().map(function(e) {
 return e.id;
 }),
 regs = ld(KEYS.RG).filter(function(r) {
 return myIds.indexOf(r.eventId) !== -1;
 }),
 tb = document.getElementById('regs-tb');
 if (!regs.length) {
 tb.innerHTML = '<tr><td colspan="4" class="emp">No student registrations yet.</td></tr>';
 return;
 }
 tb.innerHTML = regs.map(function(r) {
 return '<tr><td>' + r.studentName + '</td><td>' + r.eventTitle + '</td><td>' + r.eventDate + '</td><td>' + (r.registeredAt || '').split('T')[0] + '</td></tr>';
 }).join('');
}

function assignVol() {
 var name = gf('vn'),
 email = gf('ve'),
 evId = gf('vev'),
 task = gf('vt');
 if (!name || !email || !evId || !task) {
 toast('Please fill all volunteer fields.', 'er');
 return;
 }
 var ev = ld(KEYS.EV).find(function(e) {
 return e.id === evId;
 });
 var vols = ld(KEYS.VO);
 vols.push({
 id: 'vol_' + Date.now(),
 name: name,
 email: email,
 eventId: evId,
 eventTitle: ev ? ev.title : evId,
 task: task,
 assignedBy: CU.username
 });
 sd(KEYS.VO, vols);
 toast('Volunteer assigned!', 'ok');
 ['vn', 've', 'vt'].forEach(rf);
 rf('vev');
 renderVols();
}

function renderVols() {
 showPage('vols');
 fillDD();
 var myIds = myEvs().map(function(e) {
 return e.id;
 }),
 vols = ld(KEYS.VO).filter(function(v) {
 return myIds.indexOf(v.eventId) !== -1;
 }),
 tb = document.getElementById('vol-tb');
 if (!vols.length) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No volunteers assigned yet.</td></tr>';
 return;
 }
 tb.innerHTML = vols.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.email + '</td><td>' + v.eventTitle + '</td><td>' + v.task + '</td><td><button class="bsm bdel" onclick="deleteVol(\'' + v.id + '\')">Remove</button></td></tr>';
 }).join('');
}

function deleteVol(id) {
 if (!confirm('Remove volunteer?')) return;
 sd(KEYS.VO, ld(KEYS.VO).filter(function(v) {
 return v.id !== id;
 }));
 toast('Volunteer removed.', 'er');
 renderVols();
}

function addRes() {
 var name = gf('rn'),
 type = gf('rt'),
 qty = gf('rq'),
 evId = gf('rev');
 if (!name || !type || !qty || !evId) {
 toast('Please fill all resource fields.', 'er');
 return;
 }
 var ev = ld(KEYS.EV).find(function(e) {
 return e.id === evId;
 });
 var res = ld(KEYS.RS);
 res.push({
 id: 'res_' + Date.now(),
 name: name,
 type: type,
 qty: parseInt(qty),
 eventId: evId,
 eventTitle: ev ? ev.title : evId,
 addedBy: CU.username
 });
 sd(KEYS.RS, res);
 toast('Resource added!', 'ok');
 ['rn', 'rq'].forEach(rf);
 rf('rt');
 rf('rev');
 renderResList();
}

function renderResList() {
 showPage('res');
 fillDD();
 var myIds = myEvs().map(function(e) {
 return e.id;
 }),
 res = ld(KEYS.RS).filter(function(r) {
 return myIds.indexOf(r.eventId) !== -1;
 }),
 tb = document.getElementById('res-tb');
 if (!res.length) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No resources added yet.</td></tr>';
 return;
 }
 tb.innerHTML = res.map(function(r) {
 return '<tr><td>' + r.name + '</td><td>' + r.type + '</td><td>' + r.qty + '</td><td>' + r.eventTitle + '</td><td><button class="bsm bdel" onclick="deleteRes(\'' + r.id + '\')">Remove</button></td></tr>';
 }).join('');
}

function deleteRes(id) {
 if (!confirm('Remove resource?')) return;
 sd(KEYS.RS, ld(KEYS.RS).filter(function(r) {
 return r.id !== id;
 }));
 toast('Resource removed.', 'er');
 renderResList();
}

function reserveVen() {
 var name = gf('vnn'),
 evId = gf('vev2'),
 cap = gf('vca'),
 date = gf('vda');
 if (!name || !evId || !cap || !date) {
 toast('Please fill all venue fields.', 'er');
 return;
 }
 var ev = ld(KEYS.EV).find(function(e) {
 return e.id === evId;
 });
 var ven = ld(KEYS.VN);
 ven.push({
 id: 'ven_' + Date.now(),
 name: name,
 eventId: evId,
 eventTitle: ev ? ev.title : evId,
 capacity: parseInt(cap),
 date: date,
 reservedBy: CU.username
 });
 sd(KEYS.VN, ven);
 toast('Venue reserved!', 'ok');
 ['vnn', 'vca', 'vda'].forEach(rf);
 rf('vev2');
 renderVenList();
}

function renderVenList() {
 showPage('ven');
 fillDD();
 var myIds = myEvs().map(function(e) {
 return e.id;
 }),
 ven = ld(KEYS.VN).filter(function(v) {
 return myIds.indexOf(v.eventId) !== -1;
 }),
 tb = document.getElementById('ven-tb');
 if (!ven.length) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No venues reserved yet.</td></tr>';
 return;
 }
 tb.innerHTML = ven.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.eventTitle + '</td><td>' + v.date + '</td><td>' + v.capacity + '</td><td><button class="bsm bdel" onclick="deleteVen(\'' + v.id + '\')">Cancel</button></td></tr>';
 }).join('');
}

function deleteVen(id) {
 if (!confirm('Cancel reservation?')) return;
 sd(KEYS.VN, ld(KEYS.VN).filter(function(v) {
 return v.id !== id;
 }));
 toast('Reservation cancelled.', 'er');
 renderVenList();
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
 var list = document.getElementById('ann-list');
 document.getElementById('ann-empty').style.display = anns.length ? 'none' : 'block';
 list.innerHTML = anns.map(function(a) {
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
 '<div class="ann-hdr"><div class="ann-title">' + a.title + '</div></div>' +
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
 var evs = myEvs(),
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
 document.getElementById('cal-prev').onclick = function() {
 calDate.setMonth(calDate.getMonth() - 1);
 renderCal();
 };
 document.getElementById('cal-next').onclick = function() {
 calDate.setMonth(calDate.getMonth() + 1);
 renderCal();
 };
};