---
sidebar_position: 4
---

# Troubleshooting

This guide covers common issues you might encounter with Tiger Grades and their solutions. From installation problems to performance issues, we've got you covered.

## 🚨 Common Installation Issues

### Plugin Activation Errors

**Problem**: Plugin won't activate after installation
```
Fatal error: Cannot redeclare class...
```

**Solutions**:
1. **Check PHP version**: Ensure PHP 8.0 or higher
2. **Memory limit**: Increase to 256MB minimum
3. **Conflicting plugins**: Deactivate other gradebook plugins
4. **File permissions**: Ensure correct WordPress file permissions

```php
// wp-config.php adjustments
ini_set('memory_limit', '256M');
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### Database Migration Failures

**Problem**: Migration fails during activation
```
Database error: Table 'wp_tigr_classes' doesn't exist
```

**Solutions**:
1. **Check database permissions**: Ensure CREATE, ALTER privileges
2. **Verify database character set**: Should be utf8mb4
3. **Manual migration**: Run migrations via WP-CLI

```bash
# Check database permissions
wp db query "SHOW GRANTS FOR CURRENT_USER()"

# Run migration manually
wp tiger-grades migrate --confirm
```

## ☁️ Azure Integration Issues

### Authentication Failures

**Problem**: Azure authentication not working
```
AADSTS70011: The provided value for scope is not valid
```

**Solutions**:

1. **Verify Azure app registration**:
   - Redirect URI: `https://yoursite.com/wp-admin/admin-ajax.php`
   - API permissions: Microsoft Graph (Files.ReadWrite)
   - Grant admin consent

2. **Check environment variables**:
```php
// Verify in wp-config.php
define('TIGER_GRADES_AZURE_CLIENT_ID', 'your-client-id');
define('TIGER_GRADES_AZURE_CLIENT_SECRET', 'your-client-secret');
define('TIGER_GRADES_AZURE_TENANT_ID', 'your-tenant-id');
```

3. **Test connection**:
```bash
wp tiger-grades test-azure-connection
```

### Gradebook Creation Failures

**Problem**: Excel gradebooks not being created
```
Azure Function timeout: Request timed out after 30 seconds
```

**Solutions**:
1. **Check Azure Functions status**
2. **Verify OneDrive permissions**
3. **Monitor Azure Function logs**
4. **Increase timeout settings**

```php
// Increase Azure request timeout
add_filter('tiger_grades_azure_timeout', function($timeout) {
    return 60; // 60 seconds
});
```

## 🗄️ Database Issues

### Performance Problems

**Problem**: Slow query performance
```
WordPress database error: Query took 15.2 seconds
```

**Solutions**:

1. **Add missing indexes**:
```sql
-- Check for missing indexes
EXPLAIN SELECT * FROM wp_tigr_classes WHERE teacher_id = 123;

-- Add indexes if needed
ALTER TABLE wp_tigr_classes ADD INDEX idx_teacher_status (teacher_id, status);
ALTER TABLE wp_tigr_enrollments ADD INDEX idx_class_student (class_id, student_id);
```

2. **Optimize tables**:
```sql
OPTIMIZE TABLE wp_tigr_classes, wp_tigr_enrollments, wp_tigr_grades;
```

3. **Enable query caching**:
```php
// wp-config.php
define('WP_CACHE', true);
define('TIGER_GRADES_CACHE_TIMEOUT', 3600);
```

### Data Integrity Issues

**Problem**: Orphaned records in database
```
Foreign key constraint fails
```

**Solutions**:
1. **Find orphaned records**:
```sql
-- Check for orphaned enrollments
SELECT e.id, e.class_id 
FROM wp_tigr_enrollments e
LEFT JOIN wp_tigr_classes c ON e.class_id = c.id
WHERE c.id IS NULL;

-- Check for orphaned grades
SELECT g.id, g.student_id, g.class_id
FROM wp_tigr_grades g
LEFT JOIN wp_users u ON g.student_id = u.ID
WHERE u.ID IS NULL;
```

2. **Clean up orphaned data**:
```sql
-- Remove orphaned enrollments
DELETE e FROM wp_tigr_enrollments e
LEFT JOIN wp_tigr_classes c ON e.class_id = c.id
WHERE c.id IS NULL;

-- Remove orphaned grades
DELETE g FROM wp_tigr_grades g
LEFT JOIN wp_users u ON g.student_id = u.ID
WHERE u.ID IS NULL;
```

## 🔐 Permission Issues

### User Role Problems

**Problem**: Teachers can't access class management
```
Sorry, you are not allowed to access this page
```

**Solutions**:
1. **Verify user roles**:
```php
// Check user capabilities
$user = wp_get_current_user();
if (in_array('tiger_grades_teacher', $user->roles)) {
    // User has teacher role
}
```

2. **Reset user capabilities**:
```bash
wp tiger-grades reset-capabilities
```

3. **Manual role assignment**:
```php
// Add teacher role to user
$user = get_user_by('email', 'teacher@example.com');
$user->add_role('tiger_grades_teacher');
```

### File Permission Issues

**Problem**: Can't write to uploads directory
```
Warning: file_put_contents(): failed to open stream
```

**Solutions**:
```bash
# Set correct permissions
chmod 755 wp-content/uploads/
chmod 755 wp-content/uploads/tiger-grades/
chown www-data:www-data wp-content/uploads/tiger-grades/
```

## 📊 API Issues

### REST API Failures

**Problem**: API endpoints returning 404
```
The endpoint you are looking for does not exist
```

**Solutions**:
1. **Flush rewrite rules**:
```bash
wp rewrite flush
```

2. **Check permalink structure**:
```php
// Ensure pretty permalinks are enabled
if (!get_option('permalink_structure')) {
    update_option('permalink_structure', '/%postname%/');
}
```

3. **Verify API registration**:
```php
// Check if Tiger Grades routes are registered
$routes = rest_get_server()->get_routes();
if (isset($routes['/tiger-grades/v1'])) {
    // Routes are registered
}
```

### Authentication Token Issues

**Problem**: JWT tokens not working
```
Invalid token: Token has expired
```

**Solutions**:
1. **Check token expiration**:
```php
// Increase token lifetime
add_filter('tiger_grades_jwt_expiration', function($expiration) {
    return 24 * HOUR_IN_SECONDS; // 24 hours
});
```

2. **Verify secret key**:
```php
// Ensure JWT secret is defined
if (!defined('TIGER_GRADES_JWT_SECRET')) {
    define('TIGER_GRADES_JWT_SECRET', 'your-secret-key');
}
```

## 🎨 Frontend Issues

### Shortcode Display Problems

**Problem**: Shortcodes showing as plain text
```
[tiger_grades_teacher_dashboard] appears on page
```

**Solutions**:
1. **Check plugin activation**
2. **Verify shortcode registration**:
```php
// Test shortcode exists
if (shortcode_exists('tiger_grades_teacher_dashboard')) {
    echo "Shortcode is registered";
}
```

3. **Manual shortcode registration**:
```php
// Re-register shortcodes
do_action('tiger_grades_register_shortcodes');
```

### JavaScript Errors

**Problem**: Interactive features not working
```
Uncaught ReferenceError: tigerGrades is not defined
```

**Solutions**:
1. **Check script loading**:
```php
// Verify scripts are enqueued
add_action('wp_footer', function() {
    if (wp_script_is('tiger-grades-main', 'enqueued')) {
        echo "<!-- Tiger Grades scripts loaded -->";
    }
});
```

2. **Clear caching**:
```bash
# Clear all caches
wp cache flush
wp tiger-grades clear-cache
```

## 📱 Mobile Issues

### Responsive Design Problems

**Problem**: Tables not displaying properly on mobile
```
Horizontal scroll not working, content cut off
```

**Solutions**:
1. **Check CSS loading**:
```php
// Ensure responsive CSS is loaded
wp_enqueue_style('tiger-grades-responsive');
```

2. **Verify viewport meta tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Touch Interface Issues

**Problem**: Buttons not responding on touch devices

**Solutions**:
1. **Check touch event handlers**:
```javascript
// Ensure touch events are bound
document.addEventListener('touchstart', handleTouch, false);
```

2. **Update JavaScript libraries**:
```bash
wp tiger-grades update-assets
```

## 🔧 Performance Issues

### Slow Page Loading

**Problem**: Pages take more than 3 seconds to load

**Solutions**:
1. **Enable caching**:
```php
// wp-config.php
define('WP_CACHE', true);
define('TIGER_GRADES_CACHE_TIMEOUT', 3600);
```

2. **Optimize database queries**:
```php
// Enable query monitoring
define('SAVEQUERIES', true);

// Check slow queries
add_action('wp_footer', function() {
    if (current_user_can('manage_options') && defined('SAVEQUERIES')) {
        $queries = get_num_queries();
        $timer = timer_stop();
        echo "<!-- {$queries} queries in {$timer} seconds -->";
    }
});
```

3. **Optimize images and assets**:
```bash
# Compress Tiger Grades assets
wp tiger-grades optimize-assets
```

### Memory Limit Issues

**Problem**: White screen or memory limit errors
```
Fatal error: Allowed memory size exhausted
```

**Solutions**:
1. **Increase memory limit**:
```php
// wp-config.php
ini_set('memory_limit', '512M');
define('WP_MEMORY_LIMIT', '512M');
```

2. **Optimize code execution**:
```php
// Disable unnecessary features temporarily
add_filter('tiger_grades_enable_analytics', '__return_false');
add_filter('tiger_grades_enable_caching', '__return_true');
```

## 🛠️ Diagnostic Tools

### Debug Mode

Enable comprehensive debugging:
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('TIGER_GRADES_DEBUG', true);
```

### System Information

Get system information for support:
```bash
# Get system info
wp tiger-grades system-info

# Test all connections
wp tiger-grades test-connections

# Verify database integrity
wp tiger-grades verify-database
```

### Log Analysis

Check Tiger Grades logs:
```bash
# View recent errors
tail -f wp-content/debug.log | grep "Tiger Grades"

# Check Azure integration logs
wp tiger-grades logs --service=azure --lines=50

# View database query logs
wp tiger-grades logs --type=database --date=today
```

## 📞 Getting Help

### Before Contacting Support

1. **Enable debug mode** and reproduce the issue
2. **Check error logs** for specific error messages
3. **Test with default theme** and minimal plugins
4. **Document steps to reproduce** the issue
5. **Gather system information** using WP-CLI commands

### Information to Provide

- WordPress version
- PHP version
- Tiger Grades version
- Active plugins list
- Theme information
- Error messages (full text)
- Steps to reproduce
- System information output

### Emergency Recovery

If Tiger Grades causes site issues:

1. **Deactivate via FTP**:
```bash
# Rename plugin directory
mv wp-content/plugins/tiger-grades wp-content/plugins/tiger-grades-disabled
```

2. **Database cleanup**:
```sql
-- Disable Tiger Grades options
UPDATE wp_options SET option_value = '' WHERE option_name = 'active_plugins';
```

3. **Restore from backup**:
```bash
# Restore database backup
mysql -u username -p database_name < backup.sql
```

---

:::tip Quick Fix
Most Tiger Grades issues can be resolved by deactivating and reactivating the plugin, which re-runs the setup process.
:::

:::warning Support Priority
For production sites experiencing critical issues, use emergency recovery steps first, then investigate the root cause.
::: 