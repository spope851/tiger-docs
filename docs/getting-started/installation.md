---
sidebar_position: 1
---

# Installation Guide

Get Tiger Grades up and running in your WordPress environment with this comprehensive installation guide. We'll walk you through system requirements, installation steps, and initial configuration to ensure a smooth setup process.

## 🔧 **System Requirements**

### **WordPress Environment**
- **WordPress Version**: 6.8 or higher
- **PHP Version**: 7.2 or higher (8.1+ recommended for optimal performance)
- **MySQL Version**: 5.7 or higher (8.0+ recommended)
- **Memory Limit**: 256MB minimum (512MB recommended for large schools)
- **Execution Time**: 60 seconds minimum for Azure integration

### **Server Requirements**
- **SSL Certificate**: Required for Microsoft Graph API integration
- **HTTPS**: Mandatory for secure OAuth 2.0 authentication
- **cURL Support**: Required for external API communications
- **JSON Extension**: For API data processing
- **Multibyte String (mbstring)**: For internationalization support

### **Microsoft 365 Prerequisites**
- **Microsoft 365 Business/Education Account**: For OneDrive and Excel integration
- **Azure Active Directory**: Access to create app registrations
- **OneDrive for Business**: For gradebook storage and synchronization
- **Excel Online**: For gradebook editing and real-time updates

### **Recommended Plugins**
- **User Registration**: For student/parent account management
- **Polylang**: For multilingual support (English/Mandarin)
- **Members**: For advanced role-based access control
- **LiteSpeed Cache**: For optimal performance (cache purging integration included)

## 📥 **Installation Methods**

### **Method 1: WordPress Admin Dashboard (Recommended)**

1. **Download Tiger Grades**
   ```bash
   # Download the latest release
   wget https://github.com/spenpo-freelance/tiger-grades/releases/latest/download/tiger-grades.zip
   ```

2. **Upload via WordPress Admin**
   - Navigate to `Plugins > Add New > Upload Plugin`
   - Select the `tiger-grades.zip` file
   - Click `Install Now`
   - Activate the plugin

3. **Verify Installation**
   ```php
   // Check if Tiger Grades is active
   if (is_plugin_active('tiger-grades/tiger-grades.php')) {
       echo "Tiger Grades installed successfully!";
   }
   ```

### **Method 2: Manual Installation**

1. **Extract Plugin Files**
   ```bash
   # Extract to WordPress plugins directory
   cd /path/to/wordpress/wp-content/plugins/
   unzip tiger-grades.zip
   ```

2. **Set Proper Permissions**
   ```bash
   # Set directory permissions
   chown -R www-data:www-data tiger-grades/
   chmod -R 755 tiger-grades/
   ```

3. **Activate via WordPress Admin**
   - Go to `Plugins > Installed Plugins`
   - Find "Tiger Grades" and click `Activate`

### **Method 3: Git Clone for Developers**

```bash
# Clone the repository
git clone https://github.com/spenpo-freelance/tiger-grades.git
cd tiger-grades

# Switch to stable branch
git checkout main

# Create symbolic link to WordPress plugins directory
ln -s $(pwd) /path/to/wordpress/wp-content/plugins/tiger-grades
```

## ⚙️ **Azure Active Directory Setup**

### **Step 1: Create App Registration**

1. **Access Azure Portal**
   - Visit [Azure Portal](https://portal.azure.com)
   - Navigate to `Azure Active Directory > App registrations`

2. **Register New Application**
   ```json
   {
     "name": "Tiger Grades WordPress Integration",
     "signInAudience": "AzureADMyOrg",
     "requiredResourceAccess": [
       {
         "resourceAppId": "00000003-0000-0000-c000-000000000000",
         "resourceAccess": [
           {
             "id": "1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9",
             "type": "Role"
           },
           {
             "id": "19dbc75e-c2e2-444c-a770-ec69d8559fc7",
             "type": "Role"
           }
         ]
       }
     ]
   }
   ```

3. **Configure API Permissions**
   - Click `API permissions > Add a permission`
   - Select `Microsoft Graph`
   - Choose `Application permissions`
   - Add these permissions:
     - `Files.ReadWrite.All`
     - `Sites.ReadWrite.All`
     - `User.Read.All`

4. **Generate Client Secret**
   - Navigate to `Certificates & secrets`
   - Click `New client secret`
   - Set expiration (24 months recommended)
   - **Copy and securely store the secret value**

### **Step 2: Grant Admin Consent**

```bash
# Admin consent URL format
https://login.microsoftonline.com/{tenant-id}/adminconsent?client_id={client-id}
```

Replace `{tenant-id}` and `{client-id}` with your actual values and visit this URL as a Global Administrator.

### **Step 3: Collect Required Information**

You'll need these values for WordPress configuration:
- **Tenant ID**: Found in Azure AD overview
- **Client ID**: Application (client) ID from app registration
- **Client Secret**: The secret value you generated
- **Service Account User ID**: Object ID of the service account user

## 🔧 **WordPress Configuration**

### **Environment Variables Setup**

Add these constants to your `wp-config.php` file:

```php
// Microsoft Azure Configuration
define('MSFT_TENANT_ID', 'your-tenant-id-here');
define('MSFT_CLIENT_ID', 'your-client-id-here');
define('MSFT_CLIENT_SECRET', 'your-client-secret-here');
define('MSFT_USER_ID', 'your-service-user-id-here');

// Azure Functions Configuration (if using)
define('TIGER_GRADES_AZURE_FUNCTIONS_BASE_URL', 'https://your-functions-app.azurewebsites.net');
define('TIGER_GRADES_AZURE_FUNCTIONS_AUDIENCE', 'api://your-functions-app-id');

// Optional: Development/Debugging
define('TIGER_GRADES_DEBUG', false);
define('TIGER_GRADES_ENVIRONMENT', 'production');
```

### **Alternative: Environment File Method**

Create a `.env` file in your WordPress root:

```bash
# .env file
MSFT_TENANT_ID=your-tenant-id-here
MSFT_CLIENT_ID=your-client-id-here
MSFT_CLIENT_SECRET=your-client-secret-here
MSFT_USER_ID=your-service-user-id-here
TIGER_GRADES_AZURE_FUNCTIONS_BASE_URL=https://your-functions-app.azurewebsites.net
TIGER_GRADES_AZURE_FUNCTIONS_AUDIENCE=api://your-functions-app-id
```

Then load in `wp-config.php`:
```php
// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
    }
}
```

## 🗄️ **Database Setup**

### **Automatic Migration**

Tiger Grades includes an **automated migration system** that runs on activation:

```php
// Triggered automatically on plugin activation
register_activation_hook(__FILE__, function() {
    // Register string translations
    Spenpo\TigerGrades\Utilities\StringTranslationsManager::registerTranslations();
    
    // Run database migrations
    $migration_result = Spenpo\TigerGrades\Repositories\DatabaseManager::executeSQLScript(
        TIGER_GRADES_PATH . 'migrations/tiger_grades.sql',
        'init'
    );
    
    if (!$migration_result['success']) {
        error_log('Tiger Grades Migration Failed: ' . $migration_result['error']);
    }
});
```

### **Manual Migration (if needed)**

```bash
# Using WP-CLI
wp db import wp-content/plugins/tiger-grades/migrations/tiger_grades.sql

# Or via MySQL command line
mysql -u username -p database_name < wp-content/plugins/tiger-grades/migrations/tiger_grades.sql
```

### **Verify Database Tables**

After installation, verify these tables exist:
- `wp_tigr_classes`
- `wp_tigr_enrollments`
- `wp_tigr_class_types`
- `wp_tigr_range_options`
- `wp_tigr_feature_lookup`
- `wp_tigr_migrations`

```sql
-- Check table creation
SHOW TABLES LIKE 'wp_tigr_%';
```

## 👥 **User Roles & Permissions**

### **Required WordPress Roles**

Tiger Grades works with these user roles:

1. **Teacher Role**
   ```php
   // Create teacher role if it doesn't exist
   if (!get_role('teacher')) {
       add_role('teacher', 'Teacher', [
           'read' => true,
           'manage_tiger_classes' => true,
           'view_tiger_reports' => true,
           'create_tiger_enrollments' => true
       ]);
   }
   ```

2. **Subscriber Role** (for parents/students)
   - Default WordPress subscriber role
   - Enhanced with Tiger Grades specific capabilities

### **Capability Management**

```php
// Add Tiger Grades capabilities to existing roles
$teacher_role = get_role('teacher');
$teacher_role->add_cap('manage_tiger_classes');
$teacher_role->add_cap('view_tiger_reports');
$teacher_role->add_cap('create_tiger_enrollments');

$subscriber_role = get_role('subscriber');
$subscriber_role->add_cap('view_own_tiger_grades');
$subscriber_role->add_cap('enroll_in_tiger_classes');
```

## 🔧 **Plugin Dependencies**

### **Required Plugin: User Registration**

Tiger Grades requires the User Registration plugin for account management:

```bash
# Install via WP-CLI
wp plugin install user-registration --activate

# Or download manually
wget https://downloads.wordpress.org/plugin/user-registration.latest-stable.zip
```

### **Optional: Enhanced Functionality Plugins**

```bash
# Multilingual support
wp plugin install polylang --activate

# Advanced member management
wp plugin install members --activate

# Performance optimization
wp plugin install litespeed-cache --activate
```

## 🚀 **Initial Configuration**

### **Step 1: Create Essential Pages**

Tiger Grades requires several WordPress pages. Run this after installation:

```bash
# Using WP-CLI to import pages
wp db import wp-content/plugins/tiger-grades/migrations/pages.sql
```

Or create manually:
- **Teacher Dashboard** (`/teacher`)
- **Class Management** (`/teacher/classes`)
- **Register Class** (`/teacher/classes/register`)
- **Student Enrollment** (`/enroll`)
- **Grades Page** (`/grades`)
- **User Registration** (`/register`)

### **Step 2: Configure User Registration Forms**

1. **Create Teacher Registration Form**
   - Go to `User Registration > Add New`
   - Set default role to "Teacher"
   - Add custom class `lang-en` for English form

2. **Create Parent/Student Registration Form**
   - Go to `User Registration > Add New`
   - Set default role to "Subscriber"
   - Add custom class `lang-en` for English form

### **Step 3: Test Microsoft Integration**

```php
// Test authentication
$auth_service = new Spenpo\TigerGrades\Services\MicrosoftAuthService('tigr_graph_api');
$token_acquired = $auth_service->getAccessToken();

if ($token_acquired) {
    echo "✅ Microsoft integration working correctly!";
} else {
    echo "❌ Microsoft integration needs configuration";
}
```

## 🔍 **Verification Checklist**

### **Plugin Installation ✅**
- [ ] Plugin activated in WordPress admin
- [ ] No PHP errors in error logs
- [ ] Tiger Grades menu appears in admin sidebar

### **Database Setup ✅**
- [ ] All `wp_tigr_*` tables created
- [ ] Sample data inserted (class types, range options)
- [ ] Database triggers functioning

### **Microsoft Integration ✅**
- [ ] Azure app registration configured
- [ ] API permissions granted and consented
- [ ] Environment variables set in `wp-config.php`
- [ ] Token acquisition test passes

### **User Management ✅**
- [ ] Teacher role exists and has proper capabilities
- [ ] User Registration plugin active and configured
- [ ] Registration forms created for teachers and parents

### **Page Structure ✅**
- [ ] Essential pages created with proper shortcodes
- [ ] URL rewriting working correctly
- [ ] Navigation menus configured

## 🐛 **Troubleshooting**

### **Common Installation Issues**

#### **Plugin Won't Activate**
```php
// Check PHP version
if (version_compare(PHP_VERSION, '7.2', '<')) {
    echo "❌ PHP 7.2+ required, you have: " . PHP_VERSION;
}

// Check memory limit
if (wp_convert_hr_to_bytes(ini_get('memory_limit')) < 268435456) {
    echo "❌ Memory limit too low: " . ini_get('memory_limit');
}
```

#### **Database Migration Fails**
```sql
-- Check migration status
SELECT * FROM wp_tigr_migrations ORDER BY applied_at DESC;

-- Manually run specific migration
SOURCE wp-content/plugins/tiger-grades/migrations/tiger_grades.sql;
```

#### **Microsoft Authentication Fails**
```php
// Debug authentication
$diagnostics = [
    'tenant_id' => !empty(getenv('MSFT_TENANT_ID')),
    'client_id' => !empty(getenv('MSFT_CLIENT_ID')),
    'client_secret' => !empty(getenv('MSFT_CLIENT_SECRET')),
    'ssl_verify' => curl_version()['features'] & CURL_VERSION_SSL,
    'curl_enabled' => function_exists('curl_version')
];

var_dump($diagnostics);
```

### **Performance Optimization**

```php
// Recommended wp-config.php optimizations
define('WP_CACHE', true);
define('COMPRESS_CSS', true);
define('COMPRESS_SCRIPTS', true);
define('CONCATENATE_SCRIPTS', true);

// Tiger Grades specific optimizations
define('TIGER_GRADES_CACHE_TIMEOUT', 3600); // 1 hour cache
define('TIGER_GRADES_API_RATE_LIMIT', 600); // 600 requests per minute
```

## 🎯 **Next Steps**

After successful installation:

1. **📖 Read the Configuration Guide**: [Configuration Guide →](/docs/getting-started/configuration)
2. **🎓 Set Up Your First Class**: [First Setup Tutorial →](/docs/getting-started/first-setup)
3. **👥 Learn User Management**: [User Guides →](/docs/user-guides/teachers)
4. **🔧 Explore Developer Options**: [Developer Guide →](/docs/developer-guide/architecture)

## 🆘 **Getting Help**

If you encounter issues during installation:

- **📖 Check Documentation**: [Troubleshooting Guide →](/docs/deployment/troubleshooting)
- **🐛 Report Bugs**: [GitHub Issues](https://github.com/spenpo-freelance/tiger-grades/issues)
- **💬 Community Support**: [Discussions](https://github.com/spenpo-freelance/tiger-grades/discussions)
- **📧 Direct Support**: spencer@tigergrades.com

---

**🎉 Congratulations!** You're now ready to revolutionize your educational workflow with Tiger Grades. The combination of WordPress flexibility and Microsoft 365 power creates an unmatched education management experience! 