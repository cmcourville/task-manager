# TaskMaster - Next.js Project Management System

A modern, responsive web application built with Next.js 14, React 18, and TypeScript for managing engineers and tasks in a project management system.

## 🚀 Features

### Engineers Management
- **View Engineers**: Interactive table showing all engineers with assigned tasks
- **Edit Engineers**: Modify engineer information (name only)
- **Delete Engineers**: Remove engineers (only if they have no assigned tasks)
- **Task Assignment**: View tasks assigned to each engineer
- **Total Workload**: Display total assigned minutes per engineer

### Tasks Management
- **Task Columns**: Organized by status (Unassigned, Assigned, Completed)
- **Edit Tasks**: Modify task details, status, and assignments
- **Delete Tasks**: Remove tasks (only if unassigned)
- **Permanent Assignment**: Once assigned, tasks cannot be reassigned
- **Status Validation**: Tasks can only be completed if assigned to an engineer

### Statistics Dashboard
- **Key Performance Indicators**: Total tasks, completed tasks, unassigned tasks
- **Time Tracking**: Estimated vs actual time analysis
- **Engineer Workloads**: Assigned but not completed task minutes
- **Project Progress**: Completion rates and efficiency metrics

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Custom CSS with pastel pink theme
- **State Management**: React Hooks (useState)
- **Data**: Hardcoded sample data with utility functions

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── engineers/         # Engineers page
│   │   └── page.tsx
│   ├── tasks/             # Tasks page
│   │   └── page.tsx
│   └── stats/             # Statistics page
│       └── page.tsx
├── lib/                   # Utilities and data
│   ├── types.ts           # TypeScript interfaces
│   └── data.ts            # Sample data and calculations
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cmcourville_hw1_analysis
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features

### Interactive UI
- **Modal Dialogs**: View and edit engineers/tasks in popup modals
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Hover effects and transitions
- **Success Notifications**: User feedback for actions

### Business Rules
1. **Permanent Assignment**: Tasks cannot be reassigned once assigned
2. **Delete Protection**: 
   - Engineers can only be deleted if they have 0 assigned tasks
   - Tasks can only be deleted if they are unassigned
3. **Status Validation**: Tasks can only be marked complete if assigned

### Data Management
- **Type Safety**: Full TypeScript support
- **Sample Data**: Pre-loaded with engineers and tasks
- **Real-time Calculations**: Statistics update dynamically
- **Form Validation**: Input validation and error handling

## 🎨 Design

- **Color Scheme**: Pastel pink theme with gradients
- **Layout**: Clean, modern interface with card-based design
- **Typography**: Clear, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects and smooth transitions

## 📊 Sample Data

The application includes:
- **4 Engineers**: Alice Johnson, Bob Smith, Carol Davis, David Wilson
- **9 Tasks**: Various statuses (unassigned, assigned, completed)
- **Realistic Data**: Proper time estimates and assignments

## 🔧 Development

### Adding New Features
1. Create new pages in the `app/` directory
2. Add components in `lib/` for reusable logic
3. Update types in `lib/types.ts` as needed
4. Add new data or calculations in `lib/data.ts`

### Styling
- Global styles are in `app/globals.css`
- Uses CSS classes for consistent styling
- Responsive design with mobile-first approach

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker**

Build command: `npm run build`
Start command: `npm run start`

## 📝 License

This project is part of a CS509 Software Design assignment.

## 🤝 Contributing

This is an academic project. For questions or issues, please contact the repository owner.