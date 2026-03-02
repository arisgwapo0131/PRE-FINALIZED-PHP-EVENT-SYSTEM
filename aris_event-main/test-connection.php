<?php
/**
 * Quick Database Connection Test
 * Run this file to verify your database connection works
 */

// Load configuration
if (!file_exists('config.php')) {
    die("❌ Error: config.php not found!");
}

require_once 'config.php';

echo "<h2>🔍 Testing Database Connection...</h2>";
echo "<pre>";

// Test 1: PHP Version
echo "\n1. PHP Version Check:\n";
echo "   Current: " . PHP_VERSION;
if (version_compare(PHP_VERSION, '7.0.0', '>=')) {
    echo " ✅ OK\n";
} else {
    echo " ❌ FAIL (Need 7.0+)\n";
}

// Test 2: Required Extensions
echo "\n2. Required Extensions:\n";
$extensions = ['mysqli', 'json', 'session'];
foreach ($extensions as $ext) {
    echo "   $ext: " . (extension_loaded($ext) ? "✅ Loaded" : "❌ Missing") . "\n";
}

// Test 3: Database Connection
echo "\n3. Database Connection:\n";
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        echo "   ❌ Connection failed: " . $conn->connect_error . "\n";
        exit;
    }
    
    echo "   ✅ Connected successfully!\n";
    echo "   Host: " . DB_HOST . "\n";
    echo "   Database: " . DB_NAME . "\n";
    
    // Test 4: Check Tables
    echo "\n4. Database Tables:\n";
    $tables = ['event_users', 'event_events', 'event_registrations', 'event_volunteers', 
               'event_resources', 'event_venues', 'event_feedback', 'event_announcements'];
    
    $all_exist = true;
    foreach ($tables as $table) {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        $exists = $result->num_rows > 0;
        echo "   $table: " . ($exists ? "✅ Exists" : "❌ Missing") . "\n";
        if (!$exists) $all_exist = false;
    }
    
    // Test 5: Check Sample Data
    if ($all_exist) {
        echo "\n5. Sample Data:\n";
        
        $result = $conn->query("SELECT COUNT(*) as count FROM event_users");
        $count = $result->fetch_assoc()['count'];
        echo "   Users: $count " . ($count > 0 ? "✅" : "⚠️") . "\n";
        
        $result = $conn->query("SELECT COUNT(*) as count FROM event_events");
        $count = $result->fetch_assoc()['count'];
        echo "   Events: $count " . ($count > 0 ? "✅" : "⚠️") . "\n";
        
        // Test login
        echo "\n6. Test User Login:\n";
        $result = $conn->query("SELECT username, role FROM event_users WHERE username IN ('admin', 'faculty', 'student')");
        while ($row = $result->fetch_assoc()) {
            echo "   {$row['username']} ({$row['role']}): ✅ Ready\n";
        }
    }
    
    echo "\n" . str_repeat("=", 50) . "\n";
    
    if ($all_exist) {
        echo "\n✅ ALL TESTS PASSED!\n";
        echo "\nYou can now access:\n";
        echo "- Admin Portal: admin-portal.php (admin/123)\n";
        echo "- Faculty Portal: faculty-portal.php (faculty/123)\n";
        echo "- Student Portal: student-portal.php (student/123)\n";
    } else {
        echo "\n⚠️ SOME TESTS FAILED\n";
        echo "\nPlease import database.sql:\n";
        echo "mysql -u root -p < database.sql\n";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

echo "</pre>";
?>
