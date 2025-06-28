# Teacher Guide

Welcome to Tiger Grades! As a teacher, you have access to powerful tools for managing classes, tracking student progress, and communicating with parents. This guide covers everything you need to know to effectively use Tiger Grades in your classroom.

## 🎯 Teacher Overview

As a teacher in Tiger Grades, you can:
- **Create and manage multiple classes**
- **Track student enrollment and approval workflows**
- **Integrate with Microsoft Excel/OneDrive for gradebooks**
- **Generate automated report cards and progress reports**
- **Communicate with parents through the system**
- **Export grades and analytics**

## 🚀 Getting Started

### Accessing Your Dashboard

Your teacher dashboard is the central hub for all class management activities:

1. **Login to WordPress** with your teacher credentials
2. **Navigate to your dashboard page** (usually contains `[tigr_teacher_dashboard]`)
3. **View your class overview** and quick action buttons

### Understanding the Interface

**Class Cards Display**
- Each class shows as a visual card with subject image
- Quick stats: student count, enrollment status, grade averages
- Action buttons: Manage, View Grades, Export

**Quick Actions Panel**
- Create New Class
- Bulk Grade Import
- Generate Reports
- System Notifications

## 🏫 Class Management

### Creating a New Class

Follow these steps to set up a new class:

#### Step 1: Basic Class Information

```
Class Title: [e.g., "AP Biology - Period 3"]
Subject Type: [Select from predefined subjects]
Description: [Brief course description for students/parents]
```

**Best Practices for Class Titles:**
- Include grade level and period/section if applicable
- Keep titles concise but descriptive
- Use consistent naming conventions across your classes

#### Step 2: Scheduling and Duration

```
Start Date: [First day of class]
End Date: [Last day of class]
Class Message: [Welcome message for students]
```

**Scheduling Tips:**
- Align with your school's academic calendar
- Consider semester vs. full-year courses
- Set end dates to allow for final grade submission

#### Step 3: Capacity Planning

```
Estimated Students: [Select appropriate range]
- 1-10 students (Small class)
- 11-30 students (Medium class)  
- 31-60 students (Large class)
- 61+ students (Very large class)

Number of Categories: [Select grading categories]
- 1-5 categories (Simple grading)
- 6-10 categories (Standard grading)
- 11+ categories (Detailed grading)
```

#### Step 4: Advanced Options

**Enrollment Settings:**
- Auto-approve enrollments (recommended for small classes)
- Manual approval required (recommended for capacity-limited classes)
- Parent notification preferences

### Managing Active Classes

Once your class is created and activated, use these management tools:

#### Class Management Dashboard

Access via clicking on any class card:

**Student Roster**
- View all enrolled students
- See enrollment status (pending, approved, inactive)
- Access individual student grade details
- Manage student information

**Enrollment Controls**
- View and copy enrollment code
- Generate QR codes for easy mobile enrollment
- Approve/reject pending enrollment requests
- Send enrollment invitations via email

**Gradebook Integration**
- Quick link to OneDrive gradebook
- Sync status and last update time
- Grade import/export options
- Backup and restore functions

#### Enrollment Management

**Approving Students:**
1. Review pending enrollment requests
2. Verify student information
3. Click "Approve" to add student to gradebook
4. Send welcome notifications

**Managing Enrollment Codes:**
- Codes are automatically generated (6 characters)
- Share codes via multiple methods:
  - Direct code sharing: `ABC123`
  - URL sharing: `https://yoursite.com/enroll/ABC123`
  - QR codes for mobile devices
- Regenerate codes if needed for security

**Bulk Operations:**
- Approve multiple enrollments at once
- Export student rosters
- Send mass communications

## 📊 Grading and Assessment

### OneDrive Gradebook Integration

Tiger Grades creates and manages Excel gradebooks in your OneDrive:

#### Gradebook Structure

**Automatic Setup:**
- Student roster populated from enrollments
- Category columns based on your class configuration
- Formulas for automatic grade calculation
- Summary statistics and analytics

**Default Categories:**
- **Homework** (20% default weight)
- **Quizzes** (25% default weight)
- **Tests** (35% default weight)
- **Projects** (20% default weight)

#### Working with Your Gradebook

**Accessing the Gradebook:**
1. Click "Open Gradebook" in class management
2. Excel opens in OneDrive (web or desktop)
3. Make changes directly in Excel
4. Changes sync automatically with Tiger Grades

**Best Practices:**
- Enter grades consistently (use same scale)
- Include assignment names and dates
- Use Excel's data validation for grade ranges
- Regular backup through OneDrive versioning

**Grade Entry Methods:**
- Direct Excel entry (recommended)
- Copy/paste from other systems
- CSV import for bulk updates
- Mobile Excel app for on-the-go updates

### Customizing Grade Categories

#### Modifying Weights

Change category importance to match your grading policy:

```excel
// Example weight distribution
Participation: 10%
Homework: 20%
Quizzes: 25%
Tests: 30%
Final Project: 15%
```

#### Adding New Categories

1. **In Excel:** Add new column with category name
2. **Update formulas:** Modify calculation cells
3. **Set weights:** Ensure all categories total 100%
4. **Test calculations:** Verify with sample data

#### Advanced Grading Options

**Standards-Based Grading:**
- Create separate sheets for different standards
- Use proficiency scales (1-4, Beginning-Mastery, etc.)
- Link to overall grade calculations

**Weighted Averages:**
- Configure complex weighting schemes
- Account for dropped lowest scores
- Handle extra credit and bonus points

## 📈 Reports and Analytics

### Generating Report Cards

Tiger Grades automatically creates comprehensive report cards:

#### Individual Student Reports

Access via class management or parent view:

**Report Contents:**
- Overall grade with letter grade conversion
- Category breakdown with individual scores
- Assignment-level details with dates
- Progress trends and improvement areas
- Teacher comments and feedback

**Customization Options:**
- Add personalized comments
- Include attendance data
- Highlight achievements and areas for growth
- Attach additional documentation

#### Class Analytics

Monitor overall class performance:

**Grade Distribution:**
- Histogram of final grades
- Category performance comparison
- Trend analysis over time
- Outlier identification

**Student Progress Tracking:**
- Individual student improvement curves
- Class-wide progress indicators
- Assignment difficulty analysis
- Participation metrics

### Exporting Data

**Export Formats:**
- PDF report cards for printing/emailing
- Excel spreadsheets for further analysis
- CSV files for importing to other systems
- JSON data for technical integration

**Bulk Export Options:**
- All student report cards at once
- Grade rosters for administrative use
- Progress reports for parent conferences
- End-of-term grade submissions

## 📧 Communication Tools

### Parent Engagement

**Automated Notifications:**
- Grade posting alerts
- Assignment due date reminders
- Progress report availability
- Important class announcements

**Direct Communication:**
- Send messages through Tiger Grades
- Schedule parent conferences
- Share additional resources and links
- Provide feedback on student work

### Student Communication

**Transparency Tools:**
- Students can view their own grades
- Progress tracking and goal setting
- Assignment calendar integration
- Achievement recognition

## 🛠️ Advanced Features

### Multiple Class Management

**Efficient Workflows:**
- Dashboard overview of all classes
- Bulk operations across classes
- Consistent grading policies
- Streamlined reporting

**Class Templates:**
- Save successful class configurations
- Replicate grading structures
- Standard category setups
- Quick class creation

### Integration with School Systems

**Data Import/Export:**
- Student Information System (SIS) integration
- Learning Management System (LMS) synchronization
- State reporting system exports
- Backup and archive functions

**Microsoft 365 Integration:**
- OneDrive storage and sync
- Excel for gradebook management
- Teams integration for communication
- Calendar sync for due dates

## 🔧 Troubleshooting Common Issues

### Gradebook Problems

**Sync Issues:**
- Refresh browser and check OneDrive status
- Verify internet connection and Microsoft authentication
- Check file permissions in OneDrive
- Contact admin if persistent issues

**Formula Errors:**
- Verify category weights sum to 100%
- Check for circular references in Excel
- Ensure consistent data types (numbers vs. text)
- Use Excel's error checking tools

**Missing Students:**
- Confirm student enrollment is approved
- Check if student was accidentally archived
- Verify spelling of student names
- Re-sync gradebook if necessary

### Access and Permission Issues

**Can't Create Classes:**
- Verify you have teacher role assigned
- Check with administrator about permissions
- Ensure account is fully activated
- Review any institutional policies

**OneDrive Access Problems:**
- Confirm Microsoft 365 account is linked
- Check Azure app permissions
- Verify OneDrive storage availability
- Re-authenticate if needed

### Performance Issues

**Slow Loading:**
- Check internet connection speed
- Clear browser cache and cookies
- Try different browser or incognito mode
- Report persistent issues to IT support

**Large Class Management:**
- Use filtering and search functions
- Consider breaking very large classes into sections
- Optimize Excel formulas for performance
- Regular gradebook maintenance

## 📚 Best Practices

### Classroom Implementation

**Setup Phase:**
1. Plan your grading categories before class creation
2. Communicate grading policy to students and parents
3. Test the system with sample data
4. Train students on accessing their grades

**Ongoing Management:**
1. Enter grades regularly (weekly recommended)
2. Provide timely feedback through comments
3. Monitor student progress trends
4. Maintain regular communication with parents

**End of Term:**
1. Verify all grades are entered and calculated correctly
2. Generate final report cards
3. Export data for permanent records
4. Archive class for future reference

### Professional Development

**Maximizing Efficiency:**
- Learn Excel keyboard shortcuts
- Set up grade entry routines
- Use templates for consistent feedback
- Automate repetitive tasks where possible

**Staying Current:**
- Follow Tiger Grades updates and new features
- Participate in user community discussions
- Share best practices with colleagues
- Provide feedback for system improvements

---

## 🆘 Getting Help

**Documentation Resources:**
- [Installation Guide](/docs/getting-started/installation)
- [Feature Documentation](/docs/features/grading-system)
- [Developer Guide](/docs/developer-guide/architecture)

**Support Channels:**
- Contact your system administrator
- Check the troubleshooting guide
- Submit support tickets for technical issues
- Join the user community forum

**Training Opportunities:**
- Online tutorials and video guides
- Professional development workshops
- Peer mentoring programs
- Educational conference sessions

---

Tiger Grades empowers you to focus on what matters most: teaching and student success. With these tools and best practices, you'll be able to efficiently manage your classes while providing transparent, timely feedback to students and parents. 🎓 