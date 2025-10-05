# Companies Directory - Frontend Developer Interview Project

A comprehensive, responsive data grid application built for a frontend developer interview position. This project demonstrates advanced React/Next.js skills, modern UI/UX design, and full-stack integration capabilities.

## 🎯 Project Overview

This application showcases a complete CRUD (Create, Read, Update, Delete) system with a modern, responsive interface. Built as a demonstration of frontend development skills, it includes advanced features like real-time data management, confirmation modals, filtering, searching, and pagination.

## 🚀 Key Features Demonstrated

### Frontend Excellence

- **Modern React Architecture**: Built with Next.js 14, TypeScript, and React hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Advanced UI Components**: Custom data grid, modals, and confirmation dialogs
- **State Management**: Complex state handling with React hooks
- **Type Safety**: Full TypeScript implementation with proper interfaces

### User Experience

- **Confirmation Modals**: Safe edit/delete operations with user confirmation
- **Real-time Search**: Instant filtering across all data fields
- **Advanced Filtering**: Multi-column filtering with dropdown selections
- **Pagination**: Efficient data navigation for large datasets
- **Export Functionality**: CSV download with proper data formatting
- **Loading States**: Professional loading and error handling

### Technical Implementation

- **API Integration**: RESTful API communication with JSON Server
- **Error Handling**: Comprehensive error states and user feedback
- **Performance**: Optimized rendering and data processing
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Code Organization**: Modular, reusable component architecture

## 🏗️ Project Structure

```
├── client/                    # Next.js frontend application
│   ├── app/                   # App router structure
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable UI components
│   │   ├── DataGrid.tsx     # Advanced data grid component
│   │   ├── CompanyModal.tsx  # CRUD modal for companies
│   │   ├── ConfirmationModal.tsx # Safety confirmation dialogs
│   │   └── Navbar.tsx       # Navigation component
│   └── package.json         # Frontend dependencies
├── server/                   # JSON Server backend
│   ├── server.js           # Server configuration
│   ├── db.json             # Sample data
│   └── package.json        # Backend dependencies
├── start-dev.bat           # Windows development script
├── start-dev.sh            # Linux/Mac development script
└── README.md               # This documentation
```

## 🛠️ Technologies Used

### Frontend Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **React Hooks**: State and lifecycle management

### Backend & Tools

- **JSON Server**: Mock REST API
- **Node.js**: Runtime environment
- **CORS**: Cross-origin resource sharing

## 🚀 Quick Start

### Option 1: Use Startup Scripts (Recommended)

**Windows:**

```bash
start-dev.bat
```

**Linux/Mac:**

```bash
./start-dev.sh
```

### Option 2: Manual Setup

1. **Start JSON Server:**

```bash
cd server
npm install
npm start
```

2. **Start Next.js Client:**

```bash
cd client
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **JSON Server API**: http://localhost:3001
- **API Endpoints**: http://localhost:3001/companies

## 📊 Data Structure

Each company record includes:

- `id`: Unique identifier
- `name`: Company name
- `location`: Company location
- `industry`: Industry sector
- `employees`: Employee count range
- `revenue`: Revenue range
- `website`: Company website
- `founded`: Year founded
- `status`: Company status (Active/Inactive)

## 🎨 UI/UX Features

### Data Grid Capabilities

- **Multi-column Sorting**: Click headers to sort data
- **Advanced Filtering**: Filter by company name, location, and industry
- **Global Search**: Search across all fields simultaneously
- **Responsive Pagination**: Navigate through large datasets
- **CSV Export**: Download filtered data with proper formatting

### Safety Features

- **Confirmation Modals**: Prevent accidental data loss
- **Form Validation**: Real-time input validation
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations

### Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets for mobile
- **Adaptive Layout**: Components adjust to screen size
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 API Endpoints

The JSON server provides RESTful endpoints:

- `GET /companies` - Retrieve all companies
- `GET /companies/:id` - Get specific company
- `POST /companies` - Create new company
- `PUT /companies/:id` - Update existing company
- `DELETE /companies/:id` - Delete company

## 💡 Interview Highlights

This project demonstrates:

1. **Component Architecture**: Reusable, modular components
2. **State Management**: Complex state handling with hooks
3. **Type Safety**: Full TypeScript implementation
4. **User Experience**: Intuitive interface with safety features
5. **Performance**: Optimized rendering and data processing
6. **Responsive Design**: Mobile-first approach
7. **Error Handling**: Comprehensive error states
8. **Code Quality**: Clean, maintainable code structure

## 🎬 Demo Script

For the demonstration video, follow this script to showcase the application's capabilities effectively.

## 📝 Development Notes

- Built with modern React patterns and best practices
- Implements proper error boundaries and loading states
- Follows accessibility guidelines (WCAG)
- Uses semantic HTML and proper ARIA labels
- Implements responsive design principles

## 🏆 Project Achievements

- ✅ Complete CRUD functionality
- ✅ Advanced data grid with filtering and sorting
- ✅ Confirmation modals for safe operations
- ✅ Responsive design for all devices
- ✅ Type-safe TypeScript implementation
- ✅ Professional UI/UX design
- ✅ Error handling and loading states
- ✅ CSV export functionality

---

**Created by**: Vatsal Bhatti  
**Purpose**: Frontend Developer Interview Demonstration  
**Duration**: 2-3 minute video presentation
