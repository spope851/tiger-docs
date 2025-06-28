---
sidebar_position: 6
---

# Customization Guide 🎨

Tiger Grades is built with extensibility in mind, providing multiple layers of customization to meet the unique needs of educational institutions. This guide covers theming, extending functionality, and integrating with external systems.

## 🎯 Customization Overview

Tiger Grades supports customization through:

- **WordPress Hooks & Filters** - Modify behavior without changing core code
- **Template Overrides** - Custom HTML layouts and styling
- **API Extensions** - Add new endpoints and data sources
- **Custom Shortcodes** - Create specialized UI components
- **Theme Integration** - Seamless visual integration with your site
- **Plugin Extensions** - Modular functionality additions

## 🎨 Theming & Visual Customization

### CSS Customization

**Override Default Styles:**
```css
/* In your theme's style.css or custom CSS */

/* Customize Tiger Grades containers */
.tigr-container {
    background-color: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Custom class card styling */
.tigr-class-card {
    border-left: 4px solid var(--school-primary-color);
    transition: transform 0.2s ease;
}

.tigr-class-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Grade color customization */
.tigr-grade-excellent { color: #28a745; }
.tigr-grade-good { color: #17a2b8; }
.tigr-grade-needs-improvement { color: #ffc107; }
.tigr-grade-failing { color: #dc3545; }
```

**CSS Custom Properties:**
```css
:root {
    /* Define your school's color scheme */
    --tigr-primary: #0066cc;
    --tigr-secondary: #6c757d;
    --tigr-success: #28a745;
    --tigr-warning: #ffc107;
    --tigr-danger: #dc3545;
    
    /* Typography */
    --tigr-font-family: 'Inter', -apple-system, sans-serif;
    --tigr-font-size-base: 1rem;
    --tigr-line-height: 1.5;
    
    /* Spacing */
    --tigr-spacing-xs: 0.25rem;
    --tigr-spacing-sm: 0.5rem;
    --tigr-spacing-md: 1rem;
    --tigr-spacing-lg: 1.5rem;
    --tigr-spacing-xl: 2rem;
}
```

### Template Override System

**Create Custom Templates:**
```php
// In your theme's functions.php
function custom_tigr_template_override($template, $shortcode, $atts) {
    // Override specific shortcode templates
    if ($shortcode === 'tigr_report_card') {
        $custom_template = get_template_directory() . '/tiger-grades/report-card-custom.php';
        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }
    return $template;
}
add_filter('tigr_shortcode_template', 'custom_tigr_template_override', 10, 3);
```

**Custom Template Example:**
```php
<?php
// themes/your-theme/tiger-grades/report-card-custom.php
?>
<div class="custom-report-card-container">
    <header class="report-header">
        <div class="school-branding">
            <img src="<?php echo get_template_directory_uri(); ?>/images/school-logo.png" alt="School Logo">
            <h1><?php echo get_bloginfo('name'); ?></h1>
        </div>
        <div class="student-info">
            <h2><?php echo esc_html($student_name); ?></h2>
            <p class="class-title"><?php echo esc_html($class_title); ?></p>
        </div>
    </header>
    
    <main class="grade-content">
        <?php foreach ($grade_categories as $category): ?>
            <section class="grade-category">
                <h3><?php echo esc_html($category['name']); ?></h3>
                <div class="grade-visualization">
                    <!-- Custom grade display logic -->
                </div>
            </section>
        <?php endforeach; ?>
    </main>
</div>
```

## 🔧 Functional Customization

### WordPress Hooks & Filters

**Modifying Grade Calculations:**
```php
// Custom grading scale
function custom_grade_scale($letter_grade, $percentage) {
    if ($percentage >= 97) return 'A+';
    if ($percentage >= 93) return 'A';
    if ($percentage >= 90) return 'A-';
    if ($percentage >= 87) return 'B+';
    if ($percentage >= 83) return 'B';
    if ($percentage >= 80) return 'B-';
    // ... continue custom scale
    
    return $letter_grade;
}
add_filter('tigr_calculate_letter_grade', 'custom_grade_scale', 10, 2);

// Modify enrollment validation
function custom_enrollment_validation($is_valid, $enrollment_data) {
    // Add custom validation rules
    if (empty($enrollment_data['emergency_contact'])) {
        return new WP_Error('missing_emergency_contact', 'Emergency contact is required');
    }
    
    // Check against custom student database
    if (!validate_student_in_sis($enrollment_data['student_name'])) {
        return new WP_Error('student_not_found', 'Student not found in school system');
    }
    
    return $is_valid;
}
add_filter('tigr_validate_enrollment', 'custom_enrollment_validation', 10, 2);
```

**Customizing Email Notifications:**
```php
// Custom enrollment approval email
function custom_enrollment_email($message, $enrollment_data) {
    $custom_message = "
    <div style='font-family: Arial, sans-serif; max-width: 600px;'>
        <h2 style='color: #0066cc;'>Welcome to {$enrollment_data['class_title']}!</h2>
        <p>Dear {$enrollment_data['parent_name']},</p>
        <p>We're excited to confirm that {$enrollment_data['student_name']} has been enrolled in our class.</p>
        
        <div style='background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;'>
            <h3>Next Steps:</h3>
            <ol>
                <li>Access the parent portal: <a href='" . home_url('/parent-portal') . "'>Parent Portal</a></li>
                <li>Review the class syllabus</li>
                <li>Mark important dates on your calendar</li>
            </ol>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Teaching Team</p>
    </div>";
    
    return $custom_message;
}
add_filter('tigr_enrollment_approval_email', 'custom_enrollment_email', 10, 2);
```

### Custom API Endpoints

**Add School-Specific Endpoints:**
```php
class CustomTigerGradesAPI {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_custom_routes']);
    }
    
    public function register_custom_routes() {
        // Custom attendance tracking
        register_rest_route('tiger-grades/v1', '/attendance/(?P<class_id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_attendance_data'],
            'permission_callback' => [$this, 'teacher_permission'],
            'args' => [
                'class_id' => [
                    'required' => true,
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);
        
        // Custom parent communication endpoint
        register_rest_route('tiger-grades/v1', '/communicate', [
            'methods' => 'POST',
            'callback' => [$this, 'send_parent_message'],
            'permission_callback' => [$this, 'teacher_permission']
        ]);
    }
    
    public function get_attendance_data($request) {
        $class_id = $request->get_param('class_id');
        
        // Custom attendance logic
        $attendance_data = $this->fetch_attendance_from_sis($class_id);
        
        return rest_ensure_response([
            'success' => true,
            'data' => $attendance_data
        ]);
    }
}

new CustomTigerGradesAPI();
```

### Custom Shortcodes

**Create Institution-Specific Shortcodes:**
```php
class SchoolSpecificShortcodes {
    public function __construct() {
        add_shortcode('school_honor_roll', [$this, 'render_honor_roll']);
        add_shortcode('school_calendar', [$this, 'render_school_calendar']);
        add_shortcode('teacher_directory', [$this, 'render_teacher_directory']);
    }
    
    public function render_honor_roll($atts) {
        $atts = shortcode_atts([
            'semester' => 'current',
            'gpa_minimum' => 3.5,
            'show_photos' => 'true'
        ], $atts);
        
        // Query honor roll students
        $honor_students = $this->get_honor_roll_students($atts);
        
        ob_start();
        ?>
        <div class="school-honor-roll">
            <h2>Honor Roll - <?php echo ucfirst($atts['semester']); ?> Semester</h2>
            <div class="honor-students-grid">
                <?php foreach ($honor_students as $student): ?>
                    <div class="honor-student-card">
                        <?php if ($atts['show_photos'] === 'true'): ?>
                            <img src="<?php echo $student['photo_url']; ?>" 
                                 alt="<?php echo esc_attr($student['name']); ?>">
                        <?php endif; ?>
                        <h3><?php echo esc_html($student['name']); ?></h3>
                        <p>GPA: <?php echo number_format($student['gpa'], 2); ?></p>
                        <p>Grade: <?php echo esc_html($student['grade_level']); ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

new SchoolSpecificShortcodes();
```

## 🔌 Integration Patterns

### Student Information System (SIS) Integration

**Custom SIS Connector:**
```php
class CustomSISIntegration {
    private $sis_api_endpoint;
    private $api_key;
    
    public function __construct() {
        $this->sis_api_endpoint = get_option('custom_sis_endpoint');
        $this->api_key = get_option('custom_sis_api_key');
        
        // Hook into Tiger Grades events
        add_action('tigr_enrollment_approved', [$this, 'sync_to_sis'], 10, 2);
        add_action('tigr_grade_updated', [$this, 'update_sis_grade'], 10, 3);
    }
    
    public function sync_to_sis($enrollment_id, $enrollment_data) {
        $sis_data = [
            'student_id' => $enrollment_data['student_id'],
            'course_code' => $enrollment_data['course_code'],
            'section' => $enrollment_data['section'],
            'teacher_id' => $enrollment_data['teacher_id'],
            'enrollment_date' => $enrollment_data['enrollment_date']
        ];
        
        $response = wp_remote_post($this->sis_api_endpoint . '/enrollments', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($sis_data),
            'timeout' => 30
        ]);
        
        if (is_wp_error($response)) {
            error_log('SIS sync failed: ' . $response->get_error_message());
        }
    }
}

new CustomSISIntegration();
```

### Learning Management System (LMS) Integration

**Moodle Integration Example:**
```php
class MoodleIntegration {
    private $moodle_url;
    private $moodle_token;
    
    public function __construct() {
        add_action('tigr_class_created', [$this, 'create_moodle_course'], 10, 2);
        add_action('tigr_enrollment_approved', [$this, 'enroll_in_moodle'], 10, 2);
    }
    
    public function create_moodle_course($class_id, $class_data) {
        $course_data = [
            'courses' => [
                [
                    'fullname' => $class_data['title'],
                    'shortname' => $this->generate_short_name($class_data['title']),
                    'categoryid' => $this->get_moodle_category($class_data['type']),
                    'summary' => $class_data['description'],
                    'format' => 'topics'
                ]
            ]
        ];
        
        $moodle_response = $this->call_moodle_api('core_course_create_courses', $course_data);
        
        if (!empty($moodle_response)) {
            // Store Moodle course ID with Tiger Grades class
            update_post_meta($class_id, 'moodle_course_id', $moodle_response[0]['id']);
        }
    }
    
    private function call_moodle_api($function, $params) {
        $url = $this->moodle_url . '/webservice/rest/server.php';
        
        $postdata = [
            'wstoken' => $this->moodle_token,
            'wsfunction' => $function,
            'moodlewsrestformat' => 'json'
        ];
        
        foreach ($params as $key => $value) {
            $postdata[$key] = is_array($value) ? json_encode($value) : $value;
        }
        
        $response = wp_remote_post($url, [
            'body' => $postdata,
            'timeout' => 30
        ]);
        
        if (!is_wp_error($response)) {
            return json_decode(wp_remote_retrieve_body($response), true);
        }
        
        return false;
    }
}

new MoodleIntegration();
```

## 📱 Mobile App Integration

### REST API Extensions for Mobile

**Mobile-Optimized Endpoints:**
```php
class MobileAPIExtensions {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_mobile_routes']);
    }
    
    public function register_mobile_routes() {
        // Lightweight mobile dashboard
        register_rest_route('tiger-grades/mobile/v1', '/dashboard', [
            'methods' => 'GET',
            'callback' => [$this, 'mobile_dashboard'],
            'permission_callback' => '__return_true'
        ]);
        
        // Push notification registration
        register_rest_route('tiger-grades/mobile/v1', '/register-device', [
            'methods' => 'POST',
            'callback' => [$this, 'register_mobile_device'],
            'permission_callback' => 'is_user_logged_in'
        ]);
    }
    
    public function mobile_dashboard($request) {
        $user_id = get_current_user_id();
        $user_role = $this->get_user_primary_role($user_id);
        
        $dashboard_data = [
            'user' => [
                'id' => $user_id,
                'name' => wp_get_current_user()->display_name,
                'role' => $user_role
            ],
            'quick_stats' => $this->get_quick_stats($user_id, $user_role),
            'recent_activity' => $this->get_recent_activity($user_id, $user_role),
            'notifications' => $this->get_user_notifications($user_id)
        ];
        
        return rest_ensure_response($dashboard_data);
    }
}

new MobileAPIExtensions();
```

### Push Notification System

**Firebase Cloud Messaging Integration:**
```php
class TigerGradesPushNotifications {
    private $fcm_server_key;
    
    public function __construct() {
        $this->fcm_server_key = get_option('tigr_fcm_server_key');
        
        add_action('tigr_grade_posted', [$this, 'notify_grade_update'], 10, 3);
        add_action('tigr_enrollment_approved', [$this, 'notify_enrollment_approved'], 10, 2);
    }
    
    public function notify_grade_update($student_id, $class_id, $grade_data) {
        $parent_devices = $this->get_parent_devices($student_id);
        
        $notification = [
            'title' => 'New Grade Posted',
            'body' => "New grade posted for {$grade_data['assignment_name']} in {$grade_data['class_title']}",
            'icon' => 'grade_icon',
            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
            'data' => [
                'type' => 'grade_update',
                'class_id' => $class_id,
                'assignment_id' => $grade_data['assignment_id']
            ]
        ];
        
        $this->send_notification($parent_devices, $notification);
    }
    
    private function send_notification($device_tokens, $notification) {
        $url = 'https://fcm.googleapis.com/fcm/send';
        
        $headers = [
            'Authorization: key=' . $this->fcm_server_key,
            'Content-Type: application/json'
        ];
        
        foreach ($device_tokens as $token) {
            $data = [
                'to' => $token,
                'notification' => $notification,
                'data' => $notification['data'] ?? []
            ];
            
            wp_remote_post($url, [
                'headers' => $headers,
                'body' => json_encode($data)
            ]);
        }
    }
}

new TigerGradesPushNotifications();
```

## 🔧 Advanced Customization

### Custom Database Tables

**Adding School-Specific Data:**
```php
class CustomSchoolData {
    public function __construct() {
        register_activation_hook(__FILE__, [$this, 'create_custom_tables']);
    }
    
    public function create_custom_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'tigr_school_calendar';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            event_date date DEFAULT '0000-00-00' NOT NULL,
            event_title varchar(255) NOT NULL,
            event_type varchar(50) NOT NULL,
            class_id bigint(20) UNSIGNED,
            teacher_id bigint(20) UNSIGNED,
            description text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY class_id (class_id),
            KEY teacher_id (teacher_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

new CustomSchoolData();
```

### Custom Grading Algorithms

**Standards-Based Grading Implementation:**
```php
class StandardsBasedGrading {
    public function __construct() {
        add_filter('tigr_calculate_final_grade', [$this, 'standards_based_calculation'], 10, 3);
    }
    
    public function standards_based_calculation($final_grade, $assignments, $standards) {
        // Group assignments by learning standards
        $standards_scores = [];
        
        foreach ($assignments as $assignment) {
            foreach ($assignment['standards'] as $standard_id) {
                if (!isset($standards_scores[$standard_id])) {
                    $standards_scores[$standard_id] = [];
                }
                $standards_scores[$standard_id][] = $assignment['score'];
            }
        }
        
        // Calculate proficiency levels for each standard
        $proficiency_levels = [];
        foreach ($standards_scores as $standard_id => $scores) {
            // Use most recent evidence (last score) with trend consideration
            $proficiency_levels[$standard_id] = $this->calculate_proficiency($scores);
        }
        
        // Overall proficiency is average of all standards
        $overall_proficiency = array_sum($proficiency_levels) / count($proficiency_levels);
        
        return $this->proficiency_to_grade($overall_proficiency);
    }
    
    private function calculate_proficiency($scores) {
        // Prioritize recent evidence while considering growth
        $recent_scores = array_slice($scores, -3); // Last 3 assessments
        $trend_weight = 0.7; // 70% weight to recent evidence
        $consistency_weight = 0.3; // 30% weight to consistency
        
        $recent_average = array_sum($recent_scores) / count($recent_scores);
        $overall_average = array_sum($scores) / count($scores);
        
        return ($recent_average * $trend_weight) + ($overall_average * $consistency_weight);
    }
}

new StandardsBasedGrading();
```

## 🏆 Best Practices

### Performance Optimization

**Caching Custom Data:**
```php
class CustomDataCache {
    public function get_cached_school_data($school_id) {
        $cache_key = "school_data_{$school_id}";
        $cached_data = wp_cache_get($cache_key, 'tiger_grades_custom');
        
        if ($cached_data === false) {
            $cached_data = $this->fetch_school_data($school_id);
            wp_cache_set($cache_key, $cached_data, 'tiger_grades_custom', HOUR_IN_SECONDS);
        }
        
        return $cached_data;
    }
}
```

### Security Considerations

**Input Validation for Custom Features:**
```php
class CustomSecurityValidation {
    public function validate_custom_input($input, $context) {
        switch ($context) {
            case 'school_calendar_event':
                return [
                    'event_title' => sanitize_text_field($input['event_title']),
                    'event_date' => $this->validate_date($input['event_date']),
                    'event_type' => $this->validate_event_type($input['event_type'])
                ];
                
            case 'custom_grade_scale':
                return array_map('absint', $input);
                
            default:
                return sanitize_text_field($input);
        }
    }
    
    private function validate_date($date) {
        $datetime = DateTime::createFromFormat('Y-m-d', $date);
        return $datetime ? $datetime->format('Y-m-d') : date('Y-m-d');
    }
}
```

### Documentation Standards

**Document Custom Features:**
```php
/**
 * Custom Tiger Grades Extensions for [School Name]
 * 
 * This file contains school-specific customizations for Tiger Grades
 * including custom grading scales, SIS integration, and notification systems.
 * 
 * @package TigerGrades_Custom
 * @version 1.0.0
 * @author [Developer Name]
 * 
 * Dependencies:
 * - Tiger Grades Core Plugin v0.1.0+
 * - WordPress 6.8+
 * - PHP 7.2+
 * 
 * Configuration:
 * - Set SIS_API_ENDPOINT in wp-config.php
 * - Configure FCM_SERVER_KEY for push notifications
 * - Install required OAuth certificates
 */
```

---

Ready to customize Tiger Grades for your institution? Start with our [Hooks & Filters Reference](/docs/developer-guide/hooks-filters) for available extension points! 