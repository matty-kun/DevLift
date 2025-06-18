# DevLift

Real-world Experience for Students & Startups

---

DevLift is a web platform that connects student developers with startup founders to collaborate on real-world projects. Our mission is to bridge the gap between academic learning and practical experience for students, while providing startups with access to emerging talent.

## 🚀 Why DevLift?
- **For Students:** Gain hands-on experience, build your portfolio, and connect with real startups.
- **For Founders:** Access skilled student talent to accelerate your product development.

## ✨ Key Features
- Distinct user types: **Student** & **Founder**
- Project listing, discovery, and application system
- User profiles with skills, experience, and portfolio
- Project tracking and status updates
- Secure authentication (Supabase, JWT)
- Responsive, mobile-first dark UI with custom accent colors
- External communication links (email, LinkedIn, etc.)

## 🖌️ Design & UX Principles
- **Dark mode only**: Black background, high-contrast white text
- **Accent colors**: Cyan (#19c3f7), Purple (#7b2ff2), Orange (#f74a19)
- **Modern UI**: Subtle transitions (200-300ms), gradients for hierarchy, and animated interactive elements
- **Consistent spacing**: Tailwind's spacing system
- **Mobile-first**: Fully responsive layouts
- **Accessible**: Minimum 4.5:1 contrast ratio

## 🏗️ Tech Stack
- **Frontend**: React (TypeScript), Vite
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **State**: React Context API
- **Auth & DB**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## 📁 Project Structure
```
src/
  components/
    common/    # Reusable UI components
    layout/    # Layout components
    home/      # Home page sections
    projects/  # Project-related components
  contexts/    # React Context providers
  lib/         # Supabase client, utilities
  pages/       # Page components
  types/       # TypeScript types
```

## 🛠️ Development Notes
- All components use functional syntax and TypeScript interfaces
- Forms use React Hook Form with inline validation
- State is managed via Context API and local state
- All styling is via Tailwind utility classes (no custom CSS)
- Authentication uses JWT (stored in localStorage)
- Protected routes for authenticated users
- User type selection during signup

## 🧑‍💻 Contributing
Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

## 📣 Contact & Support
For questions or support, please open an issue or contact the maintainers via the project repository.

## 📊 Roadmap
- [x] Core authentication & user profiles
- [x] Project listing & discovery
- [x] Protected routes
- [ ] Project creation & application system
- [ ] Enhanced profiles & portfolio
- [ ] Analytics & advanced features

## 📝 License
MIT License. See [LICENSE](LICENSE) for details.
