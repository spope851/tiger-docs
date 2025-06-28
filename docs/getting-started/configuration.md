# Configuration Guide

Once Tiger Grades is installed, you'll need to configure it for your specific educational environment. This guide walks through the essential setup steps to get your system ready for teachers, parents, and students.

## 🎯 Initial Setup Checklist

Before diving into detailed configuration, complete these essential steps:

- [ ] Verify database migration completed successfully
- [ ] Configure user roles and permissions
- [ ] Set up class types and categories
- [ ] Configure Microsoft Azure integration (if applicable)
- [ ] Test basic functionality with sample data
- [ ] Set up enrollment workflows

## 👥 User Role Configuration

Tiger Grades extends WordPress's user system with education-specific roles:

### Default Roles

**Administrator**
- Full system access
- Can manage all classes and users
- Access to system configuration

**Teacher**
- Create and manage own classes
- View enrolled students
- Generate report cards
- Manage class enrollments

**Parent**
- View children's classes and grades
- Access report cards
- Receive progress notifications

**Student**
- View own grades and assignments
- Access personal report cards
- Track academic progress

### Assigning Roles

```php
// Programmatically assign teacher role
$user_id = 123;
$user = new WP_User($user_id);
$user->set_role('teacher');

// Add specific capabilities
$user->add_cap('manage_tiger_classes');
$user->add_cap('view_student_grades');
```

### Custom Capabilities

Tiger Grades adds these capabilities:

- `manage_tiger_classes` - Create and edit classes
- `view_student_grades` - Access grade information
- `approve_enrollments` - Approve student enrollment requests
- `generate_reports` - Create and export report cards
- `manage_tiger_settings` - Configure system settings

## 🏫 Class Type Configuration

Set up the subjects and class types available in your system:

### Default Class Types

Tiger Grades comes with these pre-configured class types:

1. **English** - Language arts and literature
2. **History** - Social studies and history
3. **Science** - General science courses
4. **Math** - Mathematics and algebra
5. **Foreign Language** - World language courses
6. **Art** - Visual and performing arts
7. **Chinese** - Mandarin language courses
8. **PE** - Physical education

### Adding Custom Class Types

Navigate to the database or use the admin interface to add new class types:

```sql
INSERT INTO wp_tigr_class_types (title, image) 
VALUES ('Computer Science', 1234);
```

Or use the WordPress admin:
1. Go to `Tiger Grades > Class Types`
2. Click "Add New Class Type"
3. Enter title and upload subject image
4. Save changes

### Class Configuration Options

Each class supports these configuration options:

**Basic Information**
- Class title and description
- Start and end dates
- Subject type and category
- Teacher assignment

**Enrollment Settings**
- Maximum student capacity
- Enrollment code generation
- Approval workflow (automatic/manual)
- Parent notification settings

**Grading Configuration**
- Number of grading categories
- Category weighting system
- Grade scale (percentage, letter, custom)
- Progress tracking intervals

## 📊 Grading System Setup

Configure how grades are calculated and displayed:

### Category Configuration

Set up grading categories for different assignment types:

```php
// Example category configuration
$categories = [
    'homework' => ['weight' => 20, 'label' => 'Homework'],
    'quizzes' => ['weight' => 25, 'label' => 'Quizzes'],
    'tests' => ['weight' => 35, 'label' => 'Tests'],
    'projects' => ['weight' => 20, 'label' => 'Projects']
];
```

### Range Options

Configure student capacity and category ranges:

```sql
-- Student capacity ranges
INSERT INTO wp_tigr_range_options (label, min, max, status) VALUES
('Small Class (1-10)', 1, 10, 'active'),
('Medium Class (11-25)', 11, 25, 'active'),
('Large Class (26-40)', 26, 40, 'active');

-- Category count ranges
INSERT INTO wp_tigr_range_options (label, min, max, status) VALUES
('Few Categories (1-5)', 1, 5, 'active'),
('Standard Categories (6-10)', 6, 10, 'active'),
('Many Categories (11-15)', 11, 15, 'active');
```

### Grade Calculation Rules

Configure how final grades are calculated:

- **Weighted Average**: Categories have different importance
- **Point-Based**: Total points earned vs. total possible
- **Standards-Based**: Proficiency levels on learning objectives
- **Custom Formula**: Define your own calculation method

## ☁️ Microsoft Integration Setup

For full gradebook functionality, configure Microsoft 365 integration:

### Azure Application Settings

1. **Tenant Configuration**
   ```php
   // wp-config.php
   define('TIGER_GRADES_AZURE_TENANT_ID', 'your-tenant-id');
   define('TIGER_GRADES_AZURE_AUTHORITY', 'https://login.microsoftonline.com/your-tenant-id');
   ```

2. **Application Registration**
   ```php
   define('TIGER_GRADES_AZURE_CLIENT_ID', 'your-client-id');
   define('TIGER_GRADES_AZURE_CLIENT_SECRET', 'your-client-secret');
   define('TIGER_GRADES_AZURE_REDIRECT_URI', 'https://yoursite.com/tiger-grades/auth/callback');
   ```

3. **Graph API Permissions**
   - `Files.ReadWrite.All` - Access OneDrive files
   - `User.Read` - Read user profile
   - `Directory.Read.All` - Read directory data

### OneDrive Integration

Configure automatic gradebook creation and synchronization:

1. **Gradebook Template Setup**
   - Create master gradebook template in OneDrive
   - Configure category columns and formulas
   - Set sharing permissions for teachers

2. **Automatic File Creation**
   - Enable automatic gradebook creation for new classes
   - Configure naming conventions
   - Set default folder structure

3. **Sync Settings**
   - Configure sync frequency (real-time, hourly, daily)
   - Set conflict resolution rules
   - Enable automatic backup creation

## 🔐 Security Configuration

Implement proper security measures for your educational data:

### Authentication Settings

```php
// JWT Token Configuration
define('TIGER_GRADES_JWT_SECRET', 'your-secure-secret-key');
define('TIGER_GRADES_JWT_EXPIRY', 3600); // 1 hour

// Session Configuration
define('TIGER_GRADES_SESSION_TIMEOUT', 7200); // 2 hours
define('TIGER_GRADES_REQUIRE_2FA', false); // Enable for high security
```

### Data Protection

- **GDPR Compliance**: Enable data export and deletion tools
- **Access Logging**: Track user access to sensitive data
- **Encryption**: Encrypt sensitive data at rest
- **Backup Security**: Secure backup storage and access

### Permission Boundaries

Configure fine-grained permission controls:

```php
// Example permission configuration
$permissions = [
    'teacher' => [
        'view_own_classes' => true,
        'edit_own_classes' => true,
        'view_all_classes' => false,
        'manage_enrollments' => true
    ],
    'parent' => [
        'view_child_grades' => true,
        'edit_child_info' => false,
        'contact_teachers' => true,
        'export_reports' => true
    ]
];
```

## 📱 User Interface Configuration

Customize the user experience for different roles:

### Dashboard Customization

**Teacher Dashboard**
- Class overview widgets
- Recent grade entries
- Pending enrollment approvals
- Quick action buttons

**Parent Dashboard**
- Children's grade summaries
- Recent progress updates
- Upcoming assignments
- Communication center

**Student Dashboard**
- Current grades and progress
- Assignment calendar
- Achievement tracking
- Goal setting tools

### Theme Integration

Configure how Tiger Grades integrates with your WordPress theme:

```css
/* Custom styling for Tiger Grades components */
:root {
    --tiger-primary-color: #ff6b35;
    --tiger-secondary-color: #004e89;
    --tiger-success-color: #2d5016;
    --tiger-warning-color: #ffa500;
    --tiger-error-color: #dc3545;
}

.tiger-grades-container {
    font-family: var(--wp-font-family, inherit);
    color: var(--wp-text-color, #333);
}
```

## 📧 Notification Configuration

Set up automated notifications for key events:

### Email Notifications

Configure when and how users receive email updates:

- **Grade Posted**: Notify parents when new grades are entered
- **Progress Reports**: Weekly/monthly progress summaries
- **Enrollment Updates**: Approval/rejection notifications
- **System Alerts**: Important system announcements

### Notification Templates

Customize email templates for your organization:

```php
// Example email template configuration
$email_templates = [
    'grade_posted' => [
        'subject' => 'New Grade Posted for {student_name}',
        'template' => 'grade-notification.php',
        'variables' => ['student_name', 'class_name', 'assignment_name', 'grade']
    ],
    'enrollment_approved' => [
        'subject' => 'Enrollment Approved for {class_name}',
        'template' => 'enrollment-approved.php',
        'variables' => ['student_name', 'class_name', 'teacher_name', 'start_date']
    ]
];
```

## 🔧 Advanced Configuration

For advanced users and larger deployments:

### Performance Optimization

```php
// Performance settings
define('TIGER_GRADES_CACHE_ENABLED', true);
define('TIGER_GRADES_CACHE_DURATION', 3600);
define('TIGER_GRADES_LAZY_LOAD_IMAGES', true);
define('TIGER_GRADES_MINIFY_CSS', true);
```

### Multi-Site Configuration

For WordPress multisite networks:

```php
// Network-wide settings
define('TIGER_GRADES_NETWORK_MODE', true);
define('TIGER_GRADES_SHARED_USERS', true);
define('TIGER_GRADES_CENTRAL_REPORTING', true);
```

### API Configuration

Configure REST API access and rate limiting:

```php
// API settings
define('TIGER_GRADES_API_ENABLED', true);
define('TIGER_GRADES_API_RATE_LIMIT', 100); // requests per hour
define('TIGER_GRADES_API_REQUIRE_AUTH', true);
```

## ✅ Configuration Verification

After completing setup, verify your configuration:

### System Health Check

1. **Database Integrity**
   - Run `wp eval "TigerGrades_HealthCheck::database()"`
   - Verify all tables exist and have proper indexes

2. **API Connectivity**
   - Test Microsoft Graph API connection
   - Verify authentication flows work

3. **Permission Testing**
   - Test each user role's access levels
   - Verify security boundaries are enforced

4. **Performance Baseline**
   - Run performance tests with sample data
   - Check page load times and query efficiency

### Test Data Setup

Create test data to verify functionality:

```php
// Create test teacher
$teacher_id = wp_create_user('teacher_test', 'secure_password', 'teacher@school.edu');
$teacher = new WP_User($teacher_id);
$teacher->set_role('teacher');

// Create test class
$class_data = [
    'teacher' => $teacher_id,
    'title' => 'Test Mathematics Class',
    'type' => 4, // Math class type
    'num_students' => 5, // 1-10 range
    'num_categories' => 5, // 1-5 range
    'start_date' => date('Y-m-d'),
    'end_date' => date('Y-m-d', strtotime('+6 months'))
];
```

## 📈 Next Steps

With configuration complete, you're ready to:

1. [Set Up Your First Class](/docs/getting-started/first-setup)
2. [Train Teachers on the System](/docs/user-guides/teachers)
3. [Configure Parent Access](/docs/user-guides/parents)
4. [Monitor System Performance](/docs/deployment/troubleshooting)

---

Your Tiger Grades system is now configured and ready for educational excellence! 🎓 