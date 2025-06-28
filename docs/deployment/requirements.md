---
sidebar_position: 1
---

# System Requirements 📋

Tiger Grades has been designed to work seamlessly across various hosting environments while maintaining optimal performance and security. This guide outlines the complete system requirements for successful deployment and operation.

## 🎯 Overview

Tiger Grades deployment requires:

- **WordPress Environment** with specific version requirements
- **PHP Configuration** optimized for educational data processing
- **Database System** capable of handling relational grade data
- **Microsoft Azure Integration** for cloud functionality
- **SSL/HTTPS** for secure data transmission
- **Caching System** for optimal performance

## 🌐 WordPress Requirements

### Core WordPress

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| **WordPress Version** | 6.8+ | Latest stable | Required for REST API features |
| **PHP Version** | 7.2+ | 8.0+ | Higher versions improve performance |
| **MySQL Version** | 5.7+ | 8.0+ | Required for JSON column support |
| **Web Server** | Apache 2.4+ / Nginx 1.18+ | Latest stable | With URL rewriting support |

### WordPress Configuration

**Memory Limit:**
```php
// wp-config.php or php.ini
ini_set('memory_limit', '512M'); // Minimum 256M, recommended 512M+
```

**File Upload Limits:**
```php
// For gradebook file handling
ini_set('upload_max_filesize', '32M');
ini_set('post_max_size', '32M');
```

**Execution Time:**
```php
// For Azure API calls and data processing
ini_set('max_execution_time', 120);
```

### Required WordPress Features

**Permalink Structure:**
- Must support custom post types and pretty permalinks
- Recommended: `/%postname%/` or custom structure

**User Roles & Capabilities:**
```php
// Tiger Grades extends default WordPress roles
$roles_required = [
    'administrator', // Full system access
    'editor',        // Teacher capabilities
    'subscriber'     // Parent/student access
];
```

## 🖥️ Server Requirements

### PHP Configuration

**Essential PHP Extensions:**
```bash
# Required extensions
php-curl     # Microsoft Graph API communication
php-json     # JSON data processing
php-mbstring # Unicode string handling
php-mysql    # Database connectivity
php-xml      # XML parsing for Office integration
php-zip      # File compression/decompression
php-gd       # Image processing (optional)
```

**Memory & Processing:**
```ini
; php.ini configuration
memory_limit = 512M
max_execution_time = 120
max_input_vars = 3000
upload_max_filesize = 32M
post_max_size = 32M
```

### Database Requirements

**MySQL/MariaDB Configuration:**
```sql
-- Minimum requirements
-- MySQL 5.7+ or MariaDB 10.3+
-- InnoDB storage engine (default)
-- UTF8MB4 character set support

-- Recommended settings
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL query_cache_size = 128M;
SET GLOBAL max_connections = 200;
```

**Database Permissions:**
```sql
-- Required privileges for Tiger Grades user
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP 
ON tiger_grades_db.* TO 'tigr_user'@'localhost';
```

### Web Server Configuration

**Apache (.htaccess):**
```apache
# Required Apache modules
# mod_rewrite (URL rewriting)
# mod_ssl (HTTPS support)
# mod_headers (HTTP headers)

# Recommended configuration
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Tiger Grades API endpoints
    RewriteRule ^wp-json/tiger-grades/(.*)$ /wp-json/tiger-grades/$1 [QSA,L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration (required)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # PHP-FPM configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Increased timeouts for Tiger Grades operations
        fastcgi_read_timeout 120;
        fastcgi_send_timeout 120;
    }
    
    # WordPress permalinks
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    # Tiger Grades API
    location ~ ^/wp-json/tiger-grades/ {
        try_files $uri $uri/ /index.php?$args;
    }
}
```

## ☁️ Microsoft Azure Requirements

### Azure App Registration

**Required API Permissions:**
```json
{
  "requiredResourceAccess": [
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAccess": [
        {
          "id": "Files.ReadWrite",
          "type": "Scope"
        },
        {
          "id": "Sites.ReadWrite.All", 
          "type": "Scope"
        },
        {
          "id": "User.Read",
          "type": "Scope"
        }
      ]
    }
  ]
}
```

**Environment Variables:**
```bash
# Required Azure configuration
MSFT_TENANT_ID=your-tenant-id
MSFT_CLIENT_ID=your-client-id
MSFT_CLIENT_SECRET=your-client-secret
MSFT_USER_ID=teacher-user-id
```

### Azure Functions (Optional)

For advanced gradebook automation:

**Runtime Requirements:**
- Node.js 18+ or Python 3.9+
- Azure Functions Core Tools 4.x
- Azure CLI 2.0+

**Configuration:**
```json
{
  "version": "2.0",
  "functionTimeout": "00:05:00",
  "extensions": {
    "http": {
      "routePrefix": "api"
    }
  }
}
```

## 🔒 Security Requirements

### SSL/TLS Configuration

**Required:**
- Valid SSL certificate (Let's Encrypt, commercial, or enterprise)
- TLS 1.2 minimum (TLS 1.3 recommended)
- HTTPS redirect for all traffic

**WordPress Security:**
```php
// wp-config.php
define('FORCE_SSL_ADMIN', true);
define('SECURE_AUTH_COOKIE', true);

// Security headers
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src \'self\'');
```

### Authentication & Authorization

**WordPress Security Plugins (Recommended):**
- Wordfence Security
- Sucuri Security
- iThemes Security

**Password Policy:**
```php
// Recommended minimum requirements
$password_requirements = [
    'min_length' => 12,
    'require_uppercase' => true,
    'require_lowercase' => true,
    'require_numbers' => true,
    'require_symbols' => true
];
```

## 📈 Performance Requirements

### Caching System

**Object Caching (Recommended):**
```php
// Redis configuration
$redis_config = [
    'host' => '127.0.0.1',
    'port' => 6379,
    'timeout' => 1,
    'retry_interval' => 100
];

// Memcached alternative
$memcached_config = [
    'servers' => [
        ['127.0.0.1', 11211, 1]
    ]
];
```

**Page Caching:**
- W3 Total Cache, WP Rocket, or LiteSpeed Cache
- Static file caching for CSS/JS assets
- CDN integration for global performance

### Database Optimization

**Recommended MySQL Configuration:**
```ini
[mysqld]
# InnoDB settings for Tiger Grades
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1

# Query optimization
query_cache_type = 1
query_cache_size = 128M
tmp_table_size = 64M
max_heap_table_size = 64M
```

## 🌍 Production Environment

### Server Specifications

**Minimum Requirements:**
- **CPU**: 2 cores, 2.4GHz
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Bandwidth**: 100Mbps

**Recommended Specifications:**
- **CPU**: 4+ cores, 3.0GHz+
- **RAM**: 8GB+
- **Storage**: 50GB+ NVMe SSD
- **Bandwidth**: 1Gbps

### Load Balancing (High Traffic)

**Nginx Load Balancer:**
```nginx
upstream tiger_grades_backend {
    server web1.example.com:80 weight=3;
    server web2.example.com:80 weight=2;
    server web3.example.com:80 backup;
}

server {
    listen 443 ssl;
    location / {
        proxy_pass http://tiger_grades_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Database Clustering

**MySQL Master-Slave Configuration:**
```sql
-- Master server configuration
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = mixed

-- Slave server configuration  
[mysqld]
server-id = 2
relay-log = relay-log
read-only = 1
```

## 🔧 Development Environment

### Local Development

**Recommended Stack:**
- **Local Server**: XAMPP, MAMP, or Docker
- **Version Control**: Git with GitHub/GitLab
- **IDE/Editor**: VS Code, PhpStorm, or Sublime Text
- **Database Tool**: phpMyAdmin, Adminer, or TablePlus

**Docker Configuration:**
```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: tiger_grades
      WORDPRESS_DB_PASSWORD: secure_password
      WORDPRESS_DB_NAME: tiger_grades_dev
    volumes:
      - ./tiger-grades:/var/www/html/wp-content/plugins/tiger-grades
      
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: tiger_grades_dev
      MYSQL_USER: tiger_grades
      MYSQL_PASSWORD: secure_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

### Testing Environment

**Unit Testing:**
```bash
# PHPUnit configuration
composer require --dev phpunit/phpunit
composer require --dev brain/monkey
composer require --dev mockery/mockery
```

**Integration Testing:**
```bash
# WordPress testing framework
svn co https://develop.svn.wordpress.org/tags/6.8/tests/phpunit/includes/ /tmp/wordpress-tests-lib/includes/
```

## 📊 Monitoring & Maintenance

### System Monitoring

**Required Monitoring:**
- Server resource usage (CPU, RAM, disk)
- Database performance metrics
- WordPress error logs
- Tiger Grades API response times

**Recommended Tools:**
- New Relic or DataDog for application monitoring
- Pingdom or UptimeRobot for uptime monitoring
- Google Analytics for user behavior

### Backup Strategy

**Automated Backups:**
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d)
wp db export /backups/tiger-grades-db-$DATE.sql
tar -czf /backups/tiger-grades-files-$DATE.tar.gz /var/www/html/wp-content/plugins/tiger-grades
```

**Backup Retention:**
- Daily backups: Keep for 30 days
- Weekly backups: Keep for 12 weeks  
- Monthly backups: Keep for 12 months

## ✅ Pre-Deployment Checklist

### System Verification

- [ ] WordPress 6.8+ installed and configured
- [ ] PHP 7.2+ with required extensions
- [ ] MySQL 5.7+ with proper configuration
- [ ] SSL certificate installed and working
- [ ] Azure app registration completed
- [ ] Environment variables configured
- [ ] Backup system tested
- [ ] Monitoring tools configured

### Security Verification

- [ ] HTTPS enforced site-wide
- [ ] Security plugins installed
- [ ] File permissions set correctly (644 for files, 755 for directories)
- [ ] Database user has minimal required privileges
- [ ] wp-config.php contains security keys
- [ ] Debug mode disabled in production

### Performance Verification

- [ ] Caching system installed and configured
- [ ] Database queries optimized
- [ ] CDN configured (if applicable)
- [ ] Image optimization enabled
- [ ] Minification for CSS/JS enabled

---

Once your system meets these requirements, proceed to the [Production Setup Guide](/docs/deployment/production-setup) for detailed deployment instructions. 