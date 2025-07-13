# Rising Academy Mobile App

A React Native mobile application for Rising Academy built with Expo, sharing the same Firebase backend as the web application.

## Features

- **Cross-platform**: Works on both iOS and Android
- **Shared Backend**: Uses the same Firebase database as the web application
- **Real-time Sync**: All data syncs in real-time between web and mobile
- **Complete Functionality**: All user-facing features from the web app

### Available Services

1. **Course Registration** (Basic & Full)
2. **Free Workshop Registration**
3. **Club Membership Applications**
4. **Job Applications** (Teacher & Staff)
5. **Internship Applications**
6. **Admin Login** (Limited mobile view)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Navigate to the mobile app directory:
```bash
cd RisingAcademyMobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
RisingAcademyMobile/
├── components/           # React Native components
│   ├── LoadingScreen.tsx
│   ├── ChoicePage.tsx
│   ├── RegistrationForm.tsx
│   ├── WorkshopSection.tsx
│   ├── ClubSection.tsx
│   ├── JobApplicationForm.tsx
│   ├── InternApplicationForm.tsx
│   ├── AdminLogin.tsx
│   └── AdminDashboard.tsx
├── constants/           # App constants and data
│   └── data.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── firebase.config.ts  # Firebase configuration
├── App.tsx            # Main app component
└── package.json       # Dependencies and scripts
```

## Firebase Integration

The mobile app uses the same Firebase configuration as the web application:

- **Authentication**: Admin login functionality
- **Firestore**: Real-time database for all applications
- **Storage**: File uploads (signatures, documents)

All data is synchronized in real-time between the web and mobile applications.

## Key Features

### User Experience
- **Native Mobile UI**: Optimized for touch interactions
- **Responsive Design**: Works on all screen sizes
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Ready for implementation

### Forms and Applications
- **Course Registration**: Both basic and full registration types
- **Workshop Registration**: Browse and register for free workshops
- **Club Applications**: Apply to join various clubs with departments
- **Job Applications**: Apply for teaching or administrative positions
- **Internship Applications**: Submit internship requests

### Admin Features
- **Limited Admin Panel**: Basic admin functionality for mobile
- **Real-time Data**: All admin data syncs with web dashboard
- **Authentication**: Secure admin login

## Development

### Adding New Features

1. Create new components in the `components/` directory
2. Add types to `types/index.ts`
3. Update constants in `constants/data.ts`
4. Integrate with Firebase in the component

### Styling

The app uses React Native's StyleSheet API with:
- **Linear Gradients**: For beautiful backgrounds
- **Expo Vector Icons**: For consistent iconography
- **Custom Components**: Reusable UI elements

### State Management

- **Local State**: Using React hooks
- **Firebase State**: Real-time listeners
- **Form State**: Controlled components

## Building for Production

### iOS

1. Configure your Apple Developer account
2. Update `app.json` with your bundle identifier
3. Run: `expo build:ios`

### Android

1. Configure your Google Play Console
2. Update `app.json` with your package name
3. Run: `expo build:android`

## Deployment

The mobile app can be deployed to:

- **App Store** (iOS)
- **Google Play Store** (Android)
- **Expo Go** (for testing)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Test on both iOS and Android
4. Ensure Firebase integration works correctly

## Support

For technical support or questions about the mobile app, please contact the development team.

## License

This project is proprietary software for Rising Academy.