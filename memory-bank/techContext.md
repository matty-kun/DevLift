# Technical Context: DevLift

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend & Infrastructure
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel (planned)

## Development Environment

### Tools
- **Package Manager**: npm
- **Build Tool**: Vite
- **Version Control**: Git
- **IDE**: VS Code (recommended)
- **Linting**: ESLint
- **Formatting**: Prettier

### Environment Variables
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Project Structure

```
src/
├── components/
│   ├── common/        # Reusable UI components
│   ├── layout/        # Layout components
│   └── features/      # Feature-specific components
├── contexts/          # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and configurations
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Key Dependencies

- **react**: Core React library
- **react-dom**: React DOM rendering
- **react-router-dom**: Routing for React
- **@supabase/supabase-js**: Supabase client
- **react-hook-form**: Form handling
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

## Design System

### Colors
- **Background**: Black (`#000000`)
- **Primary Accent**: Cyan (`#19c3f7`)
- **Secondary Accent**: Purple (`#7b2ff2`)
- **Tertiary Accent**: Orange (`#f74a19`)
- **Text**: White for primary text, gray variants for secondary text

### Typography
- **Font Family**: Inter (fallback to system fonts)
- **Heading Sizes**: Based on Tailwind's text-sm through text-6xl scale
- **Font Weights**: Regular (400), Medium (500), Bold (700)

### Spacing
Using Tailwind's spacing scale for consistency:
- 4px = 1
- 8px = 2
- 16px = 4
- 24px = 6
- 32px = 8
- etc.

## Authentication System

DevLift uses Supabase Auth for user authentication with email/password:

1. **Sign Up**: Create account with email, password, and user type
2. **Sign In**: Authenticate with email and password
3. **User Type**: Stored in both Supabase Auth metadata and a separate user_profiles table
4. **Session Management**: Handled by Supabase client with auto-refresh

## Database Schema (Supabase)

### Tables

#### user_profiles
- id (UUID, references auth.users.id)
- user_type (enum: 'student', 'founder')
- display_name (text)
- bio (text)
- skills (array, for students)
- company_name (text, for founders)
- created_at (timestamp)
- updated_at (timestamp)

#### projects
- id (UUID)
- founder_id (UUID, references user_profiles.id)
- title (text)
- description (text)
- requirements (text)
- skills_needed (array)
- status (enum: 'open', 'in_progress', 'completed')
- created_at (timestamp)
- updated_at (timestamp)

#### applications
- id (UUID)
- project_id (UUID, references projects.id)
- student_id (UUID, references user_profiles.id)
- message (text)
- status (enum: 'pending', 'accepted', 'rejected')
- created_at (timestamp)
- updated_at (timestamp)

## API Integration

DevLift uses the Supabase client for all API interactions:

```typescript
// Authentication
const { data, error } = await supabase.auth.signUp({ email, password });

// Database operations
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'open');
```

## Performance Considerations

- Lazy loading of page components
- Optimized image loading
- Efficient state management with Context API
- Pagination for data-heavy views
- Responsive design for all device sizes

## Security Considerations

- Authentication handled by Supabase
- Row-level security policies in Supabase
- Form validation to prevent injection attacks
- Environment variables for sensitive information
- HTTPS for all communications 