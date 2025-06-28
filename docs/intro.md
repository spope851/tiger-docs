---
sidebar_position: 1
---

# Welcome to Tiger Grades 🐅

**Tiger Grades** is a revolutionary WordPress plugin that transforms education management through intelligent automation, seamless cloud integration, and real-time grade synchronization. Built with enterprise-grade architecture and modern PHP patterns, Tiger Grades empowers educators with tools that were previously only available to large institutions.

## 🚀 What Makes Tiger Grades Special?

Tiger Grades isn't just another gradebook—it's an **education intelligence platform** that bridges the gap between traditional classroom management and modern cloud-based workflows:

- **🏫 Multi-Role Architecture**: Seamlessly orchestrates workflows for teachers, parents, students, and administrators
- **☁️ Azure-Powered Backend**: Leverages Microsoft Graph API and Azure Functions for enterprise-scale reliability
- **📊 Real-Time Synchronization**: Bi-directional sync between Excel/OneDrive gradebooks and WordPress
- **🌐 Internationalization Ready**: Built-in support for English and Mandarin with extensible translation framework
- **🔐 Enterprise Security**: JWT authentication, role-based permissions, and GDPR-compliant data handling

## ✨ Revolutionary Features

### 🎯 **Intelligent Class Management**
```php
// Automated gradebook creation via Azure Functions
$teacher->createClass([
    'title' => 'Advanced Mathematics',
    'type' => 'Math',
    'students' => '25-50',
    'categories' => '5-10'
]);
// Result: Excel gradebook auto-created in OneDrive
```

- **Smart Enrollment Codes**: Auto-generated 6-digit codes with QR code sharing
- **Azure Integration**: Automated OneDrive folder and Excel gradebook creation
- **Real-Time Status Updates**: WebSocket-style updates for class activation
- **Dynamic Category Management**: Weighted grading categories with live calculation

### 📈 **Advanced Grading Engine**
- **Multi-Semester Support**: Handle complex academic calendars with ease
- **Category Weighting**: Sophisticated percentage-based grade calculations
- **Standards-Based Grading**: Support for traditional and competency-based systems
- **Automated Analytics**: Progress tracking with visual trend analysis
- **PDF Export Pipeline**: Professional report cards with customizable templates

### 🔗 **Microsoft 365 Deep Integration**
```javascript
// Real-time grade fetching from Excel via Graph API
const grades = await fetch('/wp-json/tiger-grades/v1/report-card', {
    headers: { 'Authorization': `Bearer ${token}` }
});
// Direct Excel integration - no manual imports needed
```

- **Graph API Integration**: Direct connection to Microsoft 365 ecosystem
- **OneDrive Synchronization**: Seamless file management and backup
- **Excel Formula Support**: Maintain complex spreadsheet logic
- **Azure Functions Orchestration**: Serverless microservices for scalability

## 🎯 Perfect For

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <div style={{padding: '1.5rem', border: '2px solid #e1e4e8', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
    <h3>🏫 K-12 Schools</h3>
    <p>Modern gradebook solutions with enterprise security and parent engagement tools</p>
  </div>
  <div style={{padding: '1.5rem', border: '2px solid #e1e4e8', borderRadius: '12px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
    <h3>🎓 Tutoring Centers</h3>
    <p>Multi-teacher coordination with centralized student progress tracking</p>
  </div>
  <div style={{padding: '1.5rem', border: '2px solid #e1e4e8', borderRadius: '12px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white'}}>
    <h3>🏠 Homeschool Networks</h3>
    <p>Collaborative education management for homeschool cooperatives</p>
  </div>
  <div style={{padding: '1.5rem', border: '2px solid #e1e4e8', borderRadius: '12px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white'}}>
    <h3>📚 Educational Consultants</h3>
    <p>Cross-program student tracking with detailed analytics</p>
  </div>
</div>

## 🛠️ Technical Excellence

Tiger Grades showcases modern PHP development practices and enterprise architecture:

### **Core Architecture**
- **🏗️ Object-Oriented Design**: Namespaced PHP classes with dependency injection
- **📡 RESTful API Layer**: Comprehensive endpoints with JWT authentication
- **🗄️ Advanced Database Schema**: Normalized tables with foreign key constraints
- **🔄 Event-Driven Updates**: Database triggers for automated status management

### **Integration Ecosystem**
- **Microsoft Graph API**: OAuth 2.0 client credentials flow
- **Azure Functions**: Serverless orchestration for gradebook creation
- **WordPress Plugin API**: Native hooks, filters, and shortcode system
- **Modern Frontend**: Vanilla JavaScript with AJAX and real-time updates

### **Security & Compliance**
- **🔐 Multi-Layer Authentication**: WordPress sessions + JWT tokens
- **👥 Role-Based Access Control**: Granular permissions per feature
- **🛡️ GDPR Compliance**: Data minimization and privacy by design
- **🚨 Input Validation**: Comprehensive sanitization and escape protocols

## 📈 Getting Started Paths

Choose your journey based on your role and needs:

<div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
  <div style={{flex: '1 1 300px', padding: '1.5rem', border: '1px solid #e1e4e8', borderRadius: '8px'}}>
    <h3>🚀 Quick Installation</h3>
    <p>Get Tiger Grades running in your WordPress environment</p>
    <a href="/docs/getting-started/installation" style={{color: '#007acc', fontWeight: 'bold'}}>Installation Guide →</a>
  </div>
  <div style={{flex: '1 1 300px', padding: '1.5rem', border: '1px solid #e1e4e8', borderRadius: '8px'}}>
    <h3>👩‍🏫 Teacher Onboarding</h3>
    <p>Master class creation and gradebook management</p>
    <a href="/docs/user-guides/teachers" style={{color: '#007acc', fontWeight: 'bold'}}>Teacher Guide →</a>
  </div>
  <div style={{flex: '1 1 300px', padding: '1.5rem', border: '1px solid #e1e4e8', borderRadius: '8px'}}>
    <h3>👨‍💻 Developer Deep Dive</h3>
    <p>Explore APIs, hooks, and customization options</p>
    <a href="/docs/developer-guide/architecture" style={{color: '#007acc', fontWeight: 'bold'}}>Developer Docs →</a>
  </div>
</div>

## 🎉 Latest Release: v0.1.1

Our latest release brings **revolutionary Azure integration**, enhanced API architecture, and robust class management workflows. Major highlights include:

- **🆕 Microsoft Graph API Integration**: Direct Excel/OneDrive synchronization
- **⚡ Azure Functions Orchestration**: Serverless gradebook creation pipeline
- **🔧 Enhanced REST APIs**: Comprehensive endpoints for all user roles
- **📱 Mobile-Optimized UI**: Responsive design for all devices
- **🌍 Multilingual Support**: English and Mandarin localization

[Explore Release Notes →](/blog)

## 🌟 What Educators Say

:::tip Success Story
"Tiger Grades transformed our tutoring center's workflow. The automatic Excel integration saves us 10+ hours per week, and parents love the real-time grade access!"
— *Sarah Chen, Director of Academic Excellence*
:::

:::info Quick Setup Tip
Tiger Grades works best with **Microsoft 365 Education accounts**. Set up your Azure app registration first for seamless OneDrive integration!
:::

---

**Ready to revolutionize your educational workflow?** 

Start with our [Installation Guide](/docs/getting-started/installation) and join the growing community of educators using Tiger Grades to streamline their teaching and engage their students' families like never before!

<div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
  <strong>🎯 Pro Tip:</strong> Check out our <a href="/docs/features/microsoft-integration">Microsoft Integration guide</a> to unlock the full potential of cloud-based gradebook management!
</div>
