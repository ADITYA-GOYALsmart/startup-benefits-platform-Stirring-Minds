# Startup Benefits Platform

A full-stack web application built with Next.js that provides exclusive SaaS deals for early-stage startups. Users can browse, filter, and claim deals, with locked deals requiring verification.

## 🚀 Features

- **User Authentication**: JWT-based registration and login
- **Deal Management**: Browse, search, and filter deals by category
- **Claim System**: Claim deals with status tracking (pending/approved/rejected)
- **Verification System**: Locked deals require user verification
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth animations using Framer Motion
- **Real-time Updates**: Dynamic UI updates based on user actions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod schemas

### Application Flow

1. **Registration/Login**: Users create accounts and authenticate
2. **Browse Deals**: View all available deals with filtering and search
3. **Claim Deals**: Submit claims for deals (locked deals require verification)
4. **Dashboard**: View profile and claim status

### Data Models

#### User
- Email, password (hashed), name
- Verification status (boolean)
- Timestamps

#### Deal
- Title, description, partner info
- Category, eligibility requirements
- Locked/unlocked status

#### Claim
- User-deal relationship
- Status: pending/approved/rejected
- Timestamps

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-benefits-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/startup-benefits
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start MongoDB**
   Ensure MongoDB is running locally or update `MONGODB_URI` for cloud instance.

5. **Seed the database**
   ```bash
   npx tsx src/lib/seed.ts
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── deals/         # Deal management
│   │   └── claims/        # Claim management
│   ├── deals/             # Deal pages
│   ├── dashboard/         # User dashboard
│   ├── auth/              # Auth pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts            # JWT utilities
│   ├── db.ts              # Database connection
│   ├── seed.ts            # Database seeding
│   └── validators.ts      # Input validation
└── models/                # Mongoose schemas
    ├── User.ts
    ├── Deal.ts
    └── Claim.ts
```

## 🔐 Authentication & Authorization

### JWT Implementation
- Tokens stored in HTTP-only cookies for security
- Automatic token verification on protected routes
- 7-day token expiration

### Verification System
- Simple boolean flag on User model
- "Verify Me" button in dashboard for demo purposes
- Locked deals check verification status before allowing claims

## 🎨 UI/UX Design

### Animations
- Page transitions with fade-in effects
- Hover states on interactive elements
- Loading spinners and skeleton states
- Subtle, professional animations using Framer Motion

### Responsive Design
- Mobile-first approach
- Consistent spacing and typography
- Accessible color contrasts
- Touch-friendly interactive elements

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with valid/invalid data
- [ ] User login with correct/incorrect credentials
- [ ] JWT token persistence across sessions
- [ ] Protected route access control

#### Deal Management
- [ ] Deal listing with pagination/filtering
- [ ] Deal search functionality
- [ ] Locked deal visual indicators
- [ ] Deal detail page rendering

#### Claim System
- [ ] Claim submission for unlocked deals
- [ ] Verification requirement for locked deals
- [ ] Duplicate claim prevention
- [ ] Claim status updates

#### UI/UX
- [ ] Responsive design on mobile/desktop
- [ ] Animation smoothness
- [ ] Loading states
- [ ] Error handling

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Deals
- `GET /api/deals` - List deals (with filters)
- `GET /api/deals/[id]` - Get deal details

### Claims
- `POST /api/claims` - Submit deal claim
- `GET /api/claims/user` - Get user's claims

## 🔮 Production Readiness

### What's Missing for Production
- **Security**: Rate limiting, CSRF protection, input sanitization
- **Error Handling**: Comprehensive error logging and monitoring
- **Testing**: Unit tests, integration tests, E2E tests
- **Performance**: Caching, CDN, database optimization
- **Deployment**: Docker containerization, CI/CD pipeline
- **Admin Panel**: Deal management interface
- **Email Integration**: Verification emails, notifications
- **Payment Processing**: For premium features
- **Analytics**: User behavior tracking

### Environment Variables
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx) for API routes
4. Set up MongoDB replica set for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built as a student-level full-stack project
- Uses modern Next.js patterns and best practices
- Designed for learning and demonstration purposes
