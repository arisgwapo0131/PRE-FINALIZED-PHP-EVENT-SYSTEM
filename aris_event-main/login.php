<?php
require_once 'config.php';

// If already logged in, redirect to appropriate portal
if (isLoggedIn()) {
 switch ($_SESSION['role']) {
 case 'admin':
 header('Location: admin-portal.php');
 break;
 case 'faculty':
 header('Location: faculty-portal.php');
 break;
 case 'student':
 header('Location: student-portal.php');
 break;
 }
 exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Login - Event Management System</title>
 <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
 <style>
 :root {
 --accent: #2563eb;
 --accent-h: #1d4ed8;
 --accent-light: #eff6ff;
 --accent-mid: #bfdbfe;
 --border: #e2e8f0;
 --text: #1e293b;
 --muted: #64748b;
 --danger: #dc2626;
 }

 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
 }

 body {
 font-family: 'Sora', sans-serif;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 20px;
 }

 .login-container {
 background: white;
 border-radius: 24px;
 box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
 overflow: hidden;
 max-width: 900px;
 width: 100%;
 display: flex;
 }

 .login-left {
 flex: 1;
 padding: 60px 50px;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 color: white;
 display: flex;
 flex-direction: column;
 justify-content: center;
 }

 .login-left h1 {
 font-size: 32px;
 margin-bottom: 20px;
 font-weight: 700;
 }

 .login-left p {
 font-size: 16px;
 line-height: 1.6;
 opacity: 0.9;
 margin-bottom: 30px;
 }

 .feature-list {
 list-style: none;
 }

 .feature-list li {
 padding: 12px 0;
 display: flex;
 align-items: center;
 gap: 12px;
 font-size: 14px;
 }

 .feature-list li::before {
 content: "";
 background: rgba(255, 255, 255, 0.2);
 width: 24px;
 height: 24px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: bold;
 }

 .login-right {
 flex: 1;
 padding: 60px 50px;
 display: flex;
 flex-direction: column;
 justify-content: center;
 }

 .logo {
 font-family: 'Space Mono', monospace;
 font-size: 24px;
 color: var(--accent);
 margin-bottom: 10px;
 font-weight: 700;
 }

 .login-right h2 {
 font-size: 28px;
 color: var(--text);
 margin-bottom: 8px;
 }

 .subtitle {
 color: var(--muted);
 font-size: 14px;
 margin-bottom: 40px;
 }

 .role-selector {
 display: flex;
 gap: 12px;
 margin-bottom: 30px;
 }

 .role-btn {
 flex: 1;
 padding: 16px;
 border: 2px solid var(--border);
 border-radius: 12px;
 background: white;
 cursor: pointer;
 transition: all 0.3s;
 text-align: center;
 }

 .role-btn:hover {
 border-color: var(--accent-mid);
 background: var(--accent-light);
 }

 .role-btn.active {
 border-color: var(--accent);
 background: var(--accent-light);
 }

 .role-icon {
 font-size: 32px;
 margin-bottom: 8px;
 }

 .role-name {
 font-size: 14px;
 font-weight: 600;
 color: var(--text);
 }

 .form-group {
 margin-bottom: 20px;
 }

 .form-group label {
 display: block;
 font-size: 13px;
 font-weight: 600;
 color: var(--muted);
 margin-bottom: 8px;
 text-transform: uppercase;
 letter-spacing: 0.5px;
 }

 .form-group input {
 width: 100%;
 padding: 14px 16px;
 border: 2px solid var(--border);
 border-radius: 10px;
 font-size: 15px;
 font-family: inherit;
 transition: all 0.3s;
 }

 .form-group input:focus {
 outline: none;
 border-color: var(--accent);
 box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
 }

 .error-message {
 background: #fee2e2;
 color: var(--danger);
 padding: 12px 16px;
 border-radius: 8px;
 font-size: 14px;
 margin-bottom: 20px;
 display: none;
 }

 .error-message.show {
 display: block;
 }

 .btn-login {
 width: 100%;
 padding: 16px;
 background: var(--accent);
 color: white;
 border: none;
 border-radius: 10px;
 font-size: 16px;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.3s;
 font-family: inherit;
 }

 .btn-login:hover {
 background: var(--accent-h);
 transform: translateY(-2px);
 box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
 }

 .btn-login:active {
 transform: translateY(0);
 }

 .demo-credentials {
 margin-top: 30px;
 padding: 20px;
 background: #f8fafc;
 border-radius: 10px;
 font-size: 13px;
 }

 .demo-credentials h4 {
 font-size: 14px;
 margin-bottom: 12px;
 color: var(--text);
 }

 .demo-credentials p {
 margin: 6px 0;
 color: var(--muted);
 }

 .demo-credentials strong {
 color: var(--text);
 font-family: 'Space Mono', monospace;
 }

 @media (max-width: 768px) {
 .login-container {
 flex-direction: column;
 }

 .login-left {
 padding: 40px 30px;
 }

 .login-right {
 padding: 40px 30px;
 }

 .role-selector {
 flex-direction: column;
 }
 }
 </style>
</head>

<body>
 <div class="login-container">
 <div class="login-left">
 <h1>Event Management System</h1>
 <p>A comprehensive platform for managing campus events, registrations, and resources.</p>
 <ul class="feature-list">
 <li>Create and manage events</li>
 <li>Student registration system</li>
 <li>Volunteer coordination</li>
 <li>Resource management</li>
 <li>Real-time announcements</li>
 <li>Calendar integration</li>
 </ul>
 </div>

 <div class="login-right">
 <div class="logo">EventHub</div>
 <h2>Welcome Back</h2>
 <p class="subtitle">Sign in to access your portal</p>

 <div class="role-selector">
 <div class="role-btn active" data-role="student">
 <div class="role-icon">S</div>
 <div class="role-name">Student</div>
 </div>
 <div class="role-btn" data-role="faculty">
 <div class="role-icon">F</div>
 <div class="role-name">Faculty</div>
 </div>
 <div class="role-btn" data-role="admin">
 <div class="role-icon">A</div>
 <div class="role-name">Admin</div>
 </div>
 </div>

 <div class="error-message" id="error-message"></div>

 <form id="login-form">
 <div class="form-group">
 <label>Username</label>
 <input type="text" id="username" name="username" placeholder="Enter your username" required autocomplete="username">
 </div>

 <div class="form-group">
 <label>Password</label>
 <input type="password" id="password" name="password" placeholder="Enter your password" required autocomplete="current-password">
 </div>

 <button type="submit" class="btn-login">Sign In</button>
 </form>

 <div class="demo-credentials">
 <h4>Demo Credentials:</h4>
 <p><strong>Admin:</strong> admin / 123</p>
 <p><strong>Faculty:</strong> faculty / 123</p>
 <p><strong>Student:</strong> student / 123</p>
 </div>
 </div>
 </div>

 <script>
 let selectedRole = 'student';

 // Role selection
 document.querySelectorAll('.role-btn').forEach(btn => {
 btn.addEventListener('click', function() {
 document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
 this.classList.add('active');
 selectedRole = this.dataset.role;
 });
 });

 // Form submission
 document.getElementById('login-form').addEventListener('submit', async function(e) {
 e.preventDefault();

 const username = document.getElementById('username').value.trim();
 const password = document.getElementById('password').value;
 const errorMsg = document.getElementById('error-message');

 errorMsg.classList.remove('show');

 if (!username || !password) {
 errorMsg.textContent = 'Please fill in all fields';
 errorMsg.classList.add('show');
 return;
 }

 try {
 const formData = new FormData();
 formData.append('action', 'login');
 formData.append('username', username);
 formData.append('password', password);
 formData.append('role', selectedRole);

 const response = await fetch('api.php', {
 method: 'POST',
 body: formData
 });

 const result = await response.json();

 if (result.success) {
 // Redirect to appropriate portal
 switch (result.data.role) {
 case 'admin':
 window.location.href = 'admin-portal.php';
 break;
 case 'faculty':
 window.location.href = 'faculty-portal.php';
 break;
 case 'student':
 window.location.href = 'student-portal.php';
 break;
 }
 } else {
 errorMsg.textContent = result.message;
 errorMsg.classList.add('show');
 }
 } catch (error) {
 errorMsg.textContent = 'Network error. Please try again.';
 errorMsg.classList.add('show');
 }
 });

 // Enter key support
 document.getElementById('password').addEventListener('keypress', function(e) {
 if (e.key === 'Enter') {
 document.getElementById('login-form').dispatchEvent(new Event('submit'));
 }
 });
 </script>
</body>

</html>
