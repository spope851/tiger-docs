---
sidebar_position: 3
---

# API Reference 🔌

Tiger Grades provides a comprehensive REST API built on WordPress's native REST infrastructure. Our API enables seamless integration with external systems, mobile applications, and custom extensions while maintaining security and performance standards.

## 🎯 API Overview

The Tiger Grades API offers:

- **RESTful Architecture** following WordPress conventions
- **JWT Authentication** for secure access
- **Role-Based Permissions** aligned with user capabilities
- **Comprehensive Endpoints** for all core functionality
- **Rate Limiting** and abuse prevention
- **Detailed Error Responses** for debugging

## 🔐 Authentication

### JWT Token Authentication

Tiger Grades uses JSON Web Tokens for API authentication:

```php
// Generate access token
POST /wp-json/tiger-grades/v1/auth/token
Content-Type: application/json

{
    "username": "teacher@school.edu",
    "password": "secure_password"
}

// Response
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_email": "teacher@school.edu",
    "user_nicename": "teacher",
    "user_display_name": "Ms. Smith",
    "expires": "2024-12-31T23:59:59Z"
}
```

### Using Authentication Tokens

Include the JWT token in the Authorization header:

```http
GET /wp-json/tiger-grades/v1/classes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Permission Callbacks

All endpoints use role-based permission checking:

```php
class SecurityManager {
    public static function teacher_permission_callback($request) {
        $user = wp_get_current_user();
        return user_can($user, 'edit_posts'); // Teacher capability
    }
    
    public static function parent_permission_callback($request) {
        $user = wp_get_current_user();
        return $user && !user_can($user, 'edit_posts'); // Parent capability
    }
}
```

## 📚 Core API Endpoints

### Classes API

#### Get Teacher Classes

Retrieve all classes for the authenticated teacher:

```http
GET /wp-json/tiger-grades/v1/classes
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 15,
            "title": "AP Biology",
            "description": "Advanced Placement Biology course",
            "status": "active",
            "enrollment_code": "ABC123",
            "student_count": 24,
            "capacity": "26-50",
            "categories": "5+",
            "type": "Science",
            "start_date": "2024-09-01T00:00:00Z",
            "end_date": "2025-06-15T00:00:00Z",
            "gradebook_url": "https://onedrive.live.com/...",
            "created": "2024-08-15T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 3,
        "per_page": 20,
        "current_page": 1
    }
}
```

#### Create New Class

```http
POST /wp-json/tiger-grades/v1/classes
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Chemistry Honors",
    "description": "Advanced chemistry for high school students",
    "type": 3,
    "num_students": 4,
    "num_categories": 3,
    "start_date": "2024-09-01",
    "end_date": "2025-06-15",
    "message": "Welcome to Chemistry! Get ready for an exciting year."
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "class_id": 16,
        "title": "Chemistry Honors",
        "status": "pending",
        "enrollment_code": "XYZ789",
        "gradebook_status": "creating"
    }
}
```

#### Update Class Information

```http
PUT /wp-json/tiger-grades/v1/classes/{class_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "gradebook_id": "01ABCDEF123456789",
    "gradebook_url": "https://onedrive.live.com/edit.aspx?resid=..."
}
```

### Enrollments API

#### Get Class Enrollments

Retrieve all enrollments for a specific class:

```http
GET /wp-json/tiger-grades/v1/classes/{class_id}/enrollments
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 42,
            "student_name": "Sarah Johnson",
            "parent_email": "sarah.parent@email.com",
            "status": "approved",
            "student_id": 1,
            "message": "Excited to learn biology!",
            "enrollment_date": "2024-08-20T14:30:00Z",
            "approved_date": "2024-08-20T16:45:00Z"
        },
        {
            "id": 43,
            "student_name": "Michael Chen",
            "parent_email": "m.chen@email.com",
            "status": "pending",
            "student_id": null,
            "message": null,
            "enrollment_date": "2024-08-21T09:15:00Z",
            "approved_date": null
        }
    ]
}
```

#### Approve Enrollment

```http
POST /wp-json/tiger-grades/v1/enrollments/{enrollment_id}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
    "student_id": 25,
    "notes": "Welcome to the class!"
}
```

#### Deny Enrollment

```http
POST /wp-json/tiger-grades/v1/enrollments/{enrollment_id}/deny
Authorization: Bearer {token}
Content-Type: application/json

{
    "reason": "Class is at capacity"
}
```

### Students API

#### Get Class Students

Retrieve student list for gradebook integration:

```http
GET /wp-json/tiger-grades/v1/classes/{class_id}/students
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Sarah Johnson",
            "enrollment_status": "approved",
            "enrollment_date": "2024-08-20T14:30:00Z"
        },
        {
            "id": 2,
            "name": "Michael Chen", 
            "enrollment_status": "approved",
            "enrollment_date": "2024-08-21T09:15:00Z"
        }
    ]
}
```

### Report Cards API

#### Get Student Report Card

Retrieve comprehensive grade report for a student:

```http
GET /wp-json/tiger-grades/v1/report-card/{enrollment_id}
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` (optional): Filter by grade type (default: 'all')
- `sort` (optional): Sort order ('date', 'grade', 'category')

**Response:**
```json
{
    "success": true,
    "data": {
        "student_info": {
            "name": "Sarah Johnson",
            "student_id": 1,
            "class_title": "AP Biology",
            "teacher_name": "Ms. Smith"
        },
        "grade_summary": {
            "overall_average": 92.5,
            "letter_grade": "A-",
            "class_rank": 3,
            "total_assignments": 15
        },
        "categories": [
            {
                "name": "Homework",
                "weight": 25,
                "average": 95.2,
                "assignment_count": 8
            },
            {
                "name": "Tests",
                "weight": 50,
                "average": 89.7,
                "assignment_count": 4
            }
        ],
        "assignments": [
            {
                "name": "Cell Structure Quiz",
                "category": "Tests",
                "score": 94,
                "max_score": 100,
                "date": "2024-09-15",
                "notes": "Excellent understanding of organelles"
            }
        ],
        "trends": {
            "improvement": true,
            "trend_direction": "upward",
            "projected_final": 93.1
        }
    }
}
```

### Class Metadata API

#### Get Category Weights

Retrieve grading category information:

```http
GET /wp-json/tiger-grades/v1/classes/{class_id}/metadata
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` (optional): Specific category type

**Response:**
```json
{
    "success": true,
    "data": {
        "categories": [
            {
                "name": "Homework",
                "weight": 25,
                "color": "#4CAF50"
            },
            {
                "name": "Quizzes", 
                "weight": 25,
                "color": "#FF9800"
            },
            {
                "name": "Tests",
                "weight": 40,
                "color": "#F44336"
            },
            {
                "name": "Participation",
                "weight": 10,
                "color": "#2196F3"
            }
        ],
        "grading_scale": {
            "A": 90,
            "B": 80,
            "C": 70,
            "D": 60,
            "F": 0
        }
    }
}
```

## 🛠️ Administrative APIs

### Teacher Management

#### Get All Teachers

```http
GET /wp-json/tiger-grades/v1/admin/teachers
Authorization: Bearer {admin_token}
```

#### Get Teacher Statistics

```http
GET /wp-json/tiger-grades/v1/admin/teachers/{teacher_id}/stats
Authorization: Bearer {admin_token}
```

### System Configuration

#### Get Available Class Types

```http
GET /wp-json/tiger-grades/v1/config/class-types
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "English",
            "image_id": 1604
        },
        {
            "id": 3,
            "title": "Science", 
            "image_id": 1651
        }
    ]
}
```

#### Get Range Options

```http
GET /wp-json/tiger-grades/v1/config/range-options
```

## 📱 Mobile API Endpoints

### Parent Portal API

#### Get Parent's Children

```http
GET /wp-json/tiger-grades/v1/parent/children
Authorization: Bearer {parent_token}
```

#### Get Child's Classes

```http
GET /wp-json/tiger-grades/v1/parent/children/{student_name}/classes
Authorization: Bearer {parent_token}
```

### Student API

#### Get My Grades

```http
GET /wp-json/tiger-grades/v1/student/grades
Authorization: Bearer {student_token}
```

## 🔧 Integration APIs

### Microsoft Graph Integration

#### Update Class from Azure

Special endpoint for Azure Functions integration:

```http
POST /wp-json/tiger-grades/v1/update-class
Authorization: Bearer {service_token}
Content-Type: application/json

{
    "class_id": 15,
    "gradebook_id": "01ABCDEF123456789",
    "gradebook_url": "https://onedrive.live.com/edit.aspx?resid=...",
    "file_name": "AP Biology Period 1 - 2024-2025.xlsx"
}
```

### Webhook Endpoints

#### Grade Update Webhook

Receives notifications from Excel when grades change:

```http
POST /wp-json/tiger-grades/v1/webhooks/grade-update
Content-Type: application/json
X-Tiger-Signature: sha256=abc123...

{
    "gradebook_id": "01ABCDEF123456789",
    "worksheet": "grades",
    "change_type": "updated",
    "affected_range": "C5:C25"
}
```

## 🚨 Error Handling

### Standard Error Response

All API endpoints return consistent error structures:

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "You do not have permission to access this resource",
        "details": {
            "required_capability": "edit_posts",
            "user_role": "subscriber"
        }
    }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `INVALID_INPUT` | 400 | Request validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Validation Errors

Field-specific validation errors:

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_FAILED",
        "message": "The request contains invalid data",
        "validation_errors": [
            {
                "field": "title",
                "message": "Class title is required"
            },
            {
                "field": "num_students",
                "message": "Must select a valid student range"
            }
        ]
    }
}
```

## 📊 Rate Limiting

### Default Limits

Tiger Grades implements rate limiting to prevent abuse:

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Admin operations**: 500 requests per hour

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200
```

## 🔍 Pagination

### Standard Pagination

Large datasets use cursor-based pagination:

```http
GET /wp-json/tiger-grades/v1/classes?page=2&per_page=10
```

**Response:**
```json
{
    "data": [...],
    "pagination": {
        "total": 45,
        "per_page": 10,
        "current_page": 2,
        "total_pages": 5,
        "has_next": true,
        "has_previous": true,
        "next_page": "/wp-json/tiger-grades/v1/classes?page=3&per_page=10",
        "previous_page": "/wp-json/tiger-grades/v1/classes?page=1&per_page=10"
    }
}
```

## 🧪 Testing

### API Testing Examples

Using cURL to test endpoints:

```bash
# Get authentication token
curl -X POST \
  'https://school.edu/wp-json/tiger-grades/v1/auth/token' \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "teacher@school.edu",
    "password": "password123"
  }'

# Create a new class
curl -X POST \
  'https://school.edu/wp-json/tiger-grades/v1/classes' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Class",
    "description": "API test class",
    "type": 1,
    "num_students": 5,
    "num_categories": 3,
    "start_date": "2024-09-01",
    "end_date": "2025-06-15"
  }'
```

### Integration Testing

```php
class TigerGradesAPITest extends WP_UnitTestCase {
    private $api;
    private $teacher_user;
    
    public function setUp() {
        parent::setUp();
        $this->teacher_user = $this->factory->user->create([
            'role' => 'editor'
        ]);
        $this->api = new \Spenpo\TigerGrades\API\TigerGradesAPI();
    }
    
    public function test_create_class() {
        wp_set_current_user($this->teacher_user);
        
        $request = new WP_REST_Request('POST', '/tiger-grades/v1/classes');
        $request->set_json_params([
            'title' => 'Test Class',
            'type' => 1,
            'num_students' => 5,
            'num_categories' => 3
        ]);
        
        $response = $this->api->handle_create_class($request);
        
        $this->assertTrue($response->data['success']);
        $this->assertArrayHasKey('class_id', $response->data['data']);
    }
}
```

## 🏆 Best Practices

### For API Consumers

**Authentication:**
- Store JWT tokens securely
- Implement token refresh logic
- Handle authentication errors gracefully
- Use HTTPS for all API calls

**Request Optimization:**
- Implement proper caching strategies
- Use pagination for large datasets
- Batch multiple operations when possible
- Handle rate limiting appropriately

**Error Handling:**
- Always check the `success` field
- Implement retry logic for temporary failures
- Log errors for debugging
- Provide user-friendly error messages

### For API Developers

**Endpoint Design:**
- Follow RESTful conventions
- Use appropriate HTTP methods
- Implement proper status codes
- Provide comprehensive error messages

**Security:**
- Validate all input parameters
- Implement proper permission checks
- Use nonces for state-changing operations
- Log security-relevant events

**Performance:**
- Cache expensive operations
- Use database indexes effectively
- Implement query optimization
- Monitor API performance metrics

---

Ready to integrate with Tiger Grades? Check out our [Integration Examples](/docs/developer-guide/customization) for practical implementation patterns! 