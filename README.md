# CRM System

A Customer Relationship Management system built with React and TypeScript.

## Overview

This CRM system allows you to manage customers and tasks with a simple, intuitive interface. It includes features for:

- Customer management (add, edit, delete, search)
- Task management (create, complete, prioritize)
- Data export/import functionality
- Responsive design

## Features

### Customer Management
- Add new customers with contact information
- View customer list with status indicators
- Search and filter customers
- Edit and delete customer records

### Task Management
- Create tasks with descriptions and priorities
- Mark tasks as complete
- Set due dates for tasks
- Organize tasks by priority level

### User Interface
- Clean, modern design
- Responsive layout for mobile and desktop
- Intuitive navigation with tabs
- Real-time search functionality

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YuvalChen/crm.git
cd crm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.tsx        # Application entry point
└── components/      # Reusable components (to be added)
```

## Known Issues

This project contains several intentional bugs and issues for demonstration purposes:

1. **Form Submission Errors**: Some forms may not work correctly due to state management issues
2. **Memory Leaks**: Search functionality creates new arrays without proper cleanup
3. **Infinite Loops**: Task completion toggle has a setTimeout that causes re-renders
4. **Accessibility Issues**: Missing proper ARIA labels and keyboard navigation
5. **Responsive Design**: Some elements don't work well on mobile devices
6. **Error Handling**: Missing proper error boundaries and validation
7. **Performance Issues**: Unnecessary re-renders and inefficient state updates

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **CSS3** - Styling
- **Create React App** - Build tooling
- **Axios** - HTTP client (for future API integration)
- **Date-fns** - Date manipulation
- **React Router** - Navigation (for future routing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes only.

## Support

For issues or questions, please contact the development team.

---

**Note**: This project is intentionally created with bugs and issues to demonstrate automated code fixing capabilities. It should not be used in production without proper testing and bug fixes.# crm
