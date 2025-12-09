# QuickShow 🎬

A modern, full-stack movie booking and management application. Book movie tickets, manage shows, and explore trending movies all in one place!

## Features

✨ **User Features**
- 🎞️ Browse and search movies from TMDB database
- ⭐ Add movies to favorites
- 🎫 Book movie tickets with interactive seat selection
- 📅 View and manage your bookings
- 💳 Secure payment processing with Stripe
- 🔐 Authentication via Clerk

✨ **Admin Features**
- 📊 Dashboard with booking analytics
- ➕ Add and manage movie shows
- 📋 View all bookings and customer details
- 🎬 Control movie listings and showtimes

✨ **Technical Highlights**
- 🚀 Real-time notifications with React Hot Toast
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with Vite
- 🔄 Automated email notifications with Nodemailer
- 🎯 Event-driven workflows with Inngest
- 🗄️ MongoDB database with Mongoose ODM
- ☁️ Cloud image storage with Cloudinary

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Clerk** - Authentication
- **React Hot Toast** - Notifications
- **React Player** - Video player for trailers
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Clerk** - Authentication & user management
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Inngest** - Event-driven workflows
- **Cloudinary** - Image hosting
- **TMDB API** - Movie database

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Clerk account (for authentication)
- Stripe account (for payments)
- TMDB API key
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sudhirkumar6009/QuickShow.git
   cd QuickShow
   ```

2. **Setup Client**
   ```bash
   cd client
   npm install
   ```

3. **Setup Server**
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

**Client (.env.local or .env)**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
```

**Server (.env)**
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
TMDB_API_KEY=your_tmdb_api_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_app_password
INNGEST_EVENT_KEY=your_inngest_key
```

### Running the Application

**Development Mode**

Terminal 1 - Start Backend:
```bash
cd server
npm run server
```

Terminal 2 - Start Frontend:
```bash
cd client
npm run dev
```

**Production Build**

Frontend:
```bash
cd client
npm run build
npm run preview
```

Backend:
```bash
cd server
npm start
```

## Project Structure

```
QuickShow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # App context & state management
│   │   ├── lib/            # Utility functions
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main app component
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
└── server/                 # Express backend
    ├── routes/             # API endpoints
    ├── controllers/        # Request handlers
    ├── models/             # MongoDB schemas
    ├── middleware/         # Custom middleware
    ├── configs/            # Configuration files
    ├── utils/              # Helper functions
    ├── inngest/            # Event workflows
    └── server.js           # Entry point
```

## API Endpoints

### Shows
- `GET /api/show` - Get all shows
- `GET /api/show/:id` - Get show details
- `POST /api/show` - Create a new show (admin)
- `PUT /api/show/:id` - Update show (admin)
- `DELETE /api/show/:id` - Delete show (admin)

### Bookings
- `GET /api/booking` - Get user bookings
- `POST /api/booking` - Create new booking
- `GET /api/booking/:id` - Get booking details
- `PUT /api/booking/:id` - Update booking status

### Admin
- `GET /api/admin/dashboard` - Get dashboard analytics
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/shows` - Get all shows

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## Key Features Explained

### Seat Selection
Interactive seat layout allows users to select and reserve seats before payment. The UI provides real-time feedback on seat availability.

### Payment Integration
Stripe webhook handles payment confirmations and automatically updates booking status. Customers receive confirmation emails after successful payment.

### Email Notifications
Nodemailer sends automated emails for:
- Booking confirmations
- Payment receipts
- Booking cancellations
- Show reminders

### Event-Driven Architecture
Inngest manages background jobs and event workflows:
- Email notifications
- Booking confirmations
- Payment processing
- Analytics updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@quickshow.com or open an issue in the repository.

## Acknowledgments

- TMDB API for movie data
- Stripe for payment processing
- Clerk for authentication
- Inngest for event workflows
- Cloudinary for image hosting

---

**Made with ❤️ by Sudhirkumar6009**
