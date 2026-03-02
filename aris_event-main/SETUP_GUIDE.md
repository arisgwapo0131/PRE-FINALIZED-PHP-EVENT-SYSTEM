# Event Management System - Complete Setup Guide

## 🎯 Quick Start (3 Steps)

### Step 1: Import Database
```bash
# Option A: Using command line
mysql -u root -p < database.sql

# Option B: Using phpMyAdmin
1. Open phpMyAdmin
2. Click "Import"
3. Choose database.sql file
4. Click "Go"
```

### Step 2: Configure Database (if needed)
Edit `config.php` and update these lines if your MySQL credentials are different:
```php
define('DB_HOST', 'localhost');  // Usually localhost
define('DB_USER', 'root');       // Your MySQL username
define('DB_PASS', '');           // Your MySQL password
define('DB_NAME', 'event_management');
```

### Step 3: Start Server
```bash
# Option A: PHP Built-in Server
php -S localhost:8000

# Option B: XAMPP/WAMP/MAMP
# Just place files in htdocs/www folder and access via http://localhost/
```

## 🌐 Access the System

Once running, open your browser:

- **Installation Check**: http://localhost:8000/install.php
- **Admin Portal**: http://localhost:8000/admin-portal.php
- **Faculty Portal**: http://localhost:8000/faculty-portal.php
- **Student Portal**: http://localhost:8000/student-portal.php

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 123 |
| Faculty | faculty | 123 |
| Student | student | 123 |
| Student | student2 | 123 |

## 📁 File Structure

```
event-management/
├── admin-portal.php          # Admin portal page
├── faculty-portal.php        # Faculty portal page
├── student-portal.php        # Student portal page
├── api.php                   # Backend API endpoints
├── config.php                # Database configuration
├── database.sql              # Database schema & sample data
├── install.php               # Installation checker
├── README_PHP.md             # Complete documentation
├── SETUP_GUIDE.md           # This file
└── files (1)/
    ├── admin-portal.css      # Admin styles
    ├── admin-portal-php.js   # Admin JavaScript
    ├── faculty-portal.css    # Faculty styles
    ├── faculty-portal-php.js # Faculty JavaScript
    ├── student-portal.css    # Student styles
    └── student-portal-php.js # Student JavaScript
```

## ✅ Features by Portal

### 👨‍💼 Admin Portal
- ✅ System dashboard with statistics
- ✅ Approve/reject events
- ✅ View all events with filters
- ✅ User management
- ✅ View all registrations
- ✅ Manage resources, volunteers, venues
- ✅ Post system announcements
- ✅ Generate reports

### 👨‍🏫 Faculty Portal
- ✅ Faculty dashboard
- ✅ Create and manage events
- ✅ View student registrations
- ✅ Assign volunteers
- ✅ Add event resources
- ✅ Reserve venues
- ✅ View announcements
- ✅ Calendar view

### 🎓 Student Portal
- ✅ Browse events
- ✅ Search events
- ✅ Register for events
- ✅ View my registrations
- ✅ Cancel registrations
- ✅ Submit feedback
- ✅ View announcements
- ✅ Calendar view

## 🗄️ Database Tables

1. **event_users** - User accounts (students, faculty, admin)
2. **event_events** - Events created by faculty
3. **event_registrations** - Student event registrations
4. **event_volunteers** - Volunteer assignments
5. **event_resources** - Event resources
6. **event_venues** - Venue reservations
7. **event_feedback** - Student feedback
8. **event_announcements** - System announcements

## 🔧 Troubleshooting

### Database Connection Error
**Problem**: "Connection failed" error
**Solution**:
1. Check MySQL is running
2. Verify credentials in config.php
3. Ensure database exists: `SHOW DATABASES;`

### Login Not Working
**Problem**: Can't login with credentials
**Solution**:
1. Clear browser cache and cookies
2. Check if users exist: `SELECT * FROM event_users;`
3. Verify password is '123' for demo accounts

### Blank Page
**Problem**: Page shows nothing
**Solution**:
1. Check PHP error logs
2. Enable error display in php.ini:
   ```ini
   display_errors = On
   error_reporting = E_ALL
   ```
3. Check browser console for JavaScript errors

### API Not Working
**Problem**: Features not loading
**Solution**:
1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Verify api.php is accessible
4. Check PHP error logs

## 🔒 Security Notes

### Current Security Features
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (input sanitization)
- ✅ Session-based authentication
- ✅ Role-based access control

### Recommended for Production
- [ ] Change default passwords
- [ ] Add CSRF protection
- [ ] Enable HTTPS
- [ ] Set secure session cookies
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable SQL query logging
- [ ] Regular security audits

## 📊 Sample Data

The database comes with:
- 4 users (1 admin, 1 faculty, 2 students)
- 3 sample events
- All tables initialized

## 🚀 Next Steps

1. **Test the System**
   - Login to each portal
   - Create a test event (faculty)
   - Approve it (admin)
   - Register for it (student)

2. **Customize**
   - Update colors in CSS files
   - Modify event categories
   - Add more fields as needed

3. **Deploy**
   - Choose a hosting provider
   - Upload files
   - Import database
   - Update config.php
   - Test thoroughly

## 📞 Support

For issues:
1. Check this guide
2. Review README_PHP.md
3. Check browser console (F12)
4. Check PHP error logs
5. Verify database connection

## 📝 License

This is a demo/educational project. Feel free to modify and use as needed.

---

**System Status**: ✅ Fully Functional
**Last Updated**: 2024
**Version**: 1.0.0
