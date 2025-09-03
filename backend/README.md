# TravelHub - Full Stack Travel Booking Platform

A complete travel booking platform built with Node.js, Express, MySQL, and React. This application allows tourists to discover and book tours, guides to create and manage tours, and administrators to oversee the entire platform.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Separate systems for tourists, guides, and administrators
- **Tour Management**: Complete CRUD operations for tours with location, pricing, and scheduling
- **Booking System**: Full booking workflow with payment processing
- **User Management**: Comprehensive admin panel for managing all user types
- **Payment Processing**: Track and manage financial transactions
- **Notification System**: Send and manage system-wide notifications
- **Rating & Review System**: Allow tourists to rate and review tours
- **Password Reset**: Secure password recovery functionality

### User Roles

#### 🧳 Tourists
- Browse available tours with filtering and search
- Book tours and process payments
- View booking history and status
- Rate and review completed tours
- Manage personal profile

#### 🗺️ Guides
- Create and manage tour listings
- Set pricing, schedules, and availability
- View booking statistics and revenue
- Update tour details and status
- Manage personal profile and verification

#### 👨‍💼 Administrators
- Manage all users (tourists, guides, admins)
- Oversee all tours and bookings
- Process payments and handle refunds
- Send system notifications
- View platform analytics and reports
- Create and manage other administrators

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database with mysql2 driver
- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **Winston** for logging
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for iconography
- **React Hook Form** for form management
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📁 Project Structure

```
travils/
├── backend/                 # Node.js/Express backend
│   ├── routes/             # API route handlers
│   │   ├── admins.js       # Admin management
│   │   ├── tourists.js     # Tourist management
│   │   ├── guides.js       # Guide management
│   │   ├── tours.js        # Tour CRUD operations
│   │   ├── booking.js      # Booking system
│   │   ├── payments.js     # Payment processing
│   │   ├── ratings_comments.js # Reviews system
│   │   ├── notifications.js # Notification system
│   │   └── password_resets.js # Password recovery
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── authorizeRoles.js # Role-based access control
│   │   └── asyncContext.js # Request context management
│   ├── utils/              # Utility functions
│   │   └── logger.js       # Winston logger configuration
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript definitions
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd travils
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm run frontend:install
```

3. **Database Setup**
   - Create a MySQL database named `magellansaudi`
   - Update database credentials in the backend if needed
   - The application will create necessary tables on first run

4. **Environment Variables**
   Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=magellansaudi
```

### Running the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev:full
```
This will start both the backend server (port 5000) and frontend development server (port 3000).

#### Individual Services
```bash
# Backend only
npm run dev

# Frontend only
npm run frontend
```

#### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## 🔌 API Endpoints

### Authentication
- `POST /tourists/login` - Tourist login
- `POST /tourists` - Tourist registration
- `POST /guides/login` - Guide login
- `POST /guides` - Guide registration
- `POST /admins/login` - Admin login

### Tours
- `GET /tours` - Get all tours (public)
- `GET /tours/:id` - Get tour by ID (public)
- `POST /tours` - Create tour (guides/admins)
- `PUT /tours/:id` - Update tour (guides/admins)
- `DELETE /tours/:id` - Delete tour (super admin)

### Bookings
- `POST /booking` - Create booking (tourists)
- `GET /booking` - Get user's bookings (tourists)
- `PUT /booking/:id` - Update booking (tourists)
- `DELETE /booking/:id` - Cancel booking (tourists)

### Payments
- `POST /payments` - Create payment (tourists)
- `GET /payments` - Get all payments (admins)
- `PUT /payments/:id` - Update payment (admins)
- `DELETE /payments/:id` - Delete payment (admins)

### User Management
- `GET /tourists` - Get all tourists (admins)
- `GET /guides` - Get all guides (admins)
- `GET /admins` - Get all admins (super admin)
- Full CRUD operations for each user type

### Notifications
- `POST /notifications` - Create notification (admins)
- `GET /notifications` - Get all notifications (admins)
- `PUT /notifications/:id` - Update notification (admins)
- `DELETE /notifications/:id` - Delete notification (admins)

### Password Reset
- `POST /password_resets` - Request password reset
- `GET /password_resets/:token` - Verify reset token
- `DELETE /password_resets/:token` - Delete reset token

## 🔐 Security Features

- JWT-based authentication with expiration
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Security headers with Helmet
- Input validation and sanitization
- SQL injection protection

## 📱 Frontend Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Accessible components with Headless UI
- Dark/light mode ready

### User Experience
- Intuitive navigation and routing
- Loading states and error handling
- Toast notifications for feedback
- Form validation and error messages
- Smooth animations and transitions

### Developer Experience
- TypeScript for type safety
- ESLint and Prettier for code quality
- Hot reloading for development
- Comprehensive error handling
- Modular component architecture

## 🧪 Testing

```bash
# Run backend tests (when implemented)
npm test

# Run frontend tests
cd frontend && npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up a production MySQL database
2. Configure environment variables
3. Install dependencies: `npm install --production`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure the API URL for production

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🎯 Roadmap

- [ ] Add real-time notifications with WebSockets
- [ ] Implement email notifications
- [ ] Add tour image upload functionality
- [ ] Create mobile app with React Native
- [ ] Add advanced analytics dashboard
- [ ] Implement multi-language support
- [ ] Add tour categories and tags
- [ ] Create tour recommendation system

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- React team for the amazing frontend library
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible
