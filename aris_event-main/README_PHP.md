# Event Management System - PHP/MySQL Version

## Overview
This is a complete PHP/MySQL conversion of the Event Management System with three portals: Admin, Faculty, and Student.

## Files Created

### Database
- `database.sql` - Complete database schema with tables and sample data

### Backend (PHP)
- `config.php` - Database configuration and helper functions
- `api.php` - RESTful API endpoints for all operations
- `admin-portal.php` - Admin portal (PHP version) ✅
- `faculty-portal.php` - Faculty portal (PHP version) ✅
- `student-portal.php` - Student portal (PHP version) ✅

### Frontend (JavaScript - PHP Compatible)
- `files (1)/admin-portal-php.js` - Admin portal JavaScript with API calls ✅
- `files (1)/faculty-portal-php.js` - Faculty portal JavaScript with API calls ✅
- `files (1)/student-portal-php.js` - Student portal JavaScript with API calls ✅

### Original Files (Still Available)
- `files (1)/admin-portal.html/css/js` - Original localStorage version
- `files (1)/faculty-portal.html/css/js` - Original localStorage version
- `files (1)/student-portal.html/css/js` - Original localStorage version

## Database Schema

### Tables Created:
1. **event_users** - User accounts (students, faculty, admin)
2. **event_events** - Events created by faculty
3. **event_registrations** - Student event registrations
4. **event_volunteers** - Volunteer assignments
5. **event_resources** - Event resources (equipment, supplies)
6. **event_venues** - Venue reservations
7. **event_feedback** - Student feedback on events
8. **event_announcements** - System announcements

## Setup Instructions

### 1. Database Setup
```bash
# Import the database
mysql -u root -p < database.sql
```

Or use phpMyAdmin:
1. Open phpMyAdmin
2. Create new database: `event_management`
3. Import `database.sql` file

### 2. Configure Database Connection
Edit `config.php` if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'event_management');
```

### 3. Start Server
```bash
# Using PHP built-in server
php -S localhost:8000

# Or use XAMPP/WAMP/MAMP
# Place files in htdocs/www folder
```

### 4. Access the System
- Admin Portal: `http://localhost:8000/admin-portal.php`
- Faculty Portal: `http://localhost:8000/faculty-portal.php`
- Student Portal: `http://localhost:8000/student-portal.php`

## Default Login Credentials

### Admin
- Username: `admin`
- Password: `123`

### Faculty
- Username: `faculty`
- Password: `123`

### Students
- Username: `student` or `student2`
- Password: `123`

## Features

### Admin Portal
✅ Dashboard with system statistics
✅ Approve/reject events
✅ View all events with filters
✅ Manage users
✅ View registrations
✅ Manage resources, volunteers, venues
✅ Post announcements
✅ Generate reports

### Faculty Portal ✅
✅ Dashboard with faculty statistics
✅ Create and manage events
✅ View student registrations
✅ Assign volunteers
✅ Add resources
✅ Reserve venues
✅ View announcements
✅ Calendar view

### Student Portal ✅
✅ Browse and search events
✅ Register for events
✅ View registrations
✅ Submit feedback
✅ View announcements
✅ Calendar view

## API Endpoints

### Authentication
- `POST /api.php?action=login` - User login
- `POST /api.php?action=logout` - User logout

### Events
- `GET /api.php?action=getEvents` - Get all events
- `POST /api.php?action=createEvent` - Create new event
- `POST /api.php?action=updateEventStatus` - Update event status
- `POST /api.php?action=deleteEvent` - Delete event

### Registrations
- `GET /api.php?action=getRegistrations` - Get registrations
- `POST /api.php?action=registerEvent` - Register for event
- `POST /api.php?action=unregisterEvent` - Cancel registration

### Users
- `GET /api.php?action=getUsers` - Get all users (admin only)

### Volunteers
- `GET /api.php?action=getVolunteers` - Get volunteers
- `POST /api.php?action=addVolunteer` - Add volunteer
- `POST /api.php?action=deleteVolunteer` - Remove volunteer

### Resources
- `GET /api.php?action=getResources` - Get resources
- `POST /api.php?action=addResource` - Add resource
- `POST /api.php?action=deleteResource` - Remove resource

### Venues
- `GET /api.php?action=getVenues` - Get venues
- `POST /api.php?action=addVenue` - Reserve venue
- `POST /api.php?action=deleteVenue` - Cancel reservation

### Announcements
- `GET /api.php?action=getAnnouncements` - Get announcements
- `POST /api.php?action=postAnnouncement` - Post announcement (admin)
- `POST /api.php?action=deleteAnnouncement` - Delete announcement (admin)

### Feedback
- `POST /api.php?action=submitFeedback` - Submit feedback
- `GET /api.php?action=getFeedback` - Get feedback

### Dashboard
- `GET /api.php?action=getDashboardStats` - Get dashboard statistics

## Security Features
- Password hashing with bcrypt
- SQL injection prevention with prepared statements
- XSS protection with input sanitization
- Session-based authentication
- Role-based access control
- CSRF protection ready (can be added)

## Completed Features
1. ✅ Database schema created
2. ✅ API endpoints implemented
3. ✅ Admin portal converted to PHP
4. ✅ Faculty portal converted to PHP
5. ✅ Student portal converted to PHP
6. ✅ All portals fully functional
7. ✅ Session-based authentication
8. ✅ Role-based access control

## Optional Enhancements
- Add CSRF protection
- Implement email notifications
- Add file upload for event images
- Create admin user management interface
- Add event capacity checking
- Implement event search filters
- Add export functionality (PDF/Excel)

## Notes
- All passwords in demo are hashed version of "123"
- Sample data is included in database.sql
- The system uses sessions for authentication
- All API responses are in JSON format
- Frontend uses async/await for API calls

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify database credentials in config.php
- Ensure database exists

### Login Not Working
- Clear browser cache and cookies
- Check session is enabled in PHP
- Verify user exists in database

### API Errors
- Check browser console for errors
- Verify API endpoint URLs
- Check PHP error logs

## Support
For issues or questions, check the code comments or review the API documentation above.
