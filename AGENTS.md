# Instructions for AI Agents

Welcome, agent! This document provides instructions for working with the `cube-protocol-for-3i-microscopes` repository.

## Project Overview

This is a [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) project. The goal of this application is to serve as a web-based simulator and interpreter for the "CUBE Protocol," a conceptual framework for data compression and control.

The application's content is primarily sourced from markdown files. The original, highly conceptual markdown files are located in the `/docs` directory.

## Project Structure

The repository follows a standard structure for modern web applications:

-   `src/`: Contains all the application source code.
    -   `components/`: Reusable React components.
    -   `services/`: Modules for interacting with external APIs (like Google Gemini).
    -   `index.tsx`: The main entry point for the React application.
-   `public/`: Contains the main `index.html` file and other static assets that are served directly.
-   `docs/`: Contains the original markdown documents that describe the CUBE Protocol concept. These are likely loaded and displayed by the application.
-   `vite.config.ts`: The configuration file for the Vite build tool.
-   `tsconfig.json`: The configuration file for the TypeScript compiler.
-   `package.json`: Defines project metadata, dependencies, and scripts.

## Development Workflow

1.  **Installation**: Run `npm install` to install all required dependencies.
2.  **Running the dev server**: Run `npm run dev` to start the Vite development server. The application will be available at `http://localhost:5173` by default.
3.  **Building for production**: Run `npm run build` to create a production-ready build in the `dist/` directory.

## Key Considerations

*   **Edit Source, Not Artifacts**: Do not edit files in the `dist/` directory (if it exists). Always make changes to the source files in `src/` and then run the build command.
*   **Configuration**:
    *   Vite configuration is in `vite.config.ts`. The `root` is the project directory, and the `publicDir` is set to `public`.
    *   TypeScript paths are configured in `tsconfig.json`. The `@/` alias points to `src/`.
*   **Environment Variables**: The application uses an environment variable `GEMINI_API_KEY` for the Gemini service. To run the application locally, you will need to create a `.env` file in the project root and add this key.
*   **README.md**: The main `README.md` has been structured to be more conventional. The original conceptual explanation is preserved under the "CUBE Protocol Concept" section.

Before submitting any changes, ensure that the application builds successfully by running `npm run build`.
