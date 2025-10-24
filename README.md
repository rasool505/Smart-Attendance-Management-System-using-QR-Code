# Smart Attendance Management System using QR Code

A web-based attendance management system that records attendance using QR codes.  
Built with React, Express, and MongoDB, this project automates attendance tracking, reduces manual errors, and provides real-time reports through a clean and modern dashboard.

---

## 🚀 Features
- 🔐 User Authentication (Admin, Teacher, Student)
- 🧾 Generate Unique QR Codes for each user
- 📷 Scan QR Codes using the device camera
- 🕒 Automatic Attendance Logging with date & time
- 📊 View Reports (daily, weekly, monthly)
- 📁 Export Data in CSV or PDF format
- 🧠 Modern UI built with React and Tailwind CSS

---

## Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React.js |
| Backend | Node.js (Express.js) |
| Database | MongoDB |
| Authentication | JSON Web Token (JWT) |
| QR Code | qrcode.react, react-qr-reader |

---

## ⚙️ How It Works
1. Each user is registered in the system and assigned a unique QR code.  
2. When the QR code is scanned by an admin or teacher, the system validates it.  
3. The attendance record (user, date, and time) is automatically saved in the database.  
4. Admins can view and export reports from the dashboard.

---

## 📈 Future Improvements
- 📧 Add email/SMS notifications for absentees  
- 🧠 Integrate facial recognition for authentication  
- 🏫 Connect with university management systems  
- 📊 Add advanced analytics and visual dashboards  
