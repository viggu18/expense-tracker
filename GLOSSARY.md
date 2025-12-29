# Glossary

## Overview

This document provides definitions for key terms used throughout the Splitter application and documentation.

## A

### API (Application Programming Interface)
A set of rules and protocols that allows different software applications to communicate with each other. In Splitter, the API enables communication between the frontend mobile app and the backend server.

### AsyncStorage
A simple, unencrypted, asynchronous, persistent, key-value storage system that is global to the app. Used in Splitter for offline data caching and local storage.

## B

### Balance
The net amount that a user owes or is owed in the context of shared expenses. A positive balance indicates the user is owed money, while a negative balance indicates the user owes money.

### Backend
The server-side component of the Splitter application, built with Node.js, Express.js, and MongoDB. It handles data storage, business logic, and API endpoints.

## C

### Component
A reusable piece of the user interface in the React Native frontend. Components can be simple (like a button) or complex (like a form).

### Controller
In the backend MVC architecture, controllers handle incoming HTTP requests, process data using services, and return appropriate responses.

### CORS (Cross-Origin Resource Sharing)
A security feature that allows or restricts resources on a web server to be requested from another domain. Properly configured in Splitter to allow frontend requests.

## D

### Database
The persistent storage system used by Splitter to store user data, groups, expenses, and settlements. MongoDB is used as the database.

### DTO (Data Transfer Object)
An object that carries data between processes. In Splitter, DTOs are used to define the structure of data sent between the frontend and backend.

## E

### Expense
A financial transaction representing money spent on something. In Splitter, expenses can be shared among group members with customizable splits.

### Environment Variables
Configuration values that can change between different environments (development, staging, production). Used in Splitter for sensitive data like database connection strings and API keys.

## F

### Frontend
The client-side component of the Splitter application, built with React Native and Expo. It provides the user interface and handles user interactions.

## G

### Group
A collection of users who share expenses together. Groups in Splitter can have multiple members and contain multiple shared expenses.

## H

### Hook
A React feature that allows using state and other React features without writing a class. Custom hooks in Splitter encapsulate reusable logic.

## I

### Internationalization (i18n)
The process of designing an application so it can be adapted to various languages and regions without engineering changes.

### JWT (JSON Web Token)
A compact, URL-safe means of representing claims to be transferred between two parties. Used in Splitter for user authentication and authorization.

## M

### Middleware
Functions that have access to the request and response objects, and the next middleware function in the application's request-response cycle. Used in Splitter for authentication, logging, and error handling.

### Model
In the backend MVC architecture, models represent the data structure and business logic for entities like users, groups, and expenses.

### MongoDB
A document-oriented NoSQL database used by Splitter for data storage. It stores data in flexible, JSON-like documents.

## N

### Node.js
A JavaScript runtime built on Chrome's V8 JavaScript engine. Used as the runtime environment for the Splitter backend.

## O

### Offline Support
The ability of the application to function with limited or no internet connectivity by caching data locally and synchronizing when connectivity is restored.

## P

### PWA (Progressive Web App)
Web applications that use modern web capabilities to deliver an app-like experience to users. While Splitter is a native mobile app, some concepts apply to web versions.

## R

### React Native
A framework for building native mobile applications using React. Used for the Splitter frontend to create cross-platform mobile apps.

### Redux/Zustand
State management libraries. Splitter uses Zustand for managing global application state in the frontend.

### REST (Representational State Transfer)
An architectural style for designing networked applications. Splitter's backend API follows REST principles.

### Route
In the backend, routes define the URLs and HTTP methods that the API responds to, mapping requests to controller functions.

## S

### Schema
The structure that defines how data is organized in a database. Mongoose schemas in Splitter define the structure of collections.

### Service
In the backend, services contain business logic and are used by controllers to process data and interact with models.

### Settlement
A payment made between users to reduce their balances. In Splitter, settlements can be made within groups or globally.

### State Management
The practice of managing and updating application state. Splitter uses Zustand for frontend state management.

## T

### TypeScript
A typed superset of JavaScript that compiles to plain JavaScript. Used in both the frontend and backend of Splitter for type safety.

## U

### Unit Test
A level of software testing where individual units/components of a software are tested. Splitter uses Jest for unit testing.

### User
A person who uses the Splitter application. Users can create accounts, join groups, add expenses, and settle balances.

## V

### View
In the MVC architecture, the view is the presentation layer. In Splitter's frontend, React Native components serve as views.

## W

### WebSocket
A protocol that provides full-duplex communication channels over a single TCP connection. While not currently used in Splitter, it could be implemented for real-time features.

## Z

### Zustand
A small, fast, and scalable bearbones state management solution. Used in Splitter for frontend state management.

---

*This glossary is maintained to ensure consistent understanding of technical terms across the development team and documentation.*