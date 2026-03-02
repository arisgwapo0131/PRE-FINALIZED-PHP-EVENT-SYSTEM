<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDBConnection();
$action = $_POST['action'] ?? $_GET['action'] ?? '';

// Login
if ($action === 'login') {
    $username = sanitize($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = sanitize($_POST['role'] ?? '');
    
    if (empty($username) || empty($password)) {
        jsonResponse(false, 'Username and password are required');
    }
    
    $stmt = $conn->prepare("SELECT * FROM event_users WHERE username = ? AND role = ? AND status = 'active'");
    $stmt->bind_param("ss", $username, $role);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password (password is '123' for all demo users)
        if (password_verify($password, $user['password']) || $password === '123') {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['email'] = $user['email'];
            
            jsonResponse(true, 'Login successful', [
                'username' => $user['username'],
                'name' => $user['name'],
                'role' => $user['role']
            ]);
        }
    }
    
    jsonResponse(false, 'Invalid credentials or not a ' . $role . ' account');
}

// Logout
if ($action === 'logout') {
    session_destroy();
    jsonResponse(true, 'Logged out successfully');
}

// Get all events
if ($action === 'getEvents') {
    $status = $_GET['status'] ?? 'all';
    $organizer = $_GET['organizer'] ?? '';
    
    $sql = "SELECT * FROM event_events WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if (!empty($organizer)) {
        $sql .= " AND organizer = ?";
        $params[] = $organizer;
        $types .= "s";
    }
    
    $sql .= " ORDER BY date DESC, created_at DESC";
    
    if (!empty($params)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($sql);
    }
    
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    
    jsonResponse(true, '', $events);
}

// Create event
if ($action === 'createEvent') {
    requireLogin();
    
    $event_id = generateId('evt');
    $title = sanitize($_POST['title']);
    $date = sanitize($_POST['date']);
    $time = sanitize($_POST['time']);
    $location = sanitize($_POST['location']);
    $description = sanitize($_POST['description'] ?? '');
    $category = sanitize($_POST['category']);
    $capacity = intval($_POST['capacity']);
    $budget = floatval($_POST['budget'] ?? 0);
    
    $stmt = $conn->prepare("INSERT INTO event_events (event_id, title, date, time, location, description, organizer, organizer_name, category, capacity, status, budget) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)");
    $stmt->bind_param("sssssssssid", $event_id, $title, $date, $time, $location, $description, $_SESSION['username'], $_SESSION['name'], $category, $capacity, $budget);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Event created successfully', ['event_id' => $event_id]);
    } else {
        jsonResponse(false, 'Failed to create event');
    }
}

// Update event status
if ($action === 'updateEventStatus') {
    requireRole('admin');
    
    $event_id = sanitize($_POST['event_id']);
    $status = sanitize($_POST['status']);
    
    $stmt = $conn->prepare("UPDATE event_events SET status = ? WHERE event_id = ?");
    $stmt->bind_param("ss", $status, $event_id);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Event status updated');
    } else {
        jsonResponse(false, 'Failed to update event status');
    }
}

// Delete event
if ($action === 'deleteEvent') {
    requireLogin();
    
    $event_id = sanitize($_POST['event_id']);
    
    // Check if user is admin or event organizer
    if ($_SESSION['role'] === 'admin') {
        $stmt = $conn->prepare("DELETE FROM event_events WHERE event_id = ?");
        $stmt->bind_param("s", $event_id);
    } else {
        $stmt = $conn->prepare("DELETE FROM event_events WHERE event_id = ? AND organizer = ?");
        $stmt->bind_param("ss", $event_id, $_SESSION['username']);
    }
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Event deleted');
    } else {
        jsonResponse(false, 'Failed to delete event');
    }
}

// Get registrations
if ($action === 'getRegistrations') {
    $event_id = $_GET['event_id'] ?? '';
    $student_id = $_GET['student_id'] ?? '';
    
    $sql = "SELECT * FROM event_registrations WHERE 1=1";
    $params = [];
    $types = "";
    
    if (!empty($event_id)) {
        $sql .= " AND event_id = ?";
        $params[] = $event_id;
        $types .= "s";
    }
    
    if (!empty($student_id)) {
        $sql .= " AND student_id = ?";
        $params[] = $student_id;
        $types .= "s";
    }
    
    $sql .= " ORDER BY registered_at DESC";
    
    if (!empty($params)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query($sql);
    }
    
    $registrations = [];
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
    
    jsonResponse(true, '', $registrations);
}

// Register for event
if ($action === 'registerEvent') {
    requireRole('student');
    
    $event_id = sanitize($_POST['event_id']);
    
    // Check if already registered
    $stmt = $conn->prepare("SELECT id FROM event_registrations WHERE event_id = ? AND student_id = ?");
    $stmt->bind_param("ss", $event_id, $_SESSION['username']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        jsonResponse(false, 'Already registered for this event');
    }
    
    // Get event details
    $stmt = $conn->prepare("SELECT title, date FROM event_events WHERE event_id = ?");
    $stmt->bind_param("s", $event_id);
    $stmt->execute();
    $event = $stmt->get_result()->fetch_assoc();
    
    if (!$event) {
        jsonResponse(false, 'Event not found');
    }
    
    $reg_id = generateId('reg');
    $stmt = $conn->prepare("INSERT INTO event_registrations (reg_id, student_id, student_name, event_id, event_title, event_date) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $reg_id, $_SESSION['username'], $_SESSION['name'], $event_id, $event['title'], $event['date']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Registered successfully');
    } else {
        jsonResponse(false, 'Failed to register');
    }
}

// Unregister from event
if ($action === 'unregisterEvent') {
    requireRole('student');
    
    $reg_id = sanitize($_POST['reg_id']);
    
    $stmt = $conn->prepare("DELETE FROM event_registrations WHERE reg_id = ? AND student_id = ?");
    $stmt->bind_param("ss", $reg_id, $_SESSION['username']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Registration cancelled');
    } else {
        jsonResponse(false, 'Failed to cancel registration');
    }
}

// Get users
if ($action === 'getUsers') {
    requireRole('admin');
    
    $result = $conn->query("SELECT id, username, name, email, role, status, created_at FROM event_users ORDER BY created_at DESC");
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    jsonResponse(true, '', $users);
}

// Get volunteers
if ($action === 'getVolunteers') {
    $event_id = $_GET['event_id'] ?? '';
    
    $sql = "SELECT * FROM event_volunteers WHERE 1=1";
    if (!empty($event_id)) {
        $sql .= " AND event_id = '$event_id'";
    }
    $sql .= " ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $volunteers = [];
    while ($row = $result->fetch_assoc()) {
        $volunteers[] = $row;
    }
    
    jsonResponse(true, '', $volunteers);
}

// Add volunteer
if ($action === 'addVolunteer') {
    requireRole('faculty');
    
    $vol_id = generateId('vol');
    $name = sanitize($_POST['name']);
    $email = sanitize($_POST['email']);
    $event_id = sanitize($_POST['event_id']);
    $event_title = sanitize($_POST['event_title']);
    $task = sanitize($_POST['task']);
    
    $stmt = $conn->prepare("INSERT INTO event_volunteers (vol_id, name, email, event_id, event_title, task, assigned_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $vol_id, $name, $email, $event_id, $event_title, $task, $_SESSION['username']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Volunteer assigned');
    } else {
        jsonResponse(false, 'Failed to assign volunteer');
    }
}

// Delete volunteer
if ($action === 'deleteVolunteer') {
    requireRole('faculty');
    
    $vol_id = sanitize($_POST['vol_id']);
    
    $stmt = $conn->prepare("DELETE FROM event_volunteers WHERE vol_id = ?");
    $stmt->bind_param("s", $vol_id);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Volunteer removed');
    } else {
        jsonResponse(false, 'Failed to remove volunteer');
    }
}

// Get resources
if ($action === 'getResources') {
    $event_id = $_GET['event_id'] ?? '';
    
    $sql = "SELECT * FROM event_resources WHERE 1=1";
    if (!empty($event_id)) {
        $sql .= " AND event_id = '$event_id'";
    }
    $sql .= " ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    $resources = [];
    while ($row = $result->fetch_assoc()) {
        $resources[] = $row;
    }
    
    jsonResponse(true, '', $resources);
}

// Add resource
if ($action === 'addResource') {
    requireRole('faculty');
    
    $res_id = generateId('res');
    $name = sanitize($_POST['name']);
    $type = sanitize($_POST['type']);
    $qty = intval($_POST['qty']);
    $event_id = sanitize($_POST['event_id']);
    $event_title = sanitize($_POST['event_title']);
    
    $stmt = $conn->prepare("INSERT INTO event_resources (res_id, name, type, qty, event_id, event_title, added_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssisss", $res_id, $name, $type, $qty, $event_id, $event_title, $_SESSION['username']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Resource added');
    } else {
        jsonResponse(false, 'Failed to add resource');
    }
}

// Delete resource
if ($action === 'deleteResource') {
    requireRole('faculty');
    
    $res_id = sanitize($_POST['res_id']);
    
    $stmt = $conn->prepare("DELETE FROM event_resources WHERE res_id = ?");
    $stmt->bind_param("s", $res_id);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Resource removed');
    } else {
        jsonResponse(false, 'Failed to remove resource');
    }
}

// Get venues
if ($action === 'getVenues') {
    $event_id = $_GET['event_id'] ?? '';
    
    $sql = "SELECT * FROM event_venues WHERE 1=1";
    if (!empty($event_id)) {
        $sql .= " AND event_id = '$event_id'";
    }
    $sql .= " ORDER BY date DESC";
    
    $result = $conn->query($sql);
    $venues = [];
    while ($row = $result->fetch_assoc()) {
        $venues[] = $row;
    }
    
    jsonResponse(true, '', $venues);
}

// Add venue
if ($action === 'addVenue') {
    requireRole('faculty');
    
    $venue_id = generateId('ven');
    $name = sanitize($_POST['name']);
    $event_id = sanitize($_POST['event_id']);
    $event_title = sanitize($_POST['event_title']);
    $date = sanitize($_POST['date']);
    $capacity = intval($_POST['capacity']);
    
    $stmt = $conn->prepare("INSERT INTO event_venues (venue_id, name, event_id, event_title, date, capacity, reserved_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $venue_id, $name, $event_id, $event_title, $date, $capacity, $_SESSION['username']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Venue reserved');
    } else {
        jsonResponse(false, 'Failed to reserve venue');
    }
}

// Delete venue
if ($action === 'deleteVenue') {
    requireRole('faculty');
    
    $venue_id = sanitize($_POST['venue_id']);
    
    $stmt = $conn->prepare("DELETE FROM event_venues WHERE venue_id = ?");
    $stmt->bind_param("s", $venue_id);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Venue reservation removed');
    } else {
        jsonResponse(false, 'Failed to remove venue reservation');
    }
}

// Get announcements
if ($action === 'getAnnouncements') {
    $audience = $_GET['audience'] ?? 'all';
    
    $sql = "SELECT * FROM event_announcements WHERE (audience = ? OR audience = 'all')";
    $sql .= " AND (expiry IS NULL OR expiry >= CURDATE())";
    $sql .= " ORDER BY posted_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $audience);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $announcements = [];
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }
    
    jsonResponse(true, '', $announcements);
}

// Post announcement
if ($action === 'postAnnouncement') {
    requireRole('admin');
    
    $ann_id = generateId('ann');
    $title = sanitize($_POST['title']);
    $priority = sanitize($_POST['priority']);
    $audience = sanitize($_POST['audience']);
    $expiry = !empty($_POST['expiry']) ? sanitize($_POST['expiry']) : null;
    $body = sanitize($_POST['body']);
    
    $stmt = $conn->prepare("INSERT INTO event_announcements (ann_id, title, priority, audience, expiry, body, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $ann_id, $title, $priority, $audience, $expiry, $body, $_SESSION['name']);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Announcement posted');
    } else {
        jsonResponse(false, 'Failed to post announcement');
    }
}

// Delete announcement
if ($action === 'deleteAnnouncement') {
    requireRole('admin');
    
    $ann_id = sanitize($_POST['ann_id']);
    
    $stmt = $conn->prepare("DELETE FROM event_announcements WHERE ann_id = ?");
    $stmt->bind_param("s", $ann_id);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Announcement deleted');
    } else {
        jsonResponse(false, 'Failed to delete announcement');
    }
}

// Submit feedback
if ($action === 'submitFeedback') {
    requireRole('student');
    
    $fb_id = generateId('fb');
    $event_id = sanitize($_POST['event_id']);
    $rating = intval($_POST['rating']);
    $text = sanitize($_POST['text']);
    $date = date('Y-m-d');
    
    $stmt = $conn->prepare("INSERT INTO event_feedback (fb_id, student_id, student_name, event_id, rating, text, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiss", $fb_id, $_SESSION['username'], $_SESSION['name'], $event_id, $rating, $text, $date);
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Feedback submitted');
    } else {
        jsonResponse(false, 'Failed to submit feedback');
    }
}

// Get feedback
if ($action === 'getFeedback') {
    $result = $conn->query("SELECT * FROM event_feedback ORDER BY created_at DESC LIMIT 10");
    
    $feedback = [];
    while ($row = $result->fetch_assoc()) {
        $feedback[] = $row;
    }
    
    jsonResponse(true, '', $feedback);
}

// Get dashboard stats
if ($action === 'getDashboardStats') {
    requireLogin();
    
    $stats = [];
    
    if ($_SESSION['role'] === 'admin') {
        $stats['total_users'] = $conn->query("SELECT COUNT(*) as count FROM event_users")->fetch_assoc()['count'];
        $stats['total_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events")->fetch_assoc()['count'];
        $stats['total_registrations'] = $conn->query("SELECT COUNT(*) as count FROM event_registrations")->fetch_assoc()['count'];
        $stats['pending_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE status = 'pending'")->fetch_assoc()['count'];
        $stats['total_announcements'] = $conn->query("SELECT COUNT(*) as count FROM event_announcements")->fetch_assoc()['count'];
    } elseif ($_SESSION['role'] === 'faculty') {
        $username = $_SESSION['username'];
        $stats['my_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE organizer = '$username'")->fetch_assoc()['count'];
        $stats['approved_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE organizer = '$username' AND status = 'approved'")->fetch_assoc()['count'];
        $stats['pending_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE organizer = '$username' AND status = 'pending'")->fetch_assoc()['count'];
        $stats['total_registrations'] = $conn->query("SELECT COUNT(*) as count FROM event_registrations WHERE event_id IN (SELECT event_id FROM event_events WHERE organizer = '$username')")->fetch_assoc()['count'];
    } elseif ($_SESSION['role'] === 'student') {
        $username = $_SESSION['username'];
        $stats['total_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE status = 'approved'")->fetch_assoc()['count'];
        $stats['my_registrations'] = $conn->query("SELECT COUNT(*) as count FROM event_registrations WHERE student_id = '$username'")->fetch_assoc()['count'];
        $stats['approved_events'] = $conn->query("SELECT COUNT(*) as count FROM event_events WHERE status = 'approved'")->fetch_assoc()['count'];
    }
    
    jsonResponse(true, '', $stats);
}

jsonResponse(false, 'Invalid action');
?>
