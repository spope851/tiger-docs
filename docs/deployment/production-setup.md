---
sidebar_position: 2
---

# Production Setup

This guide covers the complete setup process for deploying Tiger Grades in a production environment with optimal performance, security, and reliability.

## 🚀 Pre-Deployment Checklist

Before deploying Tiger Grades to production, ensure you have:

- [ ] **WordPress 6.0+** with proper security hardening
- [ ] **PHP 8.0+** with required extensions (curl, json, mbstring, openssl)
- [ ] **MySQL 8.0+** or **MariaDB 10.5+**
- [ ] **SSL certificate** installed and configured
- [ ] **Microsoft Azure account** with appropriate permissions
- [ ] **Backup system** in place
- [ ] **Monitoring tools** configured

## 🔐 Security Hardening

### WordPress Security Configuration

```php
// wp-config.php security settings
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('WP_AUTO_UPDATE_CORE', 'minor');

// Security keys - generate unique keys for production
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');
```

### File Permissions

Set proper file permissions for Tiger Grades:

```bash
# Plugin directory permissions
chmod 755 /wp-content/plugins/tiger-grades/
find /wp-content/plugins/tiger-grades/ -type d -exec chmod 755 {} \;
find /wp-content/plugins/tiger-grades/ -type f -exec chmod 644 {} \;

# Protect sensitive files
chmod 600 wp-config.php
chmod 644 .htaccess
```

### Database Security

```sql
-- Create dedicated database user for Tiger Grades
CREATE USER 'tiger_grades_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON wordpress_db.wp_tigr_* TO 'tiger_grades_user'@'localhost';
FLUSH PRIVILEGES;
```

## ☁️ Azure Production Configuration

### Azure App Registration

Create a production Azure app registration:

```bash
# Using Azure CLI
az ad app create \
  --display-name "Tiger Grades Production" \
  --available-to-other-tenants false \
  --reply-urls "https://yoursite.com/wp-admin/admin-ajax.php"
```

### Azure Functions Production Setup

```yaml
# azure-functions-production.yml
name: Deploy Azure Functions
trigger:
  branches:
    - main
  paths:
    - 'azure-functions/**'

variables:
  azureSubscription: 'Production-Service-Connection'
  functionAppName: 'tiger-grades-prod-functions'
  resourceGroupName: 'tiger-grades-production'

jobs:
- job: Deploy
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - task: AzureFunctionApp@1
    displayName: 'Deploy to Azure Functions'
    inputs:
      azureSubscription: $(azureSubscription)
      appType: functionApp
      appName: $(functionAppName)
      package: '$(Build.ArtifactStagingDirectory)/**/*.zip'
```

### Production Environment Variables

```php
// Production Azure configuration
define('TIGER_GRADES_AZURE_CLIENT_ID', 'your-production-client-id');
define('TIGER_GRADES_AZURE_CLIENT_SECRET', 'your-production-client-secret');
define('TIGER_GRADES_AZURE_TENANT_ID', 'your-production-tenant-id');
define('TIGER_GRADES_AZURE_FUNCTIONS_URL', 'https://tiger-grades-prod-functions.azurewebsites.net');
define('TIGER_GRADES_ENVIRONMENT', 'production');
```

## 🗄️ Database Production Setup

### Migration Strategy

```bash
#!/bin/bash
# production-migration.sh

# Backup existing database
mysqldump -u root -p wordpress_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Run Tiger Grades migrations
wp tiger-grades migrate --confirm --url=https://yoursite.com

# Verify migration success
wp tiger-grades verify-schema --url=https://yoursite.com
```

### Database Optimization

```sql
-- Optimize Tiger Grades tables for production
ALTER TABLE wp_tigr_classes 
ADD INDEX idx_teacher_status (teacher_id, status),
ADD INDEX idx_created_date (created_at);

ALTER TABLE wp_tigr_enrollments 
ADD INDEX idx_class_student (class_id, student_id),
ADD INDEX idx_enrollment_date (enrollment_date);

ALTER TABLE wp_tigr_grades 
ADD INDEX idx_student_class (student_id, class_id),
ADD INDEX idx_grade_date (grade_date);

-- Enable query cache
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 268435456; -- 256MB
```

## 🔧 Performance Optimization

### Caching Configuration

```php
// wp-config.php caching settings
define('WP_CACHE', true);
define('TIGER_GRADES_CACHE_TIMEOUT', 3600); // 1 hour

// Object cache configuration
define('WP_REDIS_HOST', 'localhost');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 2);
```

### CDN Setup

Configure CDN for Tiger Grades assets:

```php
// functions.php
add_filter('tiger_grades_asset_url', function($url) {
    if (defined('TIGER_GRADES_CDN_URL')) {
        return str_replace(site_url(), TIGER_GRADES_CDN_URL, $url);
    }
    return $url;
});
```

### Database Connection Pooling

```php
// wp-config.php
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Connection pooling settings
ini_set('mysql.connect_timeout', 60);
ini_set('default_socket_timeout', 60);
```

## 📊 Monitoring & Logging

### Application Performance Monitoring

```php
// Enable Tiger Grades performance monitoring
add_action('init', function() {
    if (defined('TIGER_GRADES_APM_ENABLED') && TIGER_GRADES_APM_ENABLED) {
        \TigerGrades\Utilities\PerformanceMonitor::init();
    }
});

// Custom logging configuration
define('TIGER_GRADES_LOG_LEVEL', 'WARNING');
define('TIGER_GRADES_LOG_FILE', '/var/log/tiger-grades.log');
```

### Health Check Endpoints

```php
// Custom health check for Tiger Grades
add_action('rest_api_init', function() {
    register_rest_route('tiger-grades/v1', '/health', [
        'methods' => 'GET',
        'callback' => function() {
            $health_data = [
                'status' => 'healthy',
                'timestamp' => current_time('mysql'),
                'database' => \TigerGrades\Repositories\DatabaseManager::health_check(),
                'azure' => \TigerGrades\Services\MicrosoftAuthService::health_check(),
                'cache' => wp_cache_get('tiger_grades_health') !== false
            ];
            
            return new WP_REST_Response($health_data, 200);
        },
        'permission_callback' => '__return_true'
    ]);
});
```

## 🚨 Error Handling & Recovery

### Automated Error Recovery

```php
// Auto-recovery for common issues
add_action('tiger_grades_api_error', function($error, $endpoint, $data) {
    if (strpos($error, 'authentication') !== false) {
        // Attempt to refresh Azure token
        \TigerGrades\Services\MicrosoftAuthService::refresh_token();
    }
    
    if (strpos($error, 'database') !== false) {
        // Log database errors for investigation
        error_log("Tiger Grades DB Error: {$error}");
        
        // Attempt to reconnect
        wp_cache_flush();
    }
}, 10, 3);
```

### Graceful Degradation

```php
// Fallback when Azure services are unavailable
add_filter('tiger_grades_azure_available', function($available) {
    if (!$available) {
        // Enable local gradebook mode
        update_option('tiger_grades_local_mode', true);
        
        // Notify administrators
        wp_mail(
            get_option('admin_email'),
            'Tiger Grades: Azure Services Unavailable',
            'Tiger Grades is operating in local mode due to Azure connectivity issues.'
        );
    }
    return $available;
});
```

## 🔄 Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# tiger-grades-backup.sh

BACKUP_DIR="/backups/tiger-grades"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u backup_user -p wordpress_db \
  --single-transaction \
  --routines \
  --triggers \
  --where="1 limit 1000000" > $BACKUP_DIR/db_$DATE.sql

# Backup plugin files
tar -czf $BACKUP_DIR/plugin_$DATE.tar.gz \
  /wp-content/plugins/tiger-grades/

# Backup uploaded files
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz \
  /wp-content/uploads/tiger-grades/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Backup Verification

```php
// Automated backup verification
wp_schedule_event(time(), 'daily', 'tiger_grades_verify_backup');

add_action('tiger_grades_verify_backup', function() {
    $backup_file = '/backups/tiger-grades/latest.sql';
    
    if (file_exists($backup_file)) {
        $file_age = time() - filemtime($backup_file);
        $max_age = 24 * 60 * 60; // 24 hours
        
        if ($file_age > $max_age) {
            // Alert administrators
            wp_mail(
                get_option('admin_email'),
                'Tiger Grades: Backup Alert',
                'Latest backup is older than 24 hours. Please check backup system.'
            );
        }
    }
});
```

## 🌐 Load Balancing & Scaling

### Multi-Server Setup

```nginx
# nginx load balancer configuration
upstream tiger_grades_backend {
    server web1.example.com:80 weight=3;
    server web2.example.com:80 weight=2;
    server web3.example.com:80 weight=1;
}

server {
    listen 443 ssl;
    server_name grades.example.com;
    
    location / {
        proxy_pass http://tiger_grades_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache Tiger Grades static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Session Sharing

```php
// Shared session configuration for multiple servers
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://redis-cluster.example.com:6379');

// Tiger Grades session configuration
define('TIGER_GRADES_SESSION_HANDLER', 'redis');
define('TIGER_GRADES_SESSION_REDIS_HOST', 'redis-cluster.example.com');
```

## 📈 Performance Metrics

### Key Performance Indicators

Monitor these metrics for Tiger Grades:

- **Response Time**: API endpoints should respond within 500ms
- **Database Query Time**: Tiger Grades queries should complete within 100ms
- **Azure Function Latency**: Gradebook creation should complete within 30 seconds
- **Cache Hit Rate**: Should maintain >90% cache hit rate
- **Error Rate**: Should stay below 0.1%

### Custom Metrics Dashboard

```php
// Export metrics for monitoring systems
add_action('rest_api_init', function() {
    register_rest_route('tiger-grades/v1', '/metrics', [
        'methods' => 'GET',
        'callback' => function() {
            global $wpdb;
            
            $metrics = [
                'active_classes' => $wpdb->get_var("SELECT COUNT(*) FROM wp_tigr_classes WHERE status = 'active'"),
                'total_enrollments' => $wpdb->get_var("SELECT COUNT(*) FROM wp_tigr_enrollments"),
                'recent_grades' => $wpdb->get_var("SELECT COUNT(*) FROM wp_tigr_grades WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)"),
                'azure_requests_today' => get_transient('tiger_grades_azure_requests') ?: 0,
                'cache_hit_rate' => \TigerGrades\Utilities\CacheManager::get_hit_rate(),
                'average_response_time' => \TigerGrades\Utilities\PerformanceMonitor::get_average_response_time()
            ];
            
            return new WP_REST_Response($metrics, 200);
        },
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
});
```

## 🔒 Security Compliance

### GDPR Compliance

```php
// GDPR data export handler
add_filter('wp_privacy_personal_data_exporters', function($exporters) {
    $exporters['tiger-grades'] = [
        'exporter_friendly_name' => 'Tiger Grades Data',
        'callback' => function($email_address) {
            $user = get_user_by('email', $email_address);
            
            if (!$user) {
                return ['data' => [], 'done' => true];
            }
            
            // Export Tiger Grades data
            $data = \TigerGrades\Utilities\GDPRManager::export_user_data($user->ID);
            
            return ['data' => $data, 'done' => true];
        }
    ];
    
    return $exporters;
});
```

### Security Audit Logging

```php
// Security event logging
add_action('tiger_grades_security_event', function($event, $user_id, $details) {
    $log_entry = [
        'timestamp' => current_time('mysql'),
        'event' => $event,
        'user_id' => $user_id,
        'ip_address' => $_SERVER['REMOTE_ADDR'],
        'details' => $details
    ];
    
    // Log to security file
    error_log(json_encode($log_entry), 3, '/var/log/tiger-grades-security.log');
    
    // Alert on critical events
    if (in_array($event, ['unauthorized_access', 'data_breach_attempt'])) {
        wp_mail(
            get_option('admin_email'),
            'Tiger Grades Security Alert',
            "Security event detected: {$event}"
        );
    }
}, 10, 3);
```

## 🚀 Deployment Checklist

### Pre-Launch Verification

- [ ] SSL certificate installed and tested
- [ ] Azure integration tested with production credentials
- [ ] Database migrations completed successfully
- [ ] Backup system tested and verified
- [ ] Performance benchmarks meet requirements
- [ ] Security scan completed with no critical issues
- [ ] Load testing passed with expected traffic
- [ ] Monitoring and alerting configured
- [ ] Documentation updated for production environment
- [ ] Team trained on production procedures

### Go-Live Process

1. **Maintenance Mode**: Enable maintenance mode
2. **Final Backup**: Create complete backup
3. **Deploy Code**: Deploy Tiger Grades to production
4. **Run Migrations**: Execute database migrations
5. **Test Core Functions**: Verify critical functionality
6. **Disable Maintenance**: Remove maintenance mode
7. **Monitor**: Watch for errors and performance issues
8. **Announce**: Notify users of new features

---

:::tip Production Ready
Following this guide ensures your Tiger Grades installation is production-ready with enterprise-grade security, performance, and reliability.
:::

:::warning Security Alert
Always test security configurations in a staging environment before applying to production.
::: 