var KEYS = {
 EV: 'eventhub_events',
 US: 'eventhub_users',
 RG: 'eventhub_registrations',
 VO: 'eventhub_volunteers',
 RS: 'eventhub_resources',
 VN: 'eventhub_venues',
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
 description: 'Technology summit.',
 organizer: 'faculty',
 organizerName: 'Dr. Jane Faculty',
 category: 'Academic',
 capacity: 500,
 status: 'pending',
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
 [KEYS.RG, KEYS.VO, KEYS.RS, KEYS.VN, KEYS.FB, KEYS.AN].forEach(function(k) {
 if (!localStorage.getItem(k)) sd(k, []);
 });
}
var CU = null,
 evFilter = 'all';

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

function roleBadge(r) {
 var m = {
 student: 'b-st',
 faculty: 'b-fa',
 admin: 'b-ad'
 };
 return '<span class="badge ' + (m[r] || 'b-ad') + '">' + r + '</span>';
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
 if (users[i].username === u && users[i].password === p && users[i].role === 'admin') {
 found = users[i];
 break;
 }
 }
 if (!found) {
 err.textContent = 'Invalid credentials or not an admin account.';
 return;
 }
 CU = found;
 document.getElementById('login-screen').classList.add('hidden');
 document.getElementById('app').classList.add('active');
 document.getElementById('uname').textContent = CU.name;
 renderDash();
}

function doLogout() {
 CU = null;
 document.getElementById('login-screen').classList.remove('hidden');
 document.getElementById('app').classList.remove('active');
 document.getElementById('un').value = '';
 document.getElementById('pw').value = '';
}

function renderDash() {
 showPage('dash');
 var evs = ld(KEYS.EV),
 users = ld(KEYS.US),
 regs = ld(KEYS.RG),
 pending = evs.filter(function(e) {
 return e.status === 'pending';
 });
 document.getElementById('d-us').textContent = users.length;
 document.getElementById('d-ev').textContent = evs.length;
 document.getElementById('d-rg').textContent = regs.length;
 document.getElementById('d-pe').textContent = pending.length;
 document.getElementById('d-an').textContent = ld(KEYS.AN).length;
 var tb = document.getElementById('pend-tb');
 if (!pending.length) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No pending events!</td></tr>';
 return;
 }
 tb.innerHTML = pending.map(function(e) {
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + (e.organizerName || e.organizer) + '</td><td>' + e.date + '</td><td>' + e.category + '</td><td><button class="bsm bap" onclick="setStatus(\'' + e.id + '\',\'approved\')"> Approve</button><button class="bsm brj" onclick="setStatus(\'' + e.id + '\',\'rejected\')"> Reject</button></td></tr>';
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

function renderEvents() {
 showPage('events');
 var evs = ld(KEYS.EV);
 if (evFilter !== 'all') evs = evs.filter(function(e) {
 return e.status === evFilter;
 });
 var tb = document.getElementById('ev-tb');
 if (!evs.length) {
 tb.innerHTML = '<tr><td colspan="7" class="emp">No events found.</td></tr>';
 return;
 }
 tb.innerHTML = evs.map(function(e) {
 var a = '';
 if (e.status === 'pending') a = '<button class="bsm bap" onclick="setStatus(\'' + e.id + '\',\'approved\')">Approve</button><button class="bsm brj" onclick="setStatus(\'' + e.id + '\',\'rejected\')">Reject</button>';
 else if (e.status === 'approved') a = '<button class="bsm brj" onclick="setStatus(\'' + e.id + '\',\'rejected\')">Revoke</button>';
 else a = '<button class="bsm bap" onclick="setStatus(\'' + e.id + '\',\'approved\')">Re-approve</button>';
 a += '<button class="bsm bdl" onclick="delEvent(\'' + e.id + '\')">Delete</button>';
 return '<tr><td><strong>' + e.title + '</strong></td><td>' + (e.organizerName || e.organizer) + '</td><td>' + e.date + '</td><td>' + e.category + '</td><td><span class="cnt">' + regCount(e.id) + '/' + e.capacity + '</span></td><td>' + mkBadge(e.status) + '</td><td>' + a + '</td></tr>';
 }).join('');
}

function setStatus(id, status) {
 var evs = ld(KEYS.EV),
 ev = evs.find(function(e) {
 return e.id === id;
 });
 if (!ev) return;
 ev.status = status;
 sd(KEYS.EV, evs);
 toast('"' + ev.title + '" ' + status + '.', status === 'approved' ? 'ok' : 'wn');
 renderDash();
 renderEvents();
}

function delEvent(id) {
 if (!confirm('Permanently delete this event?')) return;
 sd(KEYS.EV, ld(KEYS.EV).filter(function(e) {
 return e.id !== id;
 }));
 toast('Event deleted.', 'er');
 renderEvents();
 renderDash();
}

function renderRegs() {
 showPage('regs');
 var regs = ld(KEYS.RG),
 evs = ld(KEYS.EV),
 tb = document.getElementById('rg-tb');
 if (!regs.length) {
 tb.innerHTML = '<tr><td colspan="5" class="emp">No registrations yet.</td></tr>';
 return;
 }
 tb.innerHTML = regs.map(function(r) {
 var ev = evs.find(function(e) {
 return e.id === r.eventId;
 });
 return '<tr><td>' + r.studentName + '</td><td>' + r.eventTitle + '</td><td>' + r.eventDate + '</td><td>' + (ev ? ev.organizerName || ev.organizer : '') + '</td><td>' + (r.registeredAt || '').split('T')[0] + '</td></tr>';
 }).join('');
}

function renderUsers() {
 showPage('users');
 var users = ld(KEYS.US),
 tb = document.getElementById('us-tb');
 tb.innerHTML = users.length ? users.map(function(u) {
 return '<tr><td><strong>' + u.name + '</strong></td><td><code>' + u.username + '</code></td><td>' + u.email + '</td><td>' + roleBadge(u.role) + '</td><td><span class="badge b-ap">' + (u.status || 'active') + '</span></td></tr>';
 }).join('') : '<tr><td colspan="5" class="emp">No users.</td></tr>';
}

function renderRes() {
 showPage('res');
 var res = ld(KEYS.RS),
 vols = ld(KEYS.VO),
 ven = ld(KEYS.VN);
 document.getElementById('rs-tb').innerHTML = res.length ? res.map(function(r) {
 return '<tr><td>' + r.name + '</td><td>' + r.type + '</td><td>' + r.qty + '</td><td>' + r.eventTitle + '</td><td>' + r.addedBy + '</td><td><button class="bsm bdl" onclick="delRes(\'' + r.id + '\')">Delete</button></td></tr>';
 }).join('') : '<tr><td colspan="6" class="emp">No resources yet.</td></tr>';
 document.getElementById('vo-tb').innerHTML = vols.length ? vols.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.email + '</td><td>' + v.eventTitle + '</td><td>' + v.task + '</td><td><button class="bsm bdl" onclick="delVol(\'' + v.id + '\')">Delete</button></td></tr>';
 }).join('') : '<tr><td colspan="5" class="emp">No volunteers yet.</td></tr>';
 document.getElementById('vn-tb').innerHTML = ven.length ? ven.map(function(v) {
 return '<tr><td>' + v.name + '</td><td>' + v.eventTitle + '</td><td>' + v.date + '</td><td>' + v.capacity + '</td><td>' + v.reservedBy + '</td><td><button class="bsm bdl" onclick="delVen(\'' + v.id + '\')">Delete</button></td></tr>';
 }).join('') : '<tr><td colspan="6" class="emp">No venue reservations yet.</td></tr>';
}

function delRes(id) {
 if (!confirm('Delete?')) return;
 sd(KEYS.RS, ld(KEYS.RS).filter(function(r) {
 return r.id !== id;
 }));
 toast('Deleted.', 'er');
 renderRes();
}

function delVol(id) {
 if (!confirm('Delete?')) return;
 sd(KEYS.VO, ld(KEYS.VO).filter(function(v) {
 return v.id !== id;
 }));
 toast('Deleted.', 'er');
 renderRes();
}

function delVen(id) {
 if (!confirm('Delete?')) return;
 sd(KEYS.VN, ld(KEYS.VN).filter(function(v) {
 return v.id !== id;
 }));
 toast('Deleted.', 'er');
 renderRes();
}
// ANNOUNCEMENTS
function postAnn() {
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
 var anns = ld(KEYS.AN);
 anns.unshift({
 id: 'ann_' + Date.now(),
 title: title,
 priority: priority,
 audience: audience,
 expiry: expiry || null,
 body: body,
 postedBy: CU.name,
 postedAt: new Date().toISOString()
 });
 sd(KEYS.AN, anns);
 toast('Announcement posted!', 'ok');
 document.getElementById('ann-title').value = '';
 document.getElementById('ann-body').value = '';
 document.getElementById('ann-expiry').value = '';
 document.getElementById('ann-priority').selectedIndex = 0;
 document.getElementById('ann-audience').selectedIndex = 0;
 renderAnn();
 renderDash();
}

function deleteAnn(id) {
 if (!confirm('Delete this announcement?')) return;
 sd(KEYS.AN, ld(KEYS.AN).filter(function(a) {
 return a.id !== id;
 }));
 toast('Announcement deleted.', 'er');
 renderAnn();
 renderDash();
}

function audLabel(a) {
 return {
 all: 'Everyone',
 students: 'Students Only',
 faculty: 'Faculty Only'
 } [a] || a;
}

function ptag(p) {
 var c = {
 normal: 'pt-n',
 important: 'pt-i',
 urgent: 'pt-u'
 };
 var l = {
 normal: 'Normal',
 important: 'Important',
 urgent: ' Urgent'
 };
 return '<span class="ptag ' + (c[p] || 'pt-n') + '">' + (l[p] || p) + '</span>';
}

function renderAnn() {
 showPage('ann');
 var anns = ld(KEYS.AN);
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
 '<div class="ann-hdr"><div class="ann-title">' + a.title + '</div>' +
 '<button class="bsm brj" onclick="deleteAnn(\'' + a.id + '\')"> Delete</button></div>' +
 '<div class="ann-meta"><span> ' + ds + '</span><span> ' + a.postedBy + '</span>' + exp + '</div>' +
 '<div class="ann-body">' + a.body.replace(/\n/g, '<br>') + '</div>' +
 '<div class="ann-foot">' + ptag(a.priority) + '<span class="atag"> ' + audLabel(a.audience) + '</span></div>' +
 '</div>';
 }).join('');
}

function renderReports() {
 showPage('reports');
 var evs = ld(KEYS.EV),
 users = ld(KEYS.US),
 fb = ld(KEYS.FB);

 function ri(l, v) {
 return '<div class="ri"><span>' + l + '</span><span class="rv">' + v + '</span></div>';
 }
 document.getElementById('rp-status').innerHTML = ['pending', 'approved', 'rejected'].map(function(s) {
 return ri(s.charAt(0).toUpperCase() + s.slice(1), evs.filter(function(e) {
 return e.status === s;
 }).length);
 }).join('');
 var cats = {};
 evs.forEach(function(e) {
 cats[e.category] = (cats[e.category] || 0) + 1;
 });
 document.getElementById('rp-cat').innerHTML = Object.keys(cats).length ? Object.entries(cats).map(function(a) {
 return ri(a[0], a[1]);
 }).join('') : '<div class="ri" style="color:var(--muted)">No events yet.</div>';
 var sorted = evs.map(function(e) {
 return {
 title: e.title,
 cnt: regCount(e.id)
 };
 }).sort(function(a, b) {
 return b.cnt - a.cnt;
 }).slice(0, 5);
 document.getElementById('rp-top').innerHTML = sorted.map(function(e) {
 return ri(e.title.length > 22 ? e.title.slice(0, 22) + '' : e.title, e.cnt);
 }).join('') || '<div class="ri" style="color:var(--muted)">No registrations yet.</div>';
 document.getElementById('rp-users').innerHTML = ['student', 'faculty', 'admin'].map(function(r) {
 return ri(r.charAt(0).toUpperCase() + r.slice(1), users.filter(function(u) {
 return u.role === r;
 }).length);
 }).join('');
 var orgMap = {};
 evs.forEach(function(e) {
 var k = e.organizerName || e.organizer;
 orgMap[k] = (orgMap[k] || 0) + 1;
 });
 document.getElementById('rp-org').innerHTML = Object.keys(orgMap).length ? Object.entries(orgMap).sort(function(a, b) {
 return b[1] - a[1];
 }).map(function(a) {
 return ri(a[0], a[1] + ' event' + (a[1] !== 1 ? 's' : ''));
 }).join('') : '<div class="ri" style="color:var(--muted)">No events yet.</div>';
 var recent = fb.slice(-5).reverse();
 document.getElementById('rp-fb').innerHTML = recent.length ? recent.map(function(f) {
 var ev = evs.find(function(e) {
 return e.id === f.eventId;
 });
 return ri((ev ? ev.title : '') + ' ' + ''.repeat(f.rating || 0), f.date || '');
 }).join('') : '<div class="ri" style="color:var(--muted)">No feedback yet.</div>';
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
 document.getElementById('nav-events').onclick = renderEvents;
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
 document.getElementById('fa-all').onclick = function() {
 setFilter('all');
 };
 document.getElementById('fa-pending').onclick = function() {
 setFilter('pending');
 };
 document.getElementById('fa-approved').onclick = function() {
 setFilter('approved');
 };
 document.getElementById('fa-rejected').onclick = function() {
 setFilter('rejected');
 };
 document.getElementById('btn-post-ann').onclick = postAnn;
};