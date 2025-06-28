---
sidebar_position: 4
---

# Shortcodes Reference 📋

Tiger Grades provides a comprehensive shortcode system that enables easy integration of grade management functionality into WordPress pages and posts. Our shortcodes are designed for flexibility, performance, and seamless user experience across all device types.

## 🎯 Shortcode Overview

Tiger Grades shortcodes offer:

- **Role-Based Rendering** - Automatic content adaptation based on user permissions
- **Responsive Design** - Mobile-first layouts that work on all devices
- **Security Integration** - Built-in authentication and authorization checks
- **Customizable Attributes** - Flexible configuration options
- **Performance Optimized** - Efficient rendering and caching strategies

## 🏫 Class Management Shortcodes

### `[tigr_teacher_dashboard]`

The primary dashboard for teachers to manage their classes.

**Usage:**
```php
[tigr_teacher_dashboard]
```

**Rendered Components:**
- Class overview cards with enrollment statistics
- Quick action buttons (create class, view enrollments)
- Recent activity feed
- Performance analytics summary

**Access Control:**
- **Required Capability**: `edit_posts` (teacher role)
- **Fallback**: Login prompt for unauthenticated users

**Implementation:**
```php
class TeacherDashboardShortcode {
    public function render($atts) {
        $user_id = get_current_user_id();
        
        if (!$user_id) {
            return $this->createUnauthenticatedMessage();
        }
        
        if (!user_can($user_id, 'edit_posts')) {
            return $this->createInsufficientPermissionsMessage();
        }
        
        return $this->renderDashboard($user_id);
    }
}
```

### `[tigr_teacher_classes]`

Displays a comprehensive table of all classes for the current teacher.

**Usage:**
```php
[tigr_teacher_classes type="all"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `type` | `all` | Filter classes: `active`, `pending`, `archived`, `all` |
| `show_stats` | `true` | Display enrollment statistics |
| `show_actions` | `true` | Include action buttons |

**Features:**
- Sortable columns (name, enrollment, status, created date)
- Inline enrollment management
- Quick actions (edit, view gradebook, generate codes)
- Export functionality

### `[tigr_class_management]`

Advanced class administration interface for teachers.

**Usage:**
```php
[tigr_class_management class_id="15"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `class_id` | `auto` | Specific class ID or auto-detect from URL |
| `view` | `overview` | Display mode: `overview`, `enrollments`, `grades` |
| `allow_edit` | `true` | Enable inline editing capabilities |

**Capabilities:**
- Student enrollment approval/denial
- Class settings modification
- Gradebook synchronization status
- Communication tools

## 👨‍👩‍👧‍👦 Parent & Student Shortcodes

### `[tigr_parent_classes]`

Dashboard for parents to view their children's classes and grades.

**Usage:**
```php
[tigr_parent_classes view="current"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `view` | `current` | Time filter: `current`, `past`, `all` |
| `student` | `all` | Specific student name or all children |
| `show_grades` | `true` | Display grade summaries |

**Features:**
- Multi-child family support
- Quick grade access
- Teacher contact information
- Progress tracking links

**Past Classes Integration:**
```javascript
// Automatic separation of current vs. past classes
const currentDate = new Date();
classes.forEach(classInfo => {
    const endDate = new Date(classInfo.end_date);
    const container = endDate < currentDate ? 
        document.getElementById('past-classes') : 
        document.getElementById('current-classes');
    container.appendChild(renderClassCard(classInfo));
});
```

### `[tigr_report_card]`

Comprehensive grade report display for students and parents.

**Usage:**
```php
[tigr_report_card enrollment_id="42" type="all" semester="1"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `enrollment_id` | `required` | Student enrollment identifier |
| `type` | `all` | Grade filter: `homework`, `tests`, `quizzes`, `all` |
| `semester` | `current` | Academic period: `1`, `2`, `current`, `all` |
| `sort_by` | `date` | Sort order: `date`, `grade`, `category` |

**Advanced Features:**
- Interactive grade charts
- Category-specific breakdowns
- Progress trend analysis
- PDF export functionality

**Multi-Semester Support:**
```php
// Tab functionality for semester navigation
if ($this->isMultiSemesterClass($class_id)) {
    $this->renderSemesterTabs($enrollment_id);
}
```

## 📝 Registration & Enrollment

### `[tigr_registration]`

User registration interface with role-specific forms.

**Usage:**
```php
[tigr_registration default_role="parent" show_teacher_option="true"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `default_role` | `parent` | Initial form type: `parent`, `teacher` |
| `show_teacher_option` | `true` | Enable teacher registration toggle |
| `require_approval` | `false` | Manual approval for teacher accounts |

**Features:**
- Animated toggle between parent and teacher registration
- hCaptcha integration for security
- Email verification workflow
- Custom field support

**Toggle Animation:**
```css
.registration-toggle {
    transition: all 0.3s ease-in-out;
    transform: translateX(var(--toggle-position));
}
```

### `[tigr_register_class]`

Class creation form for teachers.

**Usage:**
```php
[tigr_register_class template="standard"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `template` | `standard` | Form layout: `standard`, `compact`, `advanced` |
| `redirect` | `dashboard` | Post-creation redirect |
| `show_preview` | `true` | Enable gradebook preview |

**Form Components:**
- Class information (title, description, dates)
- Student capacity estimation with range inputs
- Category count selection
- Subject type classification
- Microsoft integration settings

### `[tigr_enroll_class]`

Student enrollment form for parents.

**Usage:**
```php
[tigr_enroll_class]
```

**Features:**
- Enrollment code validation
- Student information collection
- Parent contact verification
- Special accommodation notes
- Enrollment status tracking

**Validation System:**
```php
class EnrollmentValidator {
    public function validateCode($code) {
        return $this->codeExists($code) && 
               $this->codeNotExpired($code) && 
               $this->classHasCapacity($code);
    }
}
```

## 📊 Information & Display

### `[tigr_info_bar]`

Dynamic information display with customizable content.

**Usage:**
```php
[tigr_info_bar type="success" message="Custom message" dismissible="true"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `type` | `info` | Style: `info`, `success`, `warning`, `error` |
| `message` | `""` | Custom message text |
| `dismissible` | `false` | Allow user dismissal |
| `auto_hide` | `0` | Auto-hide delay in seconds |

**Dynamic Content:**
```php
// Context-aware messaging
$message = $this->getContextualMessage($user_role, $page_context);
$type = $this->determineMessageType($message);
```

### `[tigr_version]`

Display current Tiger Grades version information.

**Usage:**
```php
[tigr_version format="full" show_changelog="true"]
```

**Attributes:**
| Attribute | Default | Description |
|-----------|---------|-------------|
| `format` | `short` | Display format: `short`, `full`, `number_only` |
| `show_changelog` | `false` | Include changelog link |
| `language` | `auto` | Version text language |

**Multi-Language Support:**
```php
$version_text = [
    'en' => 'Version',
    'zh' => '版本',
    'es' => 'Versión'
];
```

## 🔧 Shortcode Development

### Creating Custom Shortcodes

**Base Shortcode Class:**
```php
abstract class TigerGradesShortcode {
    protected $tag;
    protected $default_atts = [];
    
    public function __construct() {
        add_shortcode($this->tag, [$this, 'render']);
    }
    
    abstract public function render($atts, $content = null);
    
    protected function parseAttributes($atts) {
        return shortcode_atts($this->default_atts, $atts);
    }
    
    protected function requiresAuthentication() {
        return !get_current_user_id();
    }
    
    protected function hasPermission($capability) {
        return current_user_can($capability);
    }
}
```

**Example Implementation:**
```php
class CustomGradeShortcode extends TigerGradesShortcode {
    protected $tag = 'tigr_custom_grade';
    protected $default_atts = [
        'class_id' => 0,
        'style' => 'default'
    ];
    
    public function render($atts, $content = null) {
        $atts = $this->parseAttributes($atts);
        
        if ($this->requiresAuthentication()) {
            return $this->renderLoginPrompt();
        }
        
        return $this->renderGradeDisplay($atts);
    }
}
```

### DOM Helper Integration

All shortcodes use the centralized DOM helper for consistent HTML generation:

```php
use Spenpo\TigerGrades\Utilities\DOMHelper;

class ExampleShortcode {
    public function render($atts) {
        $dom = new DOMDocument('1.0', 'utf-8');
        $container = DOMHelper::createElement($dom, 'div', 'tigr-container');
        
        $title = DOMHelper::createElement($dom, 'h2', 'tigr-title');
        $title->textContent = 'Grade Report';
        $container->appendChild($title);
        
        $dom->appendChild($container);
        return $dom->saveHTML();
    }
}
```

## 🎨 Styling & Customization

### CSS Classes

Tiger Grades shortcodes use consistent CSS class naming:

```css
/* Container classes */
.tigr-container { /* Main wrapper */ }
.tigr-card { /* Card components */ }
.tigr-table { /* Data tables */ }

/* State classes */
.tigr-loading { /* Loading states */ }
.tigr-error { /* Error displays */ }
.tigr-success { /* Success messages */ }

/* Role-specific styles */
.tigr-teacher-view { /* Teacher interface */ }
.tigr-parent-view { /* Parent interface */ }
.tigr-student-view { /* Student interface */ }
```

### Responsive Design

```css
/* Mobile-first responsive design */
.tigr-dashboard {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .tigr-dashboard {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .tigr-dashboard {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

## ⚡ Performance Optimization

### Caching Strategies

```php
class ShortcodeCache {
    public function getCachedContent($shortcode, $atts, $user_id) {
        $cache_key = "tigr_shortcode_{$shortcode}_" . md5(serialize($atts) . $user_id);
        
        $cached = wp_cache_get($cache_key, 'tiger_grades_shortcodes');
        if ($cached !== false) {
            return $cached;
        }
        
        return null;
    }
    
    public function setCachedContent($shortcode, $atts, $user_id, $content) {
        $cache_key = "tigr_shortcode_{$shortcode}_" . md5(serialize($atts) . $user_id);
        wp_cache_set($cache_key, $content, 'tiger_grades_shortcodes', HOUR_IN_SECONDS);
    }
}
```

### Lazy Loading

```javascript
// Lazy load heavy shortcode content
document.addEventListener('DOMContentLoaded', function() {
    const lazyShortcodes = document.querySelectorAll('.tigr-lazy-load');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadShortcodeContent(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    lazyShortcodes.forEach(shortcode => observer.observe(shortcode));
});
```

## 🔒 Security Considerations

### Input Sanitization

```php
class ShortcodeSecurity {
    public static function sanitizeAttributes($atts) {
        $sanitized = [];
        
        foreach ($atts as $key => $value) {
            switch ($key) {
                case 'class_id':
                case 'enrollment_id':
                    $sanitized[$key] = absint($value);
                    break;
                case 'type':
                case 'view':
                    $sanitized[$key] = sanitize_key($value);
                    break;
                default:
                    $sanitized[$key] = sanitize_text_field($value);
            }
        }
        
        return $sanitized;
    }
}
```

### Permission Validation

```php
public function validateAccess($shortcode, $atts, $user_id) {
    $permission_map = [
        'tigr_teacher_dashboard' => 'edit_posts',
        'tigr_class_management' => 'edit_posts',
        'tigr_parent_classes' => 'read',
        'tigr_report_card' => 'read'
    ];
    
    $required_capability = $permission_map[$shortcode] ?? 'read';
    return user_can($user_id, $required_capability);
}
```

## 🏆 Best Practices

### For Shortcode Development

**Performance:**
- Implement proper caching for expensive operations
- Use lazy loading for heavy content
- Minimize database queries with efficient data fetching
- Optimize DOM manipulation

**Security:**
- Always sanitize input attributes
- Validate user permissions before rendering sensitive content
- Use nonces for form submissions
- Implement proper escape sequences for output

**User Experience:**
- Provide loading states for asynchronous content
- Include error handling with user-friendly messages
- Ensure responsive design across all devices
- Maintain consistent styling with Tiger Grades theme

### For Content Creators

**Usage Guidelines:**
- Use descriptive attribute values for better maintainability
- Test shortcodes in different user role contexts
- Consider performance impact of multiple shortcodes on single page
- Document custom attribute combinations for team consistency

---

Ready to implement Tiger Grades shortcodes? Check out our [Customization Guide](/docs/developer-guide/customization) for advanced integration patterns! 