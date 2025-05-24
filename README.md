# Task-Sphere

Task-Sphere is a modern task management application built with Angular 8, featuring a beautiful Material Design interface and comprehensive project management capabilities.

## Features

- 📋 Full CRUD operations for Projects and Tasks
- 🎨 Beautiful UI using Angular Material
- 🌓 Dark/Light theme support
- 📱 Fully responsive design
- 📅 Date range selection for projects
- 🔄 Real-time updates
- 📊 Project progress tracking
- 🎯 Task status management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.x or later)
- npm (v6.x or later)
- Angular CLI (v8.x)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Eyob-ts/Task-Sphere.git
cd Task-Sphere
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:

For Windows (PowerShell):
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; ng serve
```

For Windows (Command Prompt):
```cmd
set NODE_OPTIONS=--openssl-legacy-provider && ng serve
```

For Linux/Mac:
```bash
export NODE_OPTIONS=--openssl-legacy-provider && ng serve
```

The application will be available at `http://localhost:4200/`

## Project Structure

```
src/
├── app/
│   ├── components/         # Angular components
│   ├── services/          # Angular services
│   ├── models/            # Data models
│   ├── directives/        # Custom directives
│   └── styles/            # Global styles
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## Key Components

- **Project Management**
  - Create, read, update, and delete projects
  - Set project start and end dates
  - Track project progress

- **Task Management**
  - Create, read, update, and delete tasks
  - Assign tasks to projects
  - Track task status

## Development

### Running Tests

```bash
# Unit tests
npm test

# End-to-end tests
npm run e2e
```

### Building for Production

For Windows (PowerShell):
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"; ng build --prod
```

For Windows (Command Prompt):
```cmd
set NODE_OPTIONS=--openssl-legacy-provider && ng build --prod
```

For Linux/Mac:
```bash
export NODE_OPTIONS=--openssl-legacy-provider && ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Technologies Used

- Angular 8
- Angular Material
- TypeScript
- SCSS
- RxJS
- Angular In-Memory Web API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)



## Acknowledgments

- Angular Material for the beautiful UI components
- Angular team for the amazing framework
- All contributors who have helped shape this project

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/Eyob-ts/Task-Sphere/issues) section
2. Create a new issue if your problem isn't already listed

## Author

Your Name - [@Eyob-ts](https://github.com/Eyob-ts)

---

Made with ❤️ using Angular
