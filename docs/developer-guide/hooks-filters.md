---
sidebar_position: 5
---

# Hooks & Filters Reference

Tiger Grades provides a comprehensive system of WordPress hooks and filters that allow developers to extend and customize functionality without modifying core plugin files.

## 🎣 Action Hooks

### Class Management Hooks

#### `tiger_grades_class_created`
Fired after a new class is successfully created.

```php
do_action('tiger_grades_class_created', $class_id, $class_data, $teacher_id);
```

**Parameters:**
- `$class_id` (int): The newly created class ID
- `$class_data` (array): Array of class information
- `$teacher_id` (int): WordPress user ID of the teacher

**Example Usage:**
```php
add_action('tiger_grades_class_created', function($class_id, $class_data, $teacher_id) {
    // Send notification email to administrator
    wp_mail(
        get_option('admin_email'),
        'New Class Created',
        "Teacher {$teacher_id} created class: {$class_data['title']}"
    );
});
```

#### `tiger_grades_before_class_delete`
Fired before a class is deleted, allowing for cleanup operations.

```php
do_action('tiger_grades_before_class_delete', $class_id, $teacher_id);
```

#### `tiger_grades_after_enrollment`
Triggered when a student successfully enrolls in a class.

```php
do_action('tiger_grades_after_enrollment', $enrollment_id, $class_id, $student_id);
```

### Grade Management Hooks

#### `tiger_grades_grade_updated`
Fired when a grade is modified in the system.

```php
do_action('tiger_grades_grade_updated', $grade_data, $old_grade, $class_id);
```

#### `tiger_grades_report_card_generated`
Triggered after a report card is successfully generated.

```php
do_action('tiger_grades_report_card_generated', $student_id, $class_id, $report_data);
```

### Microsoft Integration Hooks

#### `tiger_grades_azure_gradebook_created`
Fired after Azure Functions successfully creates a gradebook.

```php
do_action('tiger_grades_azure_gradebook_created', $class_id, $gradebook_url, $folder_id);
```

#### `tiger_grades_graph_api_error`
Triggered when Microsoft Graph API encounters an error.

```php
do_action('tiger_grades_graph_api_error', $error_message, $endpoint, $class_id);
```

## 🔧 Filter Hooks

### Data Modification Filters

#### `tiger_grades_class_data_before_save`
Modify class data before it's saved to the database.

```php
$class_data = apply_filters('tiger_grades_class_data_before_save', $class_data, $teacher_id);
```

**Example Usage:**
```php
add_filter('tiger_grades_class_data_before_save', function($class_data, $teacher_id) {
    // Add custom metadata
    $class_data['custom_field'] = 'custom_value';
    
    // Validate title length
    if (strlen($class_data['title']) > 100) {
        $class_data['title'] = substr($class_data['title'], 0, 100);
    }
    
    return $class_data;
}, 10, 2);
```

#### `tiger_grades_enrollment_validation`
Filter enrollment data during validation.

```php
$is_valid = apply_filters('tiger_grades_enrollment_validation', true, $enrollment_data, $class_id);
```

#### `tiger_grades_grade_calculation`
Modify grade calculations before display.

```php
$final_grade = apply_filters('tiger_grades_grade_calculation', $calculated_grade, $grades_array, $class_id);
```

### Display Filters

#### `tiger_grades_shortcode_output`
Filter the output of Tiger Grades shortcodes.

```php
$output = apply_filters('tiger_grades_shortcode_output', $output, $shortcode_name, $atts);
```

**Example Usage:**
```php
add_filter('tiger_grades_shortcode_output', function($output, $shortcode_name, $atts) {
    if ($shortcode_name === 'tiger_grades_class_management') {
        // Add custom CSS class
        $output = str_replace('<div class="class-management">', 
                            '<div class="class-management custom-styling">', 
                            $output);
    }
    return $output;
}, 10, 3);
```

#### `tiger_grades_report_card_template`
Customize report card template data.

```php
$template_data = apply_filters('tiger_grades_report_card_template', $template_data, $student_id, $class_id);
```

### API Response Filters

#### `tiger_grades_api_response`
Filter API responses before sending to client.

```php
$response = apply_filters('tiger_grades_api_response', $response, $endpoint, $request_data);
```

#### `tiger_grades_rest_authentication`
Modify REST API authentication logic.

```php
$is_authenticated = apply_filters('tiger_grades_rest_authentication', $is_authenticated, $request);
```

## 🎯 Custom Hook Examples

### Adding Custom Notifications

```php
// Send SMS when grade is updated
add_action('tiger_grades_grade_updated', function($grade_data, $old_grade, $class_id) {
    $student_id = $grade_data['student_id'];
    $parent_phone = get_user_meta($student_id, 'parent_phone', true);
    
    if ($parent_phone && $grade_data['grade'] < 70) {
        // Send SMS notification for low grades
        send_sms_notification($parent_phone, 
                            "Grade alert: {$grade_data['assignment']} - {$grade_data['grade']}%");
    }
}, 10, 3);
```

### Custom Grade Weighting

```php
// Implement custom grade weighting system
add_filter('tiger_grades_grade_calculation', function($calculated_grade, $grades_array, $class_id) {
    $class_type = get_post_meta($class_id, 'class_type', true);
    
    if ($class_type === 'Advanced Math') {
        // Apply curved grading for advanced math classes
        $curved_grade = $calculated_grade + 5; // Add 5-point curve
        return min($curved_grade, 100); // Cap at 100%
    }
    
    return $calculated_grade;
}, 10, 3);
```

### Integration with External Systems

```php
// Sync with external Learning Management System
add_action('tiger_grades_class_created', function($class_id, $class_data, $teacher_id) {
    $lms_api = new ExternalLMS_API();
    $lms_api->create_course([
        'title' => $class_data['title'],
        'instructor_id' => $teacher_id,
        'tiger_grades_class_id' => $class_id
    ]);
});
```

## 🔒 Security Considerations

### Permission Checks in Hooks

Always verify user permissions in your hook callbacks:

```php
add_action('tiger_grades_grade_updated', function($grade_data, $old_grade, $class_id) {
    // Verify current user can access this class
    if (!current_user_can('edit_tiger_grades_class', $class_id)) {
        return;
    }
    
    // Your custom logic here
});
```

### Data Sanitization

Sanitize data when using filters:

```php
add_filter('tiger_grades_class_data_before_save', function($class_data, $teacher_id) {
    // Sanitize all text fields
    foreach ($class_data as $key => $value) {
        if (is_string($value)) {
            $class_data[$key] = sanitize_text_field($value);
        }
    }
    
    return $class_data;
}, 10, 2);
```

## 📊 Performance Best Practices

### Efficient Hook Usage

1. **Use appropriate priority**: Lower numbers run first
2. **Limit database queries**: Cache results when possible
3. **Check conditions early**: Return early if conditions aren't met

```php
add_action('tiger_grades_grade_updated', function($grade_data, $old_grade, $class_id) {
    // Early return if grade didn't actually change
    if ($grade_data['grade'] === $old_grade['grade']) {
        return;
    }
    
    // Only proceed if this is a significant change
    if (abs($grade_data['grade'] - $old_grade['grade']) < 5) {
        return;
    }
    
    // Your expensive operations here
}, 10, 3);
```

### Caching Hook Results

```php
add_filter('tiger_grades_grade_calculation', function($calculated_grade, $grades_array, $class_id) {
    $cache_key = "tiger_grades_calc_{$class_id}_" . md5(serialize($grades_array));
    $cached_result = wp_cache_get($cache_key, 'tiger_grades');
    
    if ($cached_result !== false) {
        return $cached_result;
    }
    
    // Perform expensive calculation
    $result = perform_complex_calculation($calculated_grade, $grades_array);
    
    // Cache for 5 minutes
    wp_cache_set($cache_key, $result, 'tiger_grades', 300);
    
    return $result;
}, 10, 3);
```

## 🧪 Testing Your Hooks

### Unit Testing Hook Callbacks

```php
class TigerGradesHooksTest extends WP_UnitTestCase {
    public function test_grade_updated_hook() {
        $grade_data = ['grade' => 85, 'student_id' => 123];
        $old_grade = ['grade' => 80, 'student_id' => 123];
        $class_id = 456;
        
        // Set up expectation
        $this->expectNotificationSent();
        
        // Trigger the hook
        do_action('tiger_grades_grade_updated', $grade_data, $old_grade, $class_id);
        
        // Assert the expected behavior occurred
        $this->assertNotificationWasSent($grade_data);
    }
}
```

## 📚 Additional Resources

- [WordPress Plugin API Reference](https://developer.wordpress.org/plugins/hooks/)
- [Tiger Grades API Documentation](/docs/developer-guide/api-reference)
- [Database Schema Reference](/docs/developer-guide/database-schema)
- [Custom Development Guide](/docs/developer-guide/customization)

---

:::tip Pro Tip
When developing custom hooks, always test with the **Tiger Grades Debug Mode** enabled to see hook execution order and timing.
:::

:::warning Important
Some hooks may be called multiple times during a single request. Always design your callbacks to be idempotent (safe to run multiple times).
::: 