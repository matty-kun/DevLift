# Active Context: DevLift

## Current Focus
We are currently implementing the core authentication and user experience for DevLift. The focus is on:

1. **Authentication System**: Implementing sign-in and sign-up flows with user type selection
2. **User Interface**: Developing a consistent dark theme with custom accent colors
3. **Dashboard Views**: Creating separate dashboards for students and founders
4. **Profile Pages**: Building user profile pages with appropriate information for each user type

## Recent Changes
- Updated AuthContext to include user type (student/founder)
- Created SignUp page with user type selection
- Implemented Dashboard page with conditional rendering based on user type
- Updated UI components (Button, Card, Input) to use our dark theme
- Fixed styling issues in SignIn page
- Created comprehensive documentation in the memory bank

## Active Decisions

### User Type Implementation
We've decided to store the user type in both:
1. Supabase Auth metadata (for quick access during authentication)
2. A separate user_profiles table (for more detailed user information)

This approach provides flexibility while maintaining performance for authentication flows.

### UI Design System
We're using a dark theme with three accent colors:
- Cyan (`#19c3f7`): Primary accent for interactive elements
- Purple (`#7b2ff2`): Secondary accent for special elements
- Orange (`#f74a19`): Tertiary accent for calls-to-action

The background is pure black with various gray tones for cards and other UI elements.

### Communication Strategy
For the MVP, we're focusing on external communication rather than building a messaging system. Users will be directed to external platforms (email, Slack, etc.) for communication.

## Next Steps

### Immediate Tasks
1. Complete the Projects page for browsing available projects
2. Implement project creation flow for founders
3. Create the project application system for students
4. Add form validation and error handling to all forms
5. Implement protected routes for authenticated users

### Upcoming Features
1. Project search and filtering
2. Enhanced user profiles with portfolio showcases
3. Application tracking for both students and founders
4. Skill matching algorithm for project recommendations
5. Analytics dashboard for founders

## Current Challenges
1. **User Onboarding**: Creating a smooth onboarding experience for both user types
2. **Project Discovery**: Designing an effective way for students to find relevant projects
3. **Mobile Responsiveness**: Ensuring the UI works well on all device sizes
4. **Data Modeling**: Finalizing the database schema for projects and applications
5. **Authentication Edge Cases**: Handling account verification, password reset, etc.

## Technical Considerations
1. Using React Context API effectively for state management
2. Optimizing performance with appropriate component memoization
3. Implementing proper error handling for API calls
4. Ensuring consistent styling across the application
5. Managing form state and validation with React Hook Form 