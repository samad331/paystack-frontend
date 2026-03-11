# Paystack Payment System - Frontend

A modern React-based frontend for the Paystack payment system.

## Features

- User authentication (Login/Register)
- User dashboard with transaction history
- Payment processing integration
- Responsive design with Bootstrap
- Real-time transaction tracking

## Tech Stack

- React 18
- React Router DOM 6
- Axios for API calls
- Bootstrap 5
- CSS3

## Getting Started

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd paystack-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL and Paystack keys

### Running the Application

Development mode:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── App.js            # Main app component
└── index.js          # Entry point
```

## API Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /paystack/transactions` - Get user transactions
- `POST /paystack/initialize` - Initialize payment

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## License

ISC
