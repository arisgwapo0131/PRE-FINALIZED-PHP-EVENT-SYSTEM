<?php
/**
 * Event Management System - Installation Script
 * This script will check requirements and help setup the database
 */

$errors = [];
$warnings = [];
$success = [];

// Check PHP version
if (version_compare(PHP_VERSION, '7.0.0', '<')) {
    $errors[] = "PHP 7.0 or higher is required. Current version: " . PHP_VERSION;
} else {
    $success[] = "PHP version: " . PHP_VERSION . " ✓";
}

// Check required extensions
$required_extensions = ['mysqli', 'json', 'session'];
foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        $errors[] = "Required PHP extension '$ext' is not loaded";
    } else {
        $success[] = "Extension '$ext' is loaded ✓";
    }
}

// Check if config.php exists
if (!file_exists('config.php')) {
    $errors[] = "config.php file not found";
} else {
    $success[] = "config.php file found ✓";
}

// Check if database.sql exists
if (!file_exists('database.sql')) {
    $errors[] = "database.sql file not found";
} else {
    $success[] = "database.sql file found ✓";
}

// Try to connect to database
if (file_exists('config.php')) {
    require_once 'config.php';
    
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
        
        if ($conn->connect_error) {
            $errors[] = "Cannot connect to MySQL: " . $conn->connect_error;
        } else {
            $success[] = "MySQL connection successful ✓";
            
            // Check if database exists
            $result = $conn->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
            if ($result->num_rows > 0) {
                $success[] = "Database '" . DB_NAME . "' exists ✓";
                
                // Check if tables exist
                $conn->select_db(DB_NAME);
                $tables = ['event_users', 'event_events', 'event_registrations', 'event_volunteers', 
                          'event_resources', 'event_venues', 'event_feedback', 'event_announcements'];
                
                $missing_tables = [];
                foreach ($tables as $table) {
                    $result = $conn->query("SHOW TABLES LIKE '$table'");
                    if ($result->num_rows == 0) {
                        $missing_tables[] = $table;
                    }
                }
                
                if (empty($missing_tables)) {
                    $success[] = "All required tables exist ✓";
                } else {
                    $warnings[] = "Missing tables: " . implode(', ', $missing_tables);
                }
            } else {
                $warnings[] = "Database '" . DB_NAME . "' does not exist. Please import database.sql";
            }
        }
        
        $conn->close();
    } catch (Exception $e) {
        $errors[] = "Database error: " . $e->getMessage();
    }
}

// Check file permissions
$writable_dirs = ['files (1)'];
foreach ($writable_dirs as $dir) {
    if (is_dir($dir) && is_writable($dir)) {
        $success[] = "Directory '$dir' is writable ✓";
    } else {
        $warnings[] = "Directory '$dir' may not be writable";
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Management System - Installation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #444;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 8px;
        }
        .message {
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.6;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        .status {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 20px;
        }
        .status.ready {
            background: #28a745;
            color: white;
        }
        .status.not-ready {
            background: #dc3545;
            color: white;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
        .instructions {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .instructions h3 {
            margin-bottom: 15px;
            color: #333;
        }
        .instructions ol {
            margin-left: 20px;
        }
        .instructions li {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 Event Management System</h1>
        <p class="subtitle">Installation & System Check</p>
        
        <?php if (!empty($success)): ?>
        <div class="section">
            <h2>✓ System Requirements</h2>
            <?php foreach ($success as $msg): ?>
                <div class="message success"><?php echo $msg; ?></div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($warnings)): ?>
        <div class="section">
            <h2>⚠ Warnings</h2>
            <?php foreach ($warnings as $msg): ?>
                <div class="message warning"><?php echo $msg; ?></div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
        <div class="section">
            <h2>✗ Errors</h2>
            <?php foreach ($errors as $msg): ?>
                <div class="message error"><?php echo $msg; ?></div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <?php if (empty($errors)): ?>
            <div class="status ready">✓ System is ready!</div>
            <br>
            <a href="admin-portal.php" class="btn">Go to Admin Portal</a>
            <a href="faculty-portal.php" class="btn">Go to Faculty Portal</a>
            <a href="student-portal.php" class="btn">Go to Student Portal</a>
        <?php else: ?>
            <div class="status not-ready">✗ System is not ready</div>
        <?php endif; ?>
        
        <div class="instructions">
            <h3>📋 Setup Instructions</h3>
            <ol>
                <li>Make sure MySQL/MariaDB is running</li>
                <li>Import the database:
                    <br><code>mysql -u root -p &lt; database.sql</code>
                    <br>Or use phpMyAdmin to import <code>database.sql</code>
                </li>
                <li>Update database credentials in <code>config.php</code> if needed</li>
                <li>Refresh this page to verify installation</li>
            </ol>
            
            <h3 style="margin-top: 20px;">🔑 Default Login Credentials</h3>
            <ul style="list-style: none; margin-left: 0;">
                <li><strong>Admin:</strong> admin / 123</li>
                <li><strong>Faculty:</strong> faculty / 123</li>
                <li><strong>Student:</strong> student / 123 or student2 / 123</li>
            </ul>
        </div>
    </div>
</body>
</html>
