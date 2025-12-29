# API Documentation

This document provides detailed information about the Splitter backend API endpoints.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Data Params**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "token": "string"
    }
    ```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Data Params**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "token": "string"
    }
    ```

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "friends": ["string"],
      "createdAt": "date",
      "updatedAt": "date"
    }
    ```

## Users

### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of user objects

### Get User by ID
- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: User object

### Update User Profile
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated user object

### Add Friend
- **URL**: `/users/:id/friends`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "friendId": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Friend added successfully"
    }
    ```

### Remove Friend
- **URL**: `/users/:id/friends/:friendId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Friend removed successfully"
    }
    ```

## Groups

### Create Group
- **URL**: `/groups`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "name": "string",
    "description": "string",
    "members": ["string"]
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Group object

### Get All Groups for User
- **URL**: `/groups`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of group objects

### Get Group by ID
- **URL**: `/groups/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Group object

### Update Group
- **URL**: `/groups/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "name": "string",
    "description": "string",
    "members": ["string"]
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated group object

### Delete Group
- **URL**: `/groups/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Group removed"
    }
    ```

### Add Member to Group
- **URL**: `/groups/:id/members`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated group object

### Remove Member from Group
- **URL**: `/groups/:id/members/:userId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated group object

## Expenses

### Create Expense
- **URL**: `/expenses`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "description": "string",
    "amount": "number",
    "paidBy": "string",
    "group": "string",
    "splits": [
      {
        "user": "string",
        "amount": "number"
      }
    ],
    "category": "string",
    "date": "date"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Expense object

### Get All Expenses for User (Global View)
- **URL**: `/expenses`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of expense objects

### Get Expenses by Group
- **URL**: `/expenses/group/:groupId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of expense objects

### Get Expense by ID
- **URL**: `/expenses/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Expense object

### Update Expense
- **URL**: `/expenses/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "description": "string",
    "amount": "number",
    "paidBy": "string",
    "group": "string",
    "splits": [
      {
        "user": "string",
        "amount": "number"
      }
    ],
    "category": "string",
    "date": "date"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated expense object

### Delete Expense
- **URL**: `/expenses/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Expense removed"
    }
    ```

## Balances

### Get User's Balances Across All Groups
- **URL**: `/balances`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "overallBalance": "number",
      "balances": [
        {
          "groupId": "string",
          "groupName": "string",
          "totalOwed": "number",
          "totalDue": "number",
          "netBalance": "number"
        }
      ]
    }
    ```

### Get User's Balances for a Specific Group
- **URL**: `/balances/group/:groupId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Object with user balances

## Settlements

### Create Settlement
- **URL**: `/settlements`
- **Method**: `POST`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "from": "string",
    "to": "string",
    "amount": "number",
    "group": "string",
    "description": "string",
    "date": "date"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Settlement object

### Get All Settlements for User
- **URL**: `/settlements`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of settlement objects

### Get Settlements by Group
- **URL**: `/settlements/group/:groupId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of settlement objects

### Get Settlement by ID
- **URL**: `/settlements/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Settlement object

### Update Settlement
- **URL**: `/settlements/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Data Params**:
  ```json
  {
    "from": "string",
    "to": "string",
    "amount": "number",
    "group": "string",
    "description": "string",
    "date": "date"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated settlement object

### Delete Settlement
- **URL**: `/settlements/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Settlement removed"
    }
    ```

## Analytics

### Get Global Analytics Across All Groups
- **URL**: `/analytics`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "totalExpenses": "number",
      "categorySpending": {
        "category": "number"
      },
      "monthlySpending": {
        "month": "number"
      }
    }
    ```

### Get Analytics for a Specific Group
- **URL**: `/analytics/group/:groupId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "totalExpenses": "number",
      "personSpending": {
        "userId": {
          "name": "string",
          "totalPaid": "number",
          "totalOwed": "number",
          "netBalance": "number"
        }
      },
      "topSpender": {
        "name": "string",
        "totalPaid": "number",
        "totalOwed": "number",
        "netBalance": "number"
      },
      "categorySpending": {
        "category": "number"
      },
      "averageSpend": "number"
    }
    ```

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address

## Versioning

The API is currently at version 1.0.0. Future versions will be indicated in the URL path if breaking changes are introduced.