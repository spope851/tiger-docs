# First Setup - Creating Your First Class

Ready to see Tiger Grades in action? This guide will walk you through creating your first class, enrolling students, and entering grades. By the end, you'll have a fully functional classroom setup!

## 🎯 What You'll Accomplish

In this tutorial, you'll:
- Create your first class as a teacher
- Generate an enrollment code for students
- Set up the gradebook structure
- Enroll your first student
- Enter sample grades
- Generate your first report card

**Estimated Time**: 15-20 minutes

## 👩‍🏫 Step 1: Create a Teacher Account

First, you'll need a teacher account to create classes:

### Option A: Create via WordPress Admin

1. **Navigate to Users**
   - Go to `Users > Add New` in your WordPress admin
   - Fill in the user details:
     ```
     Username: mrs.johnson
     Email: johnson@yourschool.edu
     First Name: Sarah
     Last Name: Johnson
     Role: Teacher
     ```

2. **Set Password**
   - Generate a strong password
   - Send login credentials to the teacher

### Option B: Self-Registration (if enabled)

1. **Visit Registration Page**
   - Navigate to your registration page
   - Use the shortcode `[tigr_registration]`

2. **Select Teacher Registration**
   - Toggle to "Teacher Registration"
   - Fill out the registration form
   - Submit and await approval (if required)

## 🏫 Step 2: Create Your First Class

Now let's create a class using the teacher account:

### Access the Teacher Dashboard

1. **Login as Teacher**
   - Use the teacher credentials you just created
   - Navigate to your site's teacher dashboard page

2. **Teacher Dashboard Overview**
   - You'll see the `[tigr_teacher_dashboard]` shortcode output
   - Initially shows "No classes found" message
   - Click "Create New Class" button

### Fill Out Class Details

Complete the class registration form:

**Basic Information**
```
Class Title: 7th Grade Mathematics
Subject Type: Math
Description: Introduction to algebra and geometry concepts for 7th grade students
```

**Scheduling**
```
Start Date: [Current date]
End Date: [6 months from now]
```

**Capacity Planning**
```
Estimated Students: 11-30 (select from dropdown)
Number of Categories: 1-5 (select from dropdown)
```

**Optional Settings**
```
Class Message: Welcome to our exciting math journey! 🧮
```

### Submit and Confirm

1. **Review Information**
   - Double-check all entered details
   - Ensure dates make sense for your academic calendar

2. **Submit Class Registration**
   - Click "Register Class"
   - System will create the class with "pending" status
   - Azure integration will create the OneDrive gradebook

3. **Wait for Activation**
   - Class status changes to "active" once gradebook is ready
   - Usually takes 30-60 seconds
   - Refresh the page to see updated status

## 📝 Step 3: Set Up Your Gradebook

Once your class is active, configure the grading structure:

### Access Class Management

1. **View Class Details**
   - Click on your newly created class
   - This uses the `[tigr_class_management]` shortcode

2. **Gradebook Integration**
   - Your OneDrive gradebook is automatically created
   - Named according to your class title and teacher name
   - Located in your OneDrive under Tiger Grades folder

### Configure Categories

The gradebook includes these default categories:
- **Homework** (20% weight)
- **Quizzes** (25% weight)
- **Tests** (35% weight)
- **Projects** (20% weight)

You can customize these weights in Excel or OneDrive.

## 👨‍🎓 Step 4: Enroll Your First Student

Now let's get students into your class:

### Generate Enrollment Code

1. **Copy Enrollment Code**
   - In class management, find the 6-character enrollment code
   - Example: `MAT7AB`
   - Share this code with students/parents

2. **Alternative: Copy Direct URL**
   - Click "Copy URL" for a direct enrollment link
   - Example: `https://yoursite.com/enroll/MAT7AB`

3. **QR Code Option**
   - Click "View QR Code" for mobile-friendly enrollment
   - Students can scan to access enrollment form directly

### Student Enrollment Process

Simulate a student enrolling:

1. **Visit Enrollment Page**
   - Go to your enrollment page with `[tigr_enroll_class]` shortcode
   - Or use the direct URL you copied

2. **Enter Enrollment Details**
   ```
   Enrollment Code: MAT7AB
   Student Name: Alex Thompson
   Parent/Guardian Email: parent@email.com
   Message: Excited to learn math this year!
   ```

3. **Submit Enrollment**
   - Click "Enroll in Class"
   - Creates enrollment with "pending" status
   - Parent receives notification email

### Approve Enrollment

As the teacher, approve the enrollment:

1. **Review Pending Enrollments**
   - Return to class management page
   - See pending enrollment requests
   - Review student information

2. **Approve Student**
   - Click "Approve" next to the enrollment
   - Student is added to gradebook
   - Status changes to "approved"
   - Notifications sent to parent

## 📊 Step 5: Enter Sample Grades

Let's add some grades to see the system in action:

### Access OneDrive Gradebook

1. **Open Your Gradebook**
   - Click "Open Gradebook" in class management
   - This opens your Excel file in OneDrive
   - Alternatively, find it in your OneDrive folder

2. **Gradebook Structure**
   Your gradebook includes:
   - Student roster (automatically populated)
   - Category columns for different assignment types
   - Automatic calculation formulas
   - Summary statistics

### Enter Sample Data

Add some sample grades for Alex Thompson:

**Homework Category (20%)**
```
HW1: 85%
HW2: 92%
HW3: 78%
```

**Quiz Category (25%)**
```
Quiz 1: 88%
Quiz 2: 91%
```

**Test Category (35%)**
```
Test 1: 84%
```

**Projects Category (20%)**
```
Project 1: 95%
```

### Save and Sync

1. **Save in OneDrive**
   - Excel automatically saves changes
   - Data syncs with Tiger Grades system

2. **Verify in WordPress**
   - Return to your WordPress site
   - Check that grades appear in the system
   - May take a few minutes to sync

## 📋 Step 6: Generate Your First Report Card

Now let's see the report card functionality:

### Access Parent View

1. **Login as Parent**
   - Create a parent account if needed
   - Use the email from the enrollment process

2. **View Parent Classes**
   - Navigate to page with `[tigr_parent_classes]` shortcode
   - See your child's enrolled classes

3. **Access Report Card**
   - Click on the Math class
   - View detailed grade breakdown

### Report Card Features

The report card displays:
- **Overall Grade**: Calculated from category weights
- **Category Breakdown**: Performance in each area
- **Assignment Details**: Individual grades and dates
- **Progress Tracking**: Trends over time
- **Export Options**: PDF download capability

### Teacher Report View

Teachers can also view detailed reports:

1. **Access Class Management**
   - Return to teacher dashboard
   - Click on your class

2. **View All Students**
   - See class-wide performance
   - Individual student details
   - Grade distribution analytics

## 🎉 Congratulations!

You've successfully:
- ✅ Created a teacher account
- ✅ Set up your first class
- ✅ Configured gradebook integration
- ✅ Enrolled a student
- ✅ Entered sample grades
- ✅ Generated report cards

## 🚀 Next Steps

Now that you have the basics working, explore these advanced features:

### Expand Your Class
- Enroll more students using the same enrollment code
- Try different enrollment workflows
- Set up parent notifications

### Advanced Grading
- Customize category weights in Excel
- Add new assignment types
- Set up grading scales

### System Administration
- Configure user permissions
- Set up automated notifications
- Monitor system performance

### Integration Options
- Connect additional Microsoft services
- Set up automated backups
- Configure advanced security

## 🛠️ Troubleshooting Quick Fixes

**Class Won't Activate?**
- Check Azure configuration
- Verify OneDrive permissions
- Review error logs

**Grades Not Syncing?**
- Refresh the page
- Check Excel file permissions
- Verify formulas in gradebook

**Enrollment Issues?**
- Confirm enrollment code is correct
- Check user permissions
- Verify email delivery

**Report Card Problems?**
- Ensure student has grades
- Check category calculations
- Verify parent permissions

## 📚 Additional Resources

- [Teacher User Guide](/docs/user-guides/teachers) - Comprehensive teacher features
- [Parent User Guide](/docs/user-guides/parents) - Parent portal guide
- [Grading System Details](/docs/features/grading-system) - Advanced grading options
- [Microsoft Integration](/docs/features/microsoft-integration) - OneDrive setup
- [Troubleshooting Guide](/docs/deployment/troubleshooting) - Common issues

---

**Ready to Scale Up?** Your Tiger Grades system is now operational! Invite more teachers to create classes and start transforming your educational workflow. 🐅📚 