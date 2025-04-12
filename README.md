# COMP308 DevOps Implementation Project

This repository demonstrates a DevOps implementation for the COMP308/303/231/313/229 course project, focusing on implementing DevOps principles throughout the software development lifecycle.

## Project Overview

This project implements a basic RESTful API for user management with a complete DevOps pipeline using Azure DevOps for project management and CI/CD automation.

### Key Features

- **RESTful API**: Simple user management API built with Node.js and Express
- **Source Code Management**: Using GitHub with proper branching strategy
- **Agile Project Management**: Using Azure DevOps Boards
- **Continuous Integration**: Automated building, testing, and code analysis
- **Continuous Delivery/Deployment**: Automated deployment to multiple environments

## Technical Stack

- **Backend**: Node.js with Express.js
- **Testing**: Jest with Supertest
- **CI/CD**: Azure DevOps Pipelines
- **Code Quality**: ESLint and SonarQube
- **Project Management**: Azure DevOps Boards
- **Source Control**: GitHub

## Repository Structure

```
comp308-devops-project/
├── .github/                  # GitHub specific files
│   └── workflows/            # GitHub Actions workflows (if used)
├── app.js                    # Main application file
├── app.test.js               # Unit tests
├── package.json              # Project dependencies and scripts
├── .eslintrc.json            # ESLint configuration
├── sonar-project.properties  # SonarQube configuration
├── azure-pipelines.yml       # Azure DevOps pipeline configuration
└── README.md                 # Project documentation
```

## DevOps Implementation Details

### Source Code Management (GitHub)

- **Branching Strategy**: Feature branches, bugfix branches, release branches
- **Pull Request Process**: Code review, automated CI checks, approval process
- **Issue Management**: Linked to Azure DevOps work items

### Agile Project Management (Azure DevOps Boards)

- **Work Item Types**: Epics, Features, User Stories, Tasks
- **Work Item Hierarchy**: Properly structured hierarchy with parent-child relationships
- **Workflow**: To Do → In Progress → Done

### CI/CD Pipeline (Azure DevOps Pipelines)

- **Continuous Integration**:

  - Source code checkout
  - Dependency installation
  - Code linting
  - Unit testing with code coverage
  - SonarQube analysis
  - Artifact generation

- **Continuous Delivery/Deployment**:
  - Deployment to Dev environment (automated)
  - Deployment to QA environment (with approval)
  - Deployment to Staging environment (with approval)
  - Deployment to Production environment (with approval)

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm (v8 or newer)
- Azure DevOps account
- GitHub account
- SonarQube instance (optional, can use SonarCloud)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/ketap2/comp308-devops-project.git
   cd comp308-devops-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run tests:

   ```bash
   npm test
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the API at `http://localhost:3000`

### Setting Up Azure DevOps Pipeline

1. Create a new project in Azure DevOps
2. Connect your GitHub repository to Azure DevOps
3. Create a new pipeline using the existing `azure-pipelines.yml` file
4. Set up SonarQube service connection
5. Configure environment approvals for QA, Staging, and Production

## API Endpoints

- `GET /`: Welcome message and API info
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **ketap2** - [GitHub](https://github.com/ketap2) - kpate941@my.centennialcollege.ca
