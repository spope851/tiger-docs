# Administrator Guide

Welcome to Tiger Grades administration! As a system administrator, you have comprehensive control over the Tiger Grades implementation, user management, system configuration, and institutional policies. This guide covers everything you need to effectively manage Tiger Grades for your educational organization.

## 🎯 Administrator Overview

As a Tiger Grades administrator, you can:
- **Manage system-wide settings and configurations**
- **Oversee user accounts and role assignments**
- **Monitor system performance and usage analytics**
- **Configure institutional policies and permissions**
- **Manage integrations and external services**
- **Handle technical support and troubleshooting**

## 🚀 Getting Started

### System Administration Dashboard

Your admin dashboard provides comprehensive system oversight:

1. **Access WordPress Admin** with administrator credentials
2. **Navigate to Tiger Grades** admin section
3. **Review system status** and recent activity
4. **Monitor key performance metrics**

### Initial System Setup

#### Post-Installation Configuration

**Step 1: Verify Installation**
```bash
# Check plugin activation
wp plugin list --status=active | grep tiger-grades

# Verify database tables
wp db query "SHOW TABLES LIKE 'wp_tigr_%'"

# Test API endpoints
curl -X GET "https://yoursite.com/wp-json/tiger-grades/v1/"
```

**Step 2: Configure Base Settings**
- Set institutional branding and themes
- Configure default user roles and permissions
- Establish grading policies and scales
- Set up notification templates

**Step 3: Microsoft Integration Setup**
- Configure Azure app registration
- Set up OneDrive integration
- Test authentication flows
- Verify API permissions

## 👥 User Management

### Role Configuration

Tiger Grades extends WordPress roles with education-specific capabilities:

#### Default Roles and Capabilities

**Administrator**
```
Capabilities:
- manage_tiger_settings
- manage_all_tiger_classes
- view_all_tiger_data
- manage_tiger_users
- access_tiger_analytics
- configure_tiger_integrations
```

**Teacher**
```
Capabilities:
- manage_tiger_classes (own)
- view_student_grades (enrolled)
- approve_enrollments
- generate_reports
- create_gradebooks
```

**Parent**
```
Capabilities:
- view_child_grades
- access_report_cards
- receive_notifications
- export_student_data
```

**Student**
```
Capabilities:
- view_own_grades
- access_own_reports
- view_assignment_feedback
```

### User Account Management

#### Bulk User Creation

```php
// Example bulk user import script
function import_users_from_csv($csv_file) {
    $users = array_map('str_getcsv', file($csv_file));
    
    foreach ($users as $user_data) {
        $user_id = wp_create_user(
            $user_data[0], // username
            wp_generate_password(),
            $user_data[1]  // email
        );
        
        if (!is_wp_error($user_id)) {
            $user = new WP_User($user_id);
            $user->set_role($user_data[2]); // role
            
            // Add Tiger Grades specific metadata
            update_user_meta($user_id, 'tiger_grades_id', $user_data[3]);
            update_user_meta($user_id, 'school_id', $user_data[4]);
        }
    }
}
```

#### User Permission Management

**Custom Capability Assignment:**
```php
// Add custom capabilities to existing roles
function add_tiger_grades_capabilities() {
    $teacher_role = get_role('teacher');
    $teacher_role->add_cap('manage_tiger_classes');
    $teacher_role->add_cap('approve_enrollments');
    
    $parent_role = get_role('parent');
    $parent_role->add_cap('view_child_grades');
    $parent_role->add_cap('receive_notifications');
}
```

## 🏫 Institutional Configuration

### School-Wide Settings

#### Grading Policies

**Configure Standard Grading Scales:**
```php
// Example grading scale configuration
$grading_scales = [
    'traditional' => [
        'A' => ['min' => 90, 'max' => 100],
        'B' => ['min' => 80, 'max' => 89],
        'C' => ['min' => 70, 'max' => 79],
        'D' => ['min' => 60, 'max' => 69],
        'F' => ['min' => 0, 'max' => 59]
    ],
    'standards_based' => [
        '4' => ['label' => 'Exceeds Standard'],
        '3' => ['label' => 'Meets Standard'],
        '2' => ['label' => 'Approaching Standard'],
        '1' => ['label' => 'Below Standard']
    ]
];
```

#### Class Type Management

**Configure Available Subjects:**
```sql
-- Add new class types
INSERT INTO wp_tigr_class_types (title, image) VALUES
('Computer Science', 1234),
('Music', 1235),
('Drama', 1236),
('Health', 1237);

-- Update existing class types
UPDATE wp_tigr_class_types 
SET image = 1240 
WHERE title = 'Science';
```

#### Capacity and Range Settings

**Configure Class Size Options:**
```sql
-- Student capacity ranges
INSERT INTO wp_tigr_range_options (label, min, max, status) VALUES
('Extra Small (1-5)', 1, 5, 'active'),
('Small (6-15)', 6, 15, 'active'),
('Medium (16-25)', 16, 25, 'active'),
('Large (26-35)', 26, 35, 'active'),
('Extra Large (36+)', 36, NULL, 'active');
```

### Feature Flag Management

Control system features and access:

```sql
-- Feature flag configuration
INSERT INTO wp_tigr_feature_lookup (title, description, status) VALUES
('advanced_analytics', 'Enable advanced grade analytics', 'active'),
('parent_messaging', 'Allow direct parent-teacher messaging', 'active'),
('mobile_app_access', 'Enable mobile app integration', 'inactive'),
('ai_recommendations', 'Enable AI-powered recommendations', 'beta');
```

## 📊 System Monitoring and Analytics

### Performance Monitoring

#### Database Performance

```sql
-- Monitor table sizes and growth
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length,
    (data_length + index_length) as total_size
FROM information_schema.tables 
WHERE table_schema = 'your_database' 
AND table_name LIKE 'wp_tigr_%';

-- Check for slow queries
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;
```

#### API Usage Analytics

```php
// Monitor API usage
function track_api_usage($endpoint, $user_id, $response_time) {
    global $wpdb;
    
    $wpdb->insert(
        $wpdb->prefix . 'tigr_api_logs',
        [
            'endpoint' => $endpoint,
            'user_id' => $user_id,
            'response_time' => $response_time,
            'timestamp' => current_time('mysql')
        ]
    );
}
```

### Usage Analytics

#### System-Wide Statistics

**Generate Usage Reports:**
```php
function generate_usage_report() {
    global $wpdb;
    
    $stats = [
        'total_classes' => $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}tigr_classes"),
        'active_classes' => $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}tigr_classes WHERE status = 'active'"),
        'total_enrollments' => $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}tigr_enrollments"),
        'approved_enrollments' => $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}tigr_enrollments WHERE status = 'approved'"),
        'total_teachers' => count_users()['teacher'],
        'total_parents' => count_users()['parent']
    ];
    
    return $stats;
}
```

#### Grade Analytics

**System-Wide Grade Analysis:**
```sql
-- Average grades by subject
SELECT 
    ct.title as subject,
    AVG(grade_percentage) as avg_grade,
    COUNT(*) as total_grades
FROM wp_tigr_classes c
JOIN wp_tigr_class_types ct ON c.type = ct.id
JOIN grade_data gd ON c.id = gd.class_id
GROUP BY ct.title;
```

## 🔧 Technical Administration

### Microsoft Integration Management

#### Azure Configuration Monitoring

```php
// Check Azure integration health
function check_azure_integration() {
    $auth_service = new MicrosoftAuthService('tigr_graph_api');
    
    $health_check = [
        'token_valid' => $auth_service->isTokenValid(),
        'onedrive_accessible' => test_onedrive_access(),
        'functions_responding' => test_azure_functions(),
        'permissions_granted' => check_graph_permissions()
    ];
    
    return $health_check;
}
```

#### OneDrive Storage Management

```php
// Monitor OneDrive usage
function get_onedrive_usage() {
    $graph_api = new GraphAPIClient();
    $drive_info = $graph_api->getDriveInfo();
    
    return [
        'total_space' => $drive_info->quota->total,
        'used_space' => $drive_info->quota->used,
        'remaining_space' => $drive_info->quota->remaining,
        'file_count' => count($graph_api->getFiles('/Tiger Grades'))
    ];
}
```

### Database Administration

#### Migration Management

```php
// Handle database migrations
class TigerGradesMigrationManager {
    public static function run_pending_migrations() {
        $current_version = get_option('tiger_grades_db_version', '0.0.0');
        $target_version = TIGER_GRADES_VERSION;
        
        if (version_compare($current_version, $target_version, '<')) {
            self::execute_migrations($current_version, $target_version);
            update_option('tiger_grades_db_version', $target_version);
        }
    }
}
```

#### Backup and Recovery

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/tiger-grades"

# Database backup
wp db export "$BACKUP_DIR/tiger_grades_$DATE.sql" --tables=$(wp db query "SHOW TABLES LIKE 'wp_tigr_%'" --skip-column-names | tr '\n' ',')

# OneDrive backup (via Azure CLI)
az storage blob upload-batch --destination "backups/tiger-grades/$DATE" --source "/onedrive/Tiger Grades" --account-name "schoolstorage"
```

## 🔐 Security Administration

### Access Control Management

#### Security Audit

```php
// Security audit functions
function audit_user_permissions() {
    $users = get_users();
    $audit_report = [];
    
    foreach ($users as $user) {
        $user_caps = $user->get_role_caps();
        $tiger_caps = array_filter($user_caps, function($cap) {
            return strpos($cap, 'tiger_') === 0;
        }, ARRAY_FILTER_USE_KEY);
        
        if (!empty($tiger_caps)) {
            $audit_report[] = [
                'user_id' => $user->ID,
                'username' => $user->user_login,
                'role' => $user->roles[0],
                'tiger_capabilities' => array_keys($tiger_caps)
            ];
        }
    }
    
    return $audit_report;
}
```

#### Data Privacy Compliance

**GDPR/FERPA Compliance Tools:**
```php
// Data export for privacy requests
function export_user_data($user_id) {
    global $wpdb;
    
    $user_data = [
        'classes' => $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}tigr_classes WHERE teacher = %d", $user_id
        )),
        'enrollments' => $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}tigr_enrollments WHERE user_id = %d", $user_id
        )),
        'grades' => get_user_grade_data($user_id)
    ];
    
    return $user_data;
}

// Data deletion for privacy requests
function delete_user_data($user_id) {
    // Anonymize rather than delete for educational records
    anonymize_user_records($user_id);
}
```

### System Security

#### Security Headers Configuration

```apache
# Apache .htaccess security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), camera=(), microphone=()"
</IfModule>
```

## 📈 System Optimization

### Performance Tuning

#### Caching Configuration

```php
// Advanced caching strategies
function optimize_tiger_grades_caching() {
    // Object caching for frequently accessed data
    wp_cache_set_multiple([
        'tigr_class_types' => get_all_class_types(),
        'tigr_range_options' => get_all_range_options(),
        'tigr_feature_flags' => get_active_features()
    ], 'tiger_grades', HOUR_IN_SECONDS);
    
    // Page caching exclusions
    if (function_exists('wp_cache_add_non_persistent_groups')) {
        wp_cache_add_non_persistent_groups(['tiger_grades_dynamic']);
    }
}
```

#### Database Optimization

```sql
-- Index optimization
CREATE INDEX idx_tigr_classes_teacher_status ON wp_tigr_classes(teacher, status);
CREATE INDEX idx_tigr_enrollments_class_status ON wp_tigr_enrollments(class_id, status);
CREATE INDEX idx_tigr_enrollments_user_status ON wp_tigr_enrollments(user_id, status);

-- Table maintenance
OPTIMIZE TABLE wp_tigr_classes, wp_tigr_enrollments, wp_tigr_class_types;
ANALYZE TABLE wp_tigr_classes, wp_tigr_enrollments, wp_tigr_class_types;
```

### Scalability Planning

#### Multi-Site Configuration

```php
// Network-wide settings for multisite
function configure_multisite_tiger_grades() {
    if (is_multisite()) {
        // Share user tables across sites
        define('TIGER_GRADES_SHARED_USERS', true);
        
        // Central reporting database
        define('TIGER_GRADES_CENTRAL_DB', 'central_reporting');
        
        // Site-specific configurations
        $site_configs = get_site_option('tiger_grades_site_configs', []);
    }
}
```

## 🛠️ Troubleshooting and Support

### Common Administrative Issues

#### Database Connection Issues

```php
// Database health check
function check_database_health() {
    global $wpdb;
    
    $health_status = [
        'connection' => $wpdb->check_connection(),
        'tables_exist' => check_required_tables(),
        'indexes_valid' => verify_database_indexes(),
        'foreign_keys' => check_foreign_key_constraints()
    ];
    
    return $health_status;
}
```

#### Microsoft Integration Problems

**Common Resolution Steps:**
1. Verify Azure app registration settings
2. Check client secret expiration
3. Validate redirect URIs
4. Test Graph API permissions
5. Review authentication flow logs

#### Performance Issues

**Diagnostic Queries:**
```sql
-- Find slow queries
SELECT query_time, lock_time, rows_sent, sql_text 
FROM mysql.slow_log 
WHERE sql_text LIKE '%tigr_%' 
ORDER BY query_time DESC 
LIMIT 10;

-- Check table locks
SHOW OPEN TABLES WHERE in_use > 0;
```

### Support Tools

#### Debug Information Collection

```php
// Comprehensive debug info
function collect_debug_info() {
    return [
        'plugin_version' => TIGER_GRADES_VERSION,
        'wordpress_version' => get_bloginfo('version'),
        'php_version' => PHP_VERSION,
        'mysql_version' => $GLOBALS['wpdb']->db_version(),
        'active_plugins' => get_option('active_plugins'),
        'theme_info' => wp_get_theme(),
        'server_info' => $_SERVER,
        'tiger_grades_settings' => get_tiger_grades_settings(),
        'azure_integration' => check_azure_integration(),
        'database_health' => check_database_health()
    ];
}
```

## 📋 Maintenance Procedures

### Regular Maintenance Tasks

#### Weekly Tasks
- [ ] Review system performance metrics
- [ ] Check error logs for issues
- [ ] Verify backup completion
- [ ] Monitor OneDrive storage usage
- [ ] Review user account activity

#### Monthly Tasks
- [ ] Update plugin and dependencies
- [ ] Clean up old log files
- [ ] Analyze usage patterns
- [ ] Review security audit logs
- [ ] Optimize database tables

#### Quarterly Tasks
- [ ] Comprehensive security audit
- [ ] Performance optimization review
- [ ] User training assessment
- [ ] System capacity planning
- [ ] Documentation updates

### Emergency Procedures

#### System Recovery

```bash
# Emergency restoration procedure
#!/bin/bash

# 1. Restore database from backup
wp db import latest_backup.sql

# 2. Restore OneDrive files
az storage blob download-batch --destination "/onedrive/Tiger Grades" --source "backups/latest" --account-name "schoolstorage"

# 3. Clear all caches
wp cache flush
wp transient delete-all

# 4. Verify system functionality
wp eval "echo 'System check: ' . (check_system_health() ? 'PASS' : 'FAIL');"
```

---

## 🆘 Getting Support

**Technical Resources:**
- [Developer Documentation](/docs/developer-guide/architecture)
- [Troubleshooting Guide](/docs/deployment/troubleshooting)
- [API Reference](/docs/developer-guide/api-reference)

**Support Channels:**
- Priority technical support for administrators
- Direct developer contact for critical issues
- Community forums for best practices
- Professional services for custom implementations

**Training and Certification:**
- Administrator certification program
- Advanced technical workshops
- Best practices webinars
- Case study sharing sessions

---

As a Tiger Grades administrator, you play a crucial role in ensuring the system runs smoothly and serves your educational community effectively. This comprehensive approach to system administration ensures reliable, secure, and scalable operation of Tiger Grades across your institution. 🏫🔧 