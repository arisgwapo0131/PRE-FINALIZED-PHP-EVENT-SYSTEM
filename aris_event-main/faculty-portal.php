<?php
require_once 'config.php';

// Require faculty role
requireRole('faculty');
?>

<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Event Management System Faculty</title>
 <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
 <link rel="stylesheet" href="files (1)/faculty-portal.css">
</head>

<body>
 <div id="login-screen">
 <div class="lcard">
 <div class="llogo">Event Management System</div>
 <div class="lbadge">Faculty</div>
 <h2>Faculty Sign In</h2>
 <p class="lsub">Manage events, volunteers, resources and venues.</p>
 <div class="lerr" id="lerr"></div>
 <div class="lfield"><label>Username</label><input type="text" id="un" placeholder="e.g. faculty" autocomplete="off"></div>
 <div class="lfield"><label>Password</label><input type="password" id="pw" placeholder="Password"></div>
 <button class="btn-login" id="btn-login">Sign In</button>
 <div class="lhint"><strong>Demo:</strong> faculty / 123</div>
 </div>
 </div>
 <div id="app">
 <aside class="sb">
 <div class="sb-head">
 <div class="sb-logo">Event Management System</div>
 <div class="sb-tag">Faculty</div>
 </div>
 <nav class="sb-nav">
 <div class="nl">Menu</div>
 <a class="ni active" id="nav-dash">Dashboard</a>
 <a class="ni" id="nav-events">Manage Events</a>
 <a class="ni" id="nav-regs">Registrations</a>
 <a class="ni" id="nav-vols">Volunteers</a>
 <a class="ni" id="nav-res">Resources</a>
 <a class="ni" id="nav-ven">Venues</a>
 <a class="ni" id="nav-ann">Announcements <span id="ann-nb" style="display:none;" class="new-badge">NEW</span></a>
 <a class="ni" id="nav-cal">Calendar</a>
 <div class="nl" style="margin-top:18px;">Other Portals</div>
 <a class="ni" href="student-portal.php">Student Portal</a>
 <a class="ni" href="admin-portal.php">Admin Portal</a>
 </nav>
 <div class="sb-foot">
 <div class="uc">
 <div class="uav">F</div>
 <div>
 <div class="uname-d" id="uname"><?php echo htmlspecialchars($_SESSION['name']); ?></div>
 <div class="urole-d">Faculty</div>
 </div>
 </div>
 <button class="btn-lo" id="btn-logout">Sign Out</button>
 </div>
requireRole('faculty');
?>

<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Event Management System Faculty</title>
 <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
 <link rel="stylesheet" href="files (1)/faculty-portal.css">
</head>

<body>
 <div id="login-screen">
 <div class="lcard">
 <div class="llogo">Event Management System</div>
 <div class="lbadge">Faculty</div>
 <h2>Faculty Sign In</h2>
 <p class="lsub">Manage events, volunteers, resources and venues.</p>
 <div class="lerr" id="lerr"></div>
 <div class="lfield"><label>Username</label><input type="text" id="un" placeholder="e.g. faculty" autocomplete="off"></div>
 <div class="lfield"><label>Password</label><input type="password" id="pw" placeholder="Password"></div>
 <button class="btn-login" id="btn-login">Sign In</button>
 <div class="lhint"><strong>Demo:</strong> faculty / 123</div>
 </div>
 </div>
 <div id="app">
 <aside class="sb">
 <div class="sb-head">
 <div class="sb-logo">Event Management System</div>
 <div class="sb-tag">Faculty</div>
 </div>
 <nav class="sb-nav">
 <div class="nl">Menu</div>
 <a class="ni active" id="nav-dash">Dashboard</a>
 <a class="ni" id="nav-events">Manage Events</a>
 <a class="ni" id="nav-regs">Registrations</a>
 <a class="ni" id="nav-vols">Volunteers</a>
 <a class="ni" id="nav-res">Resources</a>
 <a class="ni" id="nav-ven">Venues</a>
 <a class="ni" id="nav-ann">Announcements <span id="ann-nb" style="display:none;" class="new-badge">NEW</span></a>
 <a class="ni" id="nav-cal">Calendar</a>
 <div class="nl" style="margin-top:18px;">Other Portals</div>
 <a class="ni" href="student-portal.php">Student Portal</a>
 <a class="ni" href="admin-portal.php">Admin Portal</a>
 </nav>
 <div class="sb-foot">
 <div class="uc">
 <div class="uav">U</div>
 <div>
 <div class="uname-d" id="uname"></div>
 <div class="urole-d">Faculty</div>
 </div>
 </div>
 <button class="btn-lo" id="btn-logout">Sign Out</button>
 </div>
 </aside>
 <main class="main">
 <div class="pg active" id="pg-dash">
 <div class="ph">
 <h1>Faculty Dashboard</h1>
 <p>Overview of your events and activities</p>
 </div>
 <div class="srow">
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-tot">0</div>
 <div class="sl">My Events</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-app">0</div>
 <div class="sl">Approved</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-pen">0</div>
 <div class="sl">Pending</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-reg">0</div>
 <div class="sl">Registrations</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-ann">0</div>
 <div class="sl">Announcements</div>
 </div>
 </div>
 <p style="font-size:14px;font-weight:600;margin-bottom:12px;">My Recent Events</p>
 <div class="tw">
 <table>
 <thead>
 <tr>
 <th>Event</th>
 <th>Date</th>
 <th>Status</th>
 <th>Registrations</th>
 </tr>
 </thead>
 <tbody id="dash-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-events">
 <div class="ph">
 <h1>Manage Events</h1>
 <p>Create and manage your campus events</p>
 </div>
 <div class="fc">
 <h3> Create New Event</h3>
 <div class="arow">
 <div class="afg"><label>Event Title *</label><input type="text" id="ev-title" placeholder="e.g. Tech Summit 2026"></div>
 <div class="afg"><label>Category *</label><select id="ev-cat">
 <option value="">-- Select Category --</option>
 <option value="Academic">Academic</option>
 <option value="Sports">Sports</option>
 <option value="Cultural">Cultural</option>
 <option value="Workshop">Workshop</option>
 <option value="General">General</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Date *</label><input type="date" id="ev-date"></div>
 <div class="afg"><label>Time *</label><input type="time" id="ev-time"></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Location *</label><input type="text" id="ev-loc" placeholder="e.g. Main Auditorium"></div>
 <div class="afg"><label>Capacity *</label><input type="number" id="ev-cap" min="1" placeholder="e.g. 200"></div>
 </div>
 <div class="afb"><label>Budget ()</label><input type="number" id="ev-bud" min="0" placeholder="0"></div>
 <div class="afb"><label>Description</label><textarea id="ev-desc" rows="3" placeholder="Describe your event"></textarea></div>
 <button class="btn-submit" id="btn-create-ev">Create Event</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Your Events</div>
 <table>
 <thead>
 <tr>
 <th>Title</th>
 <th>Date</th>
 <th>Location</th>
 <th>Category</th>
 <th>Status</th>
 <th>Registrations</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="ev-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-regs">
 <div class="ph">
 <h1>Student Registrations</h1>
 <p>Students who signed up for your events</p>
 </div>
 <div class="tw">
 <table>
 <thead>
 <tr>
 <th>Student</th>
 <th>Event</th>
 <th>Event Date</th>
 <th>Registered On</th>
 </tr>
 </thead>
 <tbody id="regs-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-vols">
 <div class="ph">
 <h1>Volunteer Management</h1>
 <p>Assign volunteers to your events</p>
 </div>
 <div class="fc">
 <h3>Assign Volunteer</h3>
 <div class="arow">
 <div class="afg"><label>Full Name *</label><input type="text" id="vn" placeholder="Full name"></div>
 <div class="afg"><label>Email *</label><input type="email" id="ve" placeholder="email@example.com"></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Event *</label><select id="vev">
 <option value="">-- Select event --</option>
 </select></div>
 <div class="afg"><label>Task *</label><input type="text" id="vt" placeholder="e.g. Registration Desk"></div>
 </div>
 <button class="btn-submit" id="btn-assign-vol">Assign Volunteer</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Assigned Volunteers</div>
 <table>
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Event</th>
 <th>Task</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="vol-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-res">
 <div class="ph">
 <h1>Resources</h1>
 <p>Track equipment and supplies for your events</p>
 </div>
 <div class="fc">
 <h3>Add Resource</h3>
 <div class="arow">
 <div class="afg"><label>Resource Name *</label><input type="text" id="rn" placeholder="e.g. Projector"></div>
 <div class="afg"><label>Type *</label><select id="rt">
 <option value="">-- Select Type --</option>
 <option value="Equipment">Equipment</option>
 <option value="Supplies">Supplies</option>
 <option value="Furniture">Furniture</option>
 <option value="AV/Tech">AV/Tech</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Quantity *</label><input type="number" id="rq" min="1" placeholder="1"></div>
 <div class="afg"><label>Event *</label><select id="rev">
 <option value="">-- Select event --</option>
 </select></div>
 </div>
 <button class="btn-submit" id="btn-add-res">Add Resource</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Resources List</div>
 <table>
 <thead>
 <tr>
 <th>Name</th>
 <th>Type</th>
 <th>Qty</th>
 <th>Event</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="res-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-ven">
 <div class="ph">
 <h1>Venue Reservations</h1>
 <p>Reserve venues for your events</p>
 </div>
 <div class="fc">
 <h3>Reserve Venue</h3>
 <div class="arow">
 <div class="afg"><label>Venue Name *</label><input type="text" id="vnn" placeholder="e.g. Main Hall"></div>
 <div class="afg"><label>Event *</label><select id="vev2">
 <option value="">-- Select event --</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Capacity *</label><input type="number" id="vca" min="1" placeholder="200"></div>
 <div class="afg"><label>Date *</label><input type="date" id="vda"></div>
 </div>
 <button class="btn-submit" id="btn-reserve-ven">Reserve Venue</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Reservations</div>
 <table>
 <thead>
 <tr>
 <th>Venue</th>
 <th>Event</th>
 <th>Date</th>
 <th>Capacity</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="ven-tb"></tbody>
 </table>
 </div>
 </div>
 <!-- ANNOUNCEMENTS PAGE (READ-ONLY) -->
 <div class="pg" id="pg-ann">
 <div class="ph">
 <h1> Announcements</h1>
 <p>System announcements from the administration</p>
 </div>
 <div id="ann-empty" class="emp" style="display:none;">No announcements at this time.</div>
 <div class="ann-list" id="ann-list"></div>
 </div>
 <div class="pg" id="pg-cal">
 <div class="ph">
 <h1>Event Calendar</h1>
 <p>Your events in calendar view</p>
 </div>
 <div class="cw">
 <div class="cn"><button class="cb" id="cal-prev"> Prev</button>
 <h3 id="cal-lbl"></h3><button class="cb" id="cal-next">Next </button>
 </div>
 <div class="cgrid" id="cal-wd"></div>
 <div class="cgrid" id="cal-days"></div>
 </div>
 </div>
 </main>
 </div>
 <div class="toast" id="toast"></div>
 <script src="files (1)/faculty-portal-php.js"></script>
</body>

</html>SESSION['name']); ?></div>
 <div class="urole-d">Faculty</div>
 </div>
 </div>
 <button class="btn-lo" id="btn-logout">Sign Out</button>
 </div>
 </aside>
 <main class="main">
 <div class="pg active" id="pg-dash">
 <div class="ph">
 <h1>Faculty Dashboard</h1>
 <p>Overview of your events and activities</p>
 </div>
 <div class="srow">
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-tot">0</div>
 <div class="sl">My Events</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-app">0</div>
 <div class="sl">Approved</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-pen">0</div>
 <div class="sl">Pending</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-reg">0</div>
 <div class="sl">Registrations</div>
 </div>
 <div class="sbox">
 <div class="si"></div>
 <div class="sv" id="f-ann">0</div>
 <div class="sl">Announcements</div>
 </div>
 </div>
 <p style="font-size:14px;font-weight:600;margin-bottom:12px;">My Recent Events</p>
 <div class="tw">
 <table>
 <thead>
 <tr>
 <th>Event</th>
 <th>Date</th>
 <th>Status</th>
 <th>Registrations</th>
 </tr>
 </thead>
 <tbody id="dash-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-events">
 <div class="ph">
 <h1>Manage Events</h1>
 <p>Create and manage your campus events</p>
 </div>
 <div class="fc">
 <h3> Create New Event</h3>
 <div class="arow">
 <div class="afg"><label>Event Title *</label><input type="text" id="ev-title" placeholder="e.g. Tech Summit 2026"></div>
 <div class="afg"><label>Category *</label><select id="ev-cat">
 <option value="">-- Select Category --</option>
 <option value="Academic">Academic</option>
 <option value="Sports">Sports</option>
 <option value="Cultural">Cultural</option>
 <option value="Workshop">Workshop</option>
 <option value="General">General</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Date *</label><input type="date" id="ev-date"></div>
 <div class="afg"><label>Time *</label><input type="time" id="ev-time"></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Location *</label><input type="text" id="ev-loc" placeholder="e.g. Main Auditorium"></div>
 <div class="afg"><label>Capacity *</label><input type="number" id="ev-cap" min="1" placeholder="e.g. 200"></div>
 </div>
 <div class="afb"><label>Budget ()</label><input type="number" id="ev-bud" min="0" placeholder="0"></div>
 <div class="afb"><label>Description</label><textarea id="ev-desc" rows="3" placeholder="Describe your event"></textarea></div>
 <button class="btn-submit" id="btn-create-ev">Create Event</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Your Events</div>
 <table>
 <thead>
 <tr>
 <th>Title</th>
 <th>Date</th>
 <th>Location</th>
 <th>Category</th>
 <th>Status</th>
 <th>Registrations</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="ev-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-regs">
 <div class="ph">
 <h1>Student Registrations</h1>
 <p>Students who signed up for your events</p>
 </div>
 <div class="tw">
 <table>
 <thead>
 <tr>
 <th>Student</th>
 <th>Event</th>
 <th>Event Date</th>
 <th>Registered On</th>
 </tr>
 </thead>
 <tbody id="regs-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-vols">
 <div class="ph">
 <h1>Volunteer Management</h1>
 <p>Assign volunteers to your events</p>
 </div>
 <div class="fc">
 <h3>Assign Volunteer</h3>
 <div class="arow">
 <div class="afg"><label>Full Name *</label><input type="text" id="vn" placeholder="Full name"></div>
 <div class="afg"><label>Email *</label><input type="email" id="ve" placeholder="email@example.com"></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Event *</label><select id="vev">
 <option value="">-- Select event --</option>
 </select></div>
 <div class="afg"><label>Task *</label><input type="text" id="vt" placeholder="e.g. Registration Desk"></div>
 </div>
 <button class="btn-submit" id="btn-assign-vol">Assign Volunteer</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Assigned Volunteers</div>
 <table>
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Event</th>
 <th>Task</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="vol-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-res">
 <div class="ph">
 <h1>Resources</h1>
 <p>Track equipment and supplies for your events</p>
 </div>
 <div class="fc">
 <h3>Add Resource</h3>
 <div class="arow">
 <div class="afg"><label>Resource Name *</label><input type="text" id="rn" placeholder="e.g. Projector"></div>
 <div class="afg"><label>Type *</label><select id="rt">
 <option value="">-- Select Type --</option>
 <option value="Equipment">Equipment</option>
 <option value="Supplies">Supplies</option>
 <option value="Furniture">Furniture</option>
 <option value="AV/Tech">AV/Tech</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Quantity *</label><input type="number" id="rq" min="1" placeholder="1"></div>
 <div class="afg"><label>Event *</label><select id="rev">
 <option value="">-- Select event --</option>
 </select></div>
 </div>
 <button class="btn-submit" id="btn-add-res">Add Resource</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Resources List</div>
 <table>
 <thead>
 <tr>
 <th>Name</th>
 <th>Type</th>
 <th>Qty</th>
 <th>Event</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="res-tb"></tbody>
 </table>
 </div>
 </div>
 <div class="pg" id="pg-ven">
 <div class="ph">
 <h1>Venue Reservations</h1>
 <p>Reserve venues for your events</p>
 </div>
 <div class="fc">
 <h3>Reserve Venue</h3>
 <div class="arow">
 <div class="afg"><label>Venue Name *</label><input type="text" id="vnn" placeholder="e.g. Main Hall"></div>
 <div class="afg"><label>Event *</label><select id="vev2">
 <option value="">-- Select event --</option>
 </select></div>
 </div>
 <div class="arow">
 <div class="afg"><label>Capacity *</label><input type="number" id="vca" min="1" placeholder="200"></div>
 <div class="afg"><label>Date *</label><input type="date" id="vda"></div>
 </div>
 <button class="btn-submit" id="btn-reserve-ven">Reserve Venue</button>
 </div>
 <div class="tw mt">
 <div class="tw-h">Reservations</div>
 <table>
 <thead>
 <tr>
 <th>Venue</th>
 <th>Event</th>
 <th>Date</th>
 <th>Capacity</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody id="ven-tb"></tbody>
 </table>
 </div>
 </div>
 <!-- ANNOUNCEMENTS PAGE (READ-ONLY) -->
 <div class="pg" id="pg-ann">
 <div class="ph">
 <h1> Announcements</h1>
 <p>System announcements from the administration</p>
 </div>
 <div id="ann-empty" class="emp" style="display:none;">No announcements at this time.</div>
 <div class="ann-list" id="ann-list"></div>
 </div>
 <div class="pg" id="pg-cal">
 <div class="ph">
 <h1>Event Calendar</h1>
 <p>Your events in calendar view</p>
 </div>
 <div class="cw">
 <div class="cn"><button class="cb" id="cal-prev"> Prev</button>
 <h3 id="cal-lbl"></h3><button class="cb" id="cal-next">Next </button>
 </div>
 <div class="cgrid" id="cal-wd"></div>
 <div class="cgrid" id="cal-days"></div>
 </div>
 </div>
 </main>
 </div>
 <div class="toast" id="toast"></div>
 <script src="files (1)/faculty-portal-php.js"></script>
</body>

</html>