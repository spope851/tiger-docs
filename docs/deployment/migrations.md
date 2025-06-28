---
sidebar_position: 3
---

# Database Migrations

Tiger Grades uses a sophisticated migration system to manage database schema changes across different environments. This guide covers everything you need to know about running, creating, and troubleshooting migrations.

## 🗄️ Migration System Overview

Tiger Grades migrations are SQL files that define database schema changes in a version-controlled manner. Each migration:

- **Creates or modifies database tables**
- **Adds or removes indexes and constraints**
- **Populates initial data**
- **Maintains referential integrity**
- **Tracks migration status**

## 📁 Migration File Structure

```
migrations/
├── tiger_grades.sql      # Main schema migration
├── pages.sql            # WordPress pages setup
├── seed.sql             # Initial data seeding
└── triggers/            # Database triggers
    ├── classes_triggers.sql
    └── enrollments_triggers.sql
```

## 🚀 Running Migrations

### Automatic Migrations (Recommended)

Tiger Grades automatically runs migrations during:

```php
// Plugin activation
register_activation_hook(__FILE__, 'tiger_grades_activate');

function tiger_grades_activate() {
    $migrator = new \TigerGrades\Utilities\MigrationManager();
    $migrator->run_migrations();
}
```

### Manual Migration Execution

For production deployments, run migrations manually:

```bash
# Using WP-CLI (recommended)
wp tiger-grades migrate --confirm

# With environment specification
wp tiger-grades migrate --env=production --confirm

# Dry run to preview changes
wp tiger-grades migrate --dry-run
```

### Via Admin Interface

Navigate to **Tiger Grades → System → Migrations** in WordPress admin:

1. Click **"Check for Migrations"**
2. Review pending migrations
3. Click **"Run Migrations"**
4. Verify completion status

## 📊 Core Schema Migration

### Main Tables Creation

The `tiger_grades.sql` migration creates the core database structure:

```sql
-- Classes table
CREATE TABLE IF NOT EXISTS wp_tigr_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id BIGINT(20) UNSIGNED NOT NULL,
    type_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    enrollment_code VARCHAR(6) UNIQUE,
    gradebook_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES wp_users(ID) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES wp_tigr_class_types(id) ON DELETE RESTRICT,
    
    INDEX idx_teacher_status (teacher_id, status),
    INDEX idx_enrollment_code (enrollment_code),
    INDEX idx_created_date (created_at)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS wp_tigr_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id BIGINT(20) UNSIGNED NOT NULL,
    parent_id BIGINT(20) UNSIGNED,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'declined', 'withdrawn') DEFAULT 'pending',
    notes TEXT,
    
    FOREIGN KEY (class_id) REFERENCES wp_tigr_classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES wp_users(ID) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES wp_users(ID) ON DELETE SET NULL,
    
    UNIQUE KEY unique_enrollment (class_id, student_id),
    INDEX idx_class_student (class_id, student_id),
    INDEX idx_enrollment_date (enrollment_date)
);

-- Grades table
CREATE TABLE IF NOT EXISTS wp_tigr_grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id BIGINT(20) UNSIGNED NOT NULL,
    category_id INT NOT NULL,
    assignment_name VARCHAR(255) NOT NULL,
    grade DECIMAL(5,2),
    max_points DECIMAL(5,2),
    grade_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (class_id) REFERENCES wp_tigr_classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES wp_users(ID) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES wp_tigr_categories(id) ON DELETE RESTRICT,
    
    INDEX idx_student_class (student_id, class_id),
    INDEX idx_grade_date (grade_date),
    INDEX idx_category (category_id)
);
```

### Reference Tables

```sql
-- Class types
CREATE TABLE IF NOT EXISTS wp_tigr_class_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3498db',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grade categories
CREATE TABLE IF NOT EXISTS wp_tigr_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 0.00,
    description TEXT,
    
    FOREIGN KEY (class_id) REFERENCES wp_tigr_classes(id) ON DELETE CASCADE,
    INDEX idx_class_weight (class_id, weight)
);

-- Settings table
CREATE TABLE IF NOT EXISTS wp_tigr_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    autoload ENUM('yes', 'no') DEFAULT 'no',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_autoload (autoload)
);
```

## 🔄 Database Triggers

### Automatic Status Updates

```sql
-- Update class status based on enrollments
DELIMITER $$
CREATE TRIGGER tr_update_class_status 
AFTER INSERT ON wp_tigr_enrollments
FOR EACH ROW
BEGIN
    DECLARE enrollment_count INT;
    
    SELECT COUNT(*) INTO enrollment_count
    FROM wp_tigr_enrollments
    WHERE class_id = NEW.class_id AND status = 'approved';
    
    -- Activate class when first student enrolls
    IF enrollment_count = 1 THEN
        UPDATE wp_tigr_classes
        SET status = 'active'
        WHERE id = NEW.class_id AND status = 'pending';
    END IF;
END$$

-- Update enrollment counts
CREATE TRIGGER tr_update_enrollment_count
AFTER INSERT ON wp_tigr_enrollments
FOR EACH ROW
BEGIN
    UPDATE wp_tigr_classes
    SET enrollment_count = (
        SELECT COUNT(*)
        FROM wp_tigr_enrollments
        WHERE class_id = NEW.class_id AND status = 'approved'
    )
    WHERE id = NEW.class_id;
END$$

DELIMITER ;
```

### Grade Validation Triggers

```sql
DELIMITER $$
CREATE TRIGGER tr_validate_grade
BEFORE INSERT ON wp_tigr_grades
FOR EACH ROW
BEGIN
    -- Validate grade is not negative
    IF NEW.grade < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Grade cannot be negative';
    END IF;
    
    -- Validate grade doesn't exceed max points
    IF NEW.grade > NEW.max_points THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Grade cannot exceed maximum points';
    END IF;
    
    -- Set grade date if not provided
    IF NEW.grade_date IS NULL THEN
        SET NEW.grade_date = CURDATE();
    END IF;
END$$

DELIMITER ;
```

## 🌱 Data Seeding

### Initial Data Population

The `seed.sql` migration populates essential data:

```sql
-- Insert default class types
INSERT IGNORE INTO wp_tigr_class_types (name, description, color) VALUES
('Mathematics', 'Math courses including algebra, geometry, calculus', '#e74c3c'),
('Science', 'Physics, chemistry, biology, and earth sciences', '#27ae60'),
('Language Arts', 'English, literature, writing, and communication', '#3498db'),
('Social Studies', 'History, geography, civics, and cultural studies', '#f39c12'),
('Arts', 'Visual arts, music, drama, and creative expression', '#9b59b6'),
('Physical Education', 'Sports, fitness, and health education', '#1abc9c'),
('Technology', 'Computer science, coding, and digital literacy', '#34495e'),
('World Languages', 'Foreign language instruction and cultural studies', '#e67e22');

-- Insert default grade categories
INSERT IGNORE INTO wp_tigr_categories (class_id, name, weight, description) 
SELECT 
    c.id,
    'Homework',
    20.00,
    'Daily assignments and practice problems'
FROM wp_tigr_classes c
WHERE NOT EXISTS (
    SELECT 1 FROM wp_tigr_categories 
    WHERE class_id = c.id AND name = 'Homework'
);

-- Insert system settings
INSERT IGNORE INTO wp_tigr_settings (setting_key, setting_value, autoload) VALUES
('tiger_grades_version', '0.1.1', 'yes'),
('default_grade_scale', '90,80,70,60', 'yes'),
('grade_letters', 'A,B,C,D,F', 'yes'),
('enable_parent_notifications', '1', 'yes'),
('azure_integration_enabled', '1', 'yes'),
('max_enrollment_per_class', '50', 'yes'),
('gradebook_template_version', '2.0', 'yes');
```

### WordPress Pages Setup

The `pages.sql` migration creates necessary WordPress pages:

```sql
-- Create Tiger Grades pages if they don't exist
INSERT IGNORE INTO wp_posts (
    post_title, 
    post_content, 
    post_status, 
    post_type, 
    post_name,
    post_date,
    post_date_gmt
) VALUES
('Teacher Dashboard', '[tiger_grades_teacher_dashboard]', 'publish', 'page', 'teacher-dashboard', NOW(), UTC_TIMESTAMP()),
('Parent Portal', '[tiger_grades_parent_classes]', 'publish', 'page', 'parent-portal', NOW(), UTC_TIMESTAMP()),
('Student Grades', '[tiger_grades_report_card]', 'publish', 'page', 'student-grades', NOW(), UTC_TIMESTAMP()),
('Class Enrollment', '[tiger_grades_enroll_class]', 'publish', 'page', 'enroll-class', NOW(), UTC_TIMESTAMP()),
('Register Class', '[tiger_grades_register_class]', 'publish', 'page', 'register-class', NOW(), UTC_TIMESTAMP());
```

## 🔧 Migration Management

### Version Tracking

Tiger Grades tracks migration versions in the database:

```php
class MigrationManager {
    private function get_migration_version() {
        return get_option('tiger_grades_migration_version', '0.0.0');
    }
    
    private function set_migration_version($version) {
        update_option('tiger_grades_migration_version', $version);
    }
    
    public function run_migrations() {
        $current_version = $this->get_migration_version();
        $migrations = $this->get_pending_migrations($current_version);
        
        foreach ($migrations as $migration) {
            $this->execute_migration($migration);
        }
    }
}
```

### Migration Rollback

```php
public function rollback_migration($version) {
    $rollback_file = TIGER_GRADES_PLUGIN_DIR . "migrations/rollback/{$version}.sql";
    
    if (file_exists($rollback_file)) {
        $this->execute_sql_file($rollback_file);
        $this->set_migration_version($this->get_previous_version($version));
        return true;
    }
    
    return false;
}
```

## 🚨 Troubleshooting Migrations

### Common Issues

#### Foreign Key Constraint Errors

```sql
-- Check for orphaned records before migration
SELECT 'Classes with invalid teacher_id' as issue, COUNT(*) as count
FROM wp_tigr_classes c
LEFT JOIN wp_users u ON c.teacher_id = u.ID
WHERE u.ID IS NULL

UNION ALL

SELECT 'Enrollments with invalid class_id' as issue, COUNT(*) as count
FROM wp_tigr_enrollments e
LEFT JOIN wp_tigr_classes c ON e.class_id = c.id
WHERE c.id IS NULL;
```

#### Duplicate Key Errors

```sql
-- Find duplicate enrollment codes
SELECT enrollment_code, COUNT(*) as duplicates
FROM wp_tigr_classes
WHERE enrollment_code IS NOT NULL
GROUP BY enrollment_code
HAVING COUNT(*) > 1;

-- Fix duplicate codes
UPDATE wp_tigr_classes
SET enrollment_code = CONCAT(enrollment_code, '_', id)
WHERE enrollment_code IN (
    SELECT enrollment_code
    FROM (
        SELECT enrollment_code
        FROM wp_tigr_classes
        GROUP BY enrollment_code
        HAVING COUNT(*) > 1
    ) as duplicates
);
```

#### Character Set Issues

```sql
-- Check table character sets
SELECT 
    TABLE_NAME,
    TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'your_database_name'
AND TABLE_NAME LIKE 'wp_tigr_%';

-- Convert to UTF8MB4 if needed
ALTER TABLE wp_tigr_classes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Migration Verification

```php
public function verify_migration($version) {
    $verification_tests = [
        'tables_exist' => $this->verify_tables_exist(),
        'foreign_keys' => $this->verify_foreign_keys(),
        'indexes' => $this->verify_indexes(),
        'triggers' => $this->verify_triggers(),
        'data_integrity' => $this->verify_data_integrity()
    ];
    
    return array_filter($verification_tests) === $verification_tests;
}
```

## 📊 Migration Monitoring

### Performance Monitoring

```php
public function execute_migration_with_monitoring($migration_file) {
    $start_time = microtime(true);
    $start_memory = memory_get_usage();
    
    try {
        $this->execute_sql_file($migration_file);
        $success = true;
    } catch (Exception $e) {
        $success = false;
        $error = $e->getMessage();
    }
    
    $execution_time = microtime(true) - $start_time;
    $memory_used = memory_get_usage() - $start_memory;
    
    // Log migration performance
    $this->log_migration_performance([
        'file' => $migration_file,
        'success' => $success,
        'execution_time' => $execution_time,
        'memory_used' => $memory_used,
        'error' => $error ?? null
    ]);
}
```

### Migration Logging

```php
public function log_migration_event($event, $details = []) {
    $log_entry = [
        'timestamp' => current_time('mysql'),
        'event' => $event,
        'details' => $details,
        'user_id' => get_current_user_id(),
        'environment' => defined('TIGER_GRADES_ENVIRONMENT') ? TIGER_GRADES_ENVIRONMENT : 'development'
    ];
    
    error_log(
        'Tiger Grades Migration: ' . json_encode($log_entry),
        3,
        WP_CONTENT_DIR . '/logs/tiger-grades-migrations.log'
    );
}
```

## 🎯 Best Practices

### Migration Development

1. **Test thoroughly** in development environment
2. **Use transactions** for complex migrations
3. **Include rollback procedures** for each migration
4. **Document breaking changes** in migration comments
5. **Backup before major migrations**

### Production Deployment

```bash
#!/bin/bash
# production-migration-script.sh

# Create backup before migration
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup_pre_migration_$(date +%Y%m%d_%H%M%S).sql

# Run migration with monitoring
wp tiger-grades migrate --env=production --confirm --verbose

# Verify migration success
if wp tiger-grades verify-migration; then
    echo "Migration completed successfully"
    # Clean up old backups (keep last 10)
    ls -t backup_pre_migration_*.sql | tail -n +11 | xargs rm -f
else
    echo "Migration verification failed"
    # Optionally rollback
    # wp tiger-grades rollback --confirm
    exit 1
fi
```

---

:::tip Migration Success
Always test migrations in a staging environment that mirrors production before deploying to live sites.
:::

:::warning Backup First
Never run migrations on production without a current backup. Database changes can be irreversible.
::: 