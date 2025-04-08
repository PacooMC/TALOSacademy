```markdown
# Plataforma de Aprendizaje - API Documentation (v1)

## Table of Contents

1.  [Introduction](#introduction)
    *   [Base URL](#base-url)
    *   [Authentication](#authentication)
    *   [Data Format](#data-format)
    *   [Error Handling](#error-handling)
    *   [Pagination and Sorting](#pagination-and-sorting)
    *   [Rate Limiting](#rate-limiting)
    *   [API Versioning](#api-versioning)
    *   [Common Data Structures](#common-data-structures)
2.  [Authentication Endpoints (`/auth`)](#authentication-endpoints-auth)
3.  [User Endpoints (`/users`)](#user-endpoints-users)
4.  [Competency Map Endpoints (`/competencies`)](#competency-map-endpoints-competencies)
5.  [Daily Coach Endpoints (`/sessions/daily`)](#daily-coach-endpoints-sessionsdaily)
6.  [Guided Study Endpoints (`/study/guided`)](#guided-study-endpoints-studyguided)
7.  [Exercises Endpoints (`/exercises`)](#exercises-endpoints-exercises)
8.  [Practice Mode Endpoints (`/practices`)](#practice-mode-endpoints-practices)
9.  [Exams Mode Endpoints (`/exams`)](#exams-mode-endpoints-exams)
10. [Notifications Endpoints (`/notifications`)](#notifications-endpoints-notifications)
11. [Feedback Endpoints (`/feedback`)](#feedback-endpoints-feedback)

---

## 1. Introduction

This document describes the RESTful API for the Plataforma de Aprendizaje backend.

### Base URL

All API endpoints are relative to the following base URL:

`/api/v1`

### Authentication

Most endpoints require authentication using JSON Web Tokens (JWT).

1.  Obtain a token via the `POST /auth/login` endpoint.
2.  Include the token in the `Authorization` header for subsequent requests to protected endpoints:
    `Authorization: Bearer <your_jwt_token>`

Endpoints that require authentication are marked with `Auth Required: Yes`.

### Data Format

All request and response bodies use the JSON format (`application/json`).

### Error Handling

Errors are returned with appropriate HTTP status codes and a JSON body:

```json
{
  "error": "A brief error message",
  "details": "Optional additional details about the error.",
  "code": "ERROR_CODE_ENUM" // Optional: Specific error code
}
```

Common Status Codes:

*   `200 OK`: Request successful.
*   `201 Created`: Resource created successfully.
*   `202 Accepted`: Request accepted for processing (asynchronous).
*   `204 No Content`: Request successful, no response body.
*   `400 Bad Request`: Invalid request syntax or parameters (e.g., validation errors). Details might contain specific field errors.
*   `401 Unauthorized`: Authentication failed or token missing/invalid.
*   `403 Forbidden`: Authenticated user lacks permission.
*   `404 Not Found`: Resource not found.
*   `429 Too Many Requests`: Rate limit exceeded.
*   `500 Internal Server Error`: Server-side error.
*   `503 Service Unavailable`: Temporary server overload or maintenance.

### Pagination and Sorting

Endpoints returning lists of resources may support pagination and sorting via query parameters:

*   **Pagination**:
    *   `limit` (integer, default: 20): Maximum number of items to return.
    *   `offset` (integer, default: 0): Number of items to skip.
    *   *(Alternative: Cursor-based pagination might be used for some endpoints)*
*   **Sorting**:
    *   `sortBy` (string, default: varies by endpoint, e.g., `createdAt`): Field to sort by.
    *   `sortOrder` (string, default: `desc`): Sort order (`asc` or `desc`).

Supported parameters will be listed for relevant endpoints. Responses for paginated lists should include total count information where feasible (e.g., in headers or a response wrapper object).

### Rate Limiting

API endpoints may be subject to rate limiting to ensure fair usage and prevent abuse. Exceeding the rate limit will result in a `429 Too Many Requests` error. Specific limits are not detailed here but should be communicated to clients if necessary.

### API Versioning

The API version is included in the base URL (`/api/v1`). Future breaking changes will result in a new version (e.g., `/api/v2`).

### Common Data Structures

*   **`User`**:
    ```json
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Paco",
      "createdAt": "iso_timestamp"
    }
    ```
*   **`CompetencyNode`**:
    ```json
    {
      "id": "number | string", // e.g., 1 or "node-1"
      "title": "Identificar señales",
      "level": "Básico | Medio | Alto", // Enum: 'Básico', 'Medio', 'Alto'
      "type": "Teoría | Práctica", // Enum: 'Teoría', 'Práctica'
      "state": "done | progress | lag | none", // Enum: 'done', 'progress', 'lag', 'none'
      "last": "iso_date | null", // e.g., "2025-04-01"
      "bullets": ["Tipos de señales", "Propiedades básicas"],
      "topic": "string | null", // e.g., "T1"
      "x": "number", // For map layout
      "y": "number"  // For map layout
    }
    ```
*   **`CompetencyEdge`**:
    ```json
    {
      "from": "number | string", // Source node ID
      "to": "number | string",   // Target node ID
      "type": "prereq | assoc" // Enum: 'prereq', 'assoc'
    }
    ```
*   **`CompetencyTopic`**:
    ```json
    {
      "id": "string", // e.g., "T1"
      "name": "Fundamentos de Señales",
      "color": "rgba(239, 246, 255, 0.7)" // For map visualization
    }
    ```
*   **`SubtopicStatus`**: `pending | completed` // Enum: 'pending', 'completed'
*   **`PracticeSummary`**:
    ```json
    {
      "id": "practice-uuid",
      "guionName": "Guia_Practica_3.pdf",
      "status": "pending | in_progress | submitted | analyzed", // Example statuses
      "submittedAt": "iso_timestamp | null",
      "analyzedAt": "iso_timestamp | null"
    }
    ```
*   **`ExamSummary`**:
    ```json
    {
      "id": "exam-uuid",
      "name": "Parcial_Abril.pdf | Simulacro Generado",
      "type": "uploaded | generated",
      "status": "pending | in_progress | submitted | corrected", // Example statuses
      "submittedAt": "iso_timestamp | null",
      "correctedAt": "iso_timestamp | null",
      "score": "number | null" // e.g., 7.5 or 80 (%)
    }
    ```
*   **`Notification`**:
    ```json
    {
      "id": "notification-uuid",
      "type": "deadline | suggestion | feedback_response | system",
      "title": "Práctica 3 vence pronto",
      "message": "Recuerda entregar la Práctica 3 antes del viernes.",
      "isRead": false,
      "createdAt": "iso_timestamp",
      "link": "/practices/practice-uuid" // Optional link to relevant content
    }
    ```

---

## 2. Authentication Endpoints (`/auth`)

### `POST /auth/register`

Register a new user.

*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "email": "newuser@example.com",
      "password": "securepassword123",
      "name": "New User"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "message": "User registered successfully. Please login."
    }
    ```
*   **Error Responses**: 400 (Invalid input, email exists), 500

### `POST /auth/login`

Authenticate a user and receive a JWT.

*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "token": "your_jwt_token_string",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "Paco"
      }
    }
    ```
*   **Error Responses**: 400 (Missing fields), 401 (Invalid credentials), 500

### `POST /auth/logout`

Log out the user.

*   **Auth Required**: Yes
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Logout successful"
    }
    ```
*   **Error Responses**: 401, 500

### `GET /auth/me`

Get information about the currently authenticated user.

*   **Auth Required**: Yes
*   **Success Response (200 OK)**: Returns the `User` object.
*   **Error Responses**: 401

---

## 3. User Endpoints (`/users`)

### `GET /users/me/profile`

Get the detailed profile of the current user.

*   **Auth Required**: Yes
*   **Success Response (200 OK)**:
    ```json
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Paco",
      "createdAt": "iso_timestamp",
      "preferences": {
        "learningPace": "medium",
        "preferredStyle": "visual"
        // Add other preferences
      }
      // Add other profile details
    }
    ```
*   **Error Responses**: 401, 404

### `PUT /users/me/profile`

Update the profile of the current user.

*   **Auth Required**: Yes
*   **Request Body**: (Include fields to update)
    ```json
    {
      "name": "Paco Updated",
      "preferences": {
        "learningPace": "fast"
      }
    }
    ```
*   **Success Response (200 OK)**: Returns the updated profile object.
*   **Error Responses**: 400 (Invalid data), 401

### `GET /users/me/progress`

Get a summary of the user's overall progress.

*   **Auth Required**: Yes
*   **Success Response (200 OK)**:
    ```json
    {
      "competencies": {
        "total": 50,
        "done": 25,
        "progress": 10,
        "lag": 5,
        "none": 10
      },
      "guidedStudy": {
        "topicsCompleted": 3,
        "subtopicsCompleted": 15,
        "totalSubtopics": 40
      },
      "averageExamScore": 78.5, // Example metric
      "lastActivity": "iso_timestamp"
    }
    ```
*   **Error Responses**: 401, 500

---

## 4. Competency Map Endpoints (`/competencies`)

### `GET /competencies/map`

Retrieve the data for the competency map.

*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `state` (optional): Filter by node state.
    *   `topic` (optional): Filter by topic ID.
    *   `search` (optional): Filter by node title.
    *   `limit`, `offset`, `sortBy`, `sortOrder` (optional): For pagination and sorting of nodes if applicable.
*   **Success Response (200 OK)**:
    ```json
    {
      "nodes": [ CompetencyNode, ... ],
      "edges": [ CompetencyEdge, ... ],
      "topics": [ CompetencyTopic, ... ]
      // Add pagination info if used
    }
    ```
*   **Error Responses**: 401, 500

### `GET /competencies/nodes/{nodeId}`

Get details for a specific competency node.

*   **Auth Required**: Yes
*   **URL Parameters**: `nodeId`.
*   **Success Response (200 OK)**: Returns the `CompetencyNode` object with extra details.
    ```json
    {
      // CompetencyNode fields...
      "description": "Full description...",
      "subtopics": ["Subtopic 1", "Subtopic 2"],
      "relatedExercises": ["ex-1", "ex-5"]
    }
    ```
*   **Error Responses**: 401, 404

### `PATCH /competencies/nodes/{nodeId}/status`

Update the status of a specific competency node.

*   **Auth Required**: Yes
*   **URL Parameters**: `nodeId`.
*   **Request Body**: `{ "status": "done | progress | lag | none" }`
*   **Success Response (200 OK)**: Returns the updated `CompetencyNode`.
*   **Error Responses**: 400, 401, 404

---

## 5. Daily Coach Endpoints (`/sessions/daily`)

### `POST /sessions/daily`

Get or create the daily learning session.

*   **Auth Required**: Yes
*   **Request Body**: (User input from Home screen, all optional)
    ```json
    {
      "availableTime": 60,
      "mood": "neutral",
      "focusTopic": "FFT",
      "hasExam": false,
      "examDetails": null,
      "hasPractice": true,
      "practiceDetails": "Práctica 3 sobre FFT, entrega el viernes"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "sessionId": "daily-session-uuid",
      "context": { /* ... */ },
      "nodes": [ { "id": 2, "title": "...", "status": "pending" }, ... ]
    }
    ```
*   **Error Responses**: 400, 401, 500

### `GET /sessions/daily/{sessionId}/nodes/{nodeId}`

Get detailed content for a session node.

*   **Auth Required**: Yes
*   **URL Parameters**: `sessionId`, `nodeId`.
*   **Success Response (200 OK)**:
    ```json
    {
      "id": 2,
      "title": "Transformada de Fourier",
      "status": "pending",
      "content": { /* Detailed content structure */ }
    }
    ```
*   **Error Responses**: 401, 404

### `PATCH /sessions/daily/{sessionId}/nodes/{nodeId}/status`

Update node status within a session.

*   **Auth Required**: Yes
*   **URL Parameters**: `sessionId`, `nodeId`.
*   **Request Body**: `{ "status": "completed | pending" }`
*   **Success Response (200 OK)**: Returns the updated node status.
*   **Error Responses**: 400, 401, 404

---

## 6. Guided Study Endpoints (`/study/guided`)

### `GET /study/guided/topics`

Retrieve the list of study topics and subtopics with user status.

*   **Auth Required**: Yes
*   **Query Parameters**: `limit`, `offset`, `sortBy`, `sortOrder` (optional).
*   **Success Response (200 OK)**:
    ```json
    [
      {
        "id": "topic-1",
        "title": "Tema 1...",
        "subtopics": [ { "id": "subtopic-1-1", "title": "...", "status": "pending" }, ... ]
      },
      // ... other topics
    ]
    ```
*   **Error Responses**: 401, 500

### `GET /study/guided/subtopics/{subtopicId}`

Get detailed content for a subtopic.

*   **Auth Required**: Yes
*   **URL Parameters**: `subtopicId`.
*   **Success Response (200 OK)**: Returns the detailed subtopic object.
*   **Error Responses**: 401, 404

### `PATCH /study/guided/subtopics/{subtopicId}/status`

Update user status for a subtopic.

*   **Auth Required**: Yes
*   **URL Parameters**: `subtopicId`.
*   **Request Body**: `{ "status": "completed | pending" }`
*   **Success Response (200 OK)**: Returns updated status.
*   **Error Responses**: 400, 401, 404

### `POST /study/guided/subtopics/{subtopicId}/help`

Submit a help request for a subtopic.

*   **Auth Required**: Yes
*   **URL Parameters**: `subtopicId`.
*   **Request Body**: `{ "query": "User's question..." }`
*   **Success Response (200 OK)**: `{ "message": "Help request submitted." }` (Maybe AI response).
*   **Error Responses**: 400, 401, 404, 500

### `POST /study/guided/subtopics/{subtopicId}/report`

Report an issue with subtopic content.

*   **Auth Required**: Yes
*   **URL Parameters**: `subtopicId`.
*   **Request Body**: `{ "details": "Description of the issue..." }`
*   **Success Response (200 OK)**: `{ "message": "Report submitted successfully." }`
*   **Error Responses**: 400, 401, 404, 500

---

## 7. Exercises Endpoints (`/exercises`)

### `GET /exercises/sets`

Retrieve the user's exercise sets.

*   **Auth Required**: Yes
*   **Query Parameters**: `limit`, `offset`, `sortBy`, `sortOrder` (optional).
*   **Success Response (200 OK)**: Returns a list of exercise set summaries.
*   **Error Responses**: 401, 500

### `POST /exercises/sets/upload`

Upload a file to create a new exercise set.

*   **Auth Required**: Yes
*   **Request Body**: `multipart/form-data` with the file.
*   **Success Response (201 Created)**: Returns summary of the created set.
*   **Error Responses**: 400, 401, 500

### `POST /exercises/sets/generate`

Request AI generation of an exercise set.

*   **Auth Required**: Yes
*   **Request Body**: `{ "topic": "...", "difficulty": "...", "numExercises": 5 }`
*   **Success Response (201 Created)**: Returns summary of the generated set.
*   **Error Responses**: 400, 401, 500

### `DELETE /exercises/sets/{setId}`

Delete an exercise set.

*   **Auth Required**: Yes
*   **URL Parameters**: `setId`.
*   **Success Response (204 No Content)**
*   **Error Responses**: 401, 403, 404

### `GET /exercises/sets/{setId}/exercises`

Retrieve exercises within a set.

*   **Auth Required**: Yes
*   **URL Parameters**: `setId`.
*   **Success Response (200 OK)**: Returns a list of exercise objects.
*   **Error Responses**: 401, 404, 500

### `POST /exercises/generate-similar`

Request generation of a similar exercise.

*   **Auth Required**: Yes
*   **Request Body**: `{ "sourceExerciseId": "...", "context": { ... } }`
*   **Success Response (201 Created)**: Returns the new exercise object.
*   **Error Responses**: 400, 401, 404, 500

### `POST /exercises/help`

Request help for a specific exercise.

*   **Auth Required**: Yes
*   **Request Body**: `{ "exerciseId": "...", "query": "..." }`
*   **Success Response (200 OK)**: Returns help message/explanation.
*   **Error Responses**: 400, 401, 404, 500

---

## 8. Practice Mode Endpoints (`/practices`)

### `GET /practices/history`

Retrieve a summary list of the user's past practice sessions.

*   **Auth Required**: Yes
*   **Query Parameters**: `limit`, `offset`, `sortBy`, `sortOrder` (optional).
*   **Success Response (200 OK)**:
    ```json
    {
      "practices": [ PracticeSummary, ... ],
      "totalCount": 5 // Example total count
    }
    ```
*   **Error Responses**: 401, 500

### `POST /practices/upload-guion`

Upload the main practice guide file.

*   **Auth Required**: Yes
*   **Request Body**: `multipart/form-data` with the file.
*   **Success Response (200 OK)**: Returns `practiceId`, `fileName`, `detectedStructure`.
*   **Error Responses**: 400, 401, 500

### `PUT /practices/{practiceId}/structure`

Manually update the detected structure of a practice (e.g., correct titles, types, hierarchy).

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`.
*   **Request Body**:
    ```json
    {
      "updatedStructure": [
        { "id": "ej1", "type": "exercise", "title": "Ejercicio 1 Corregido" },
        // ... full updated structure
      ]
    }
    ```
*   **Success Response (200 OK)**: Returns the updated structure.
*   **Error Responses**: 400 (Invalid structure), 401, 404

### `POST /practices/{practiceId}/sections/{sectionId}/upload`

Upload files for a specific section.

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`, `sectionId`.
*   **Query Parameters**: `fileType` (`image` | `result` | `code`).
*   **Request Body**: `multipart/form-data` with file(s).
*   **Success Response (200 OK)**: Confirmation message and list of uploaded files.
*   **Error Responses**: 400, 401, 404, 500

### `PUT /practices/{practiceId}/sections/{sectionId}/analysis`

Save/update user's analysis text for a section.

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`, `sectionId`.
*   **Request Body**: `{ "analysisText": "..." }`
*   **Success Response (200 OK)**: Confirmation message.
*   **Error Responses**: 400, 401, 404

### `DELETE /practices/{practiceId}/sections/{sectionId}/files`

Delete a specific uploaded file from a section.

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`, `sectionId`.
*   **Request Body**: `{ "fileName": "...", "fileType": "..." }`
*   **Success Response (204 No Content)**
*   **Error Responses**: 400, 401, 404

### `POST /practices/{practiceId}/analyze`

Trigger AI analysis of the practice.

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`.
*   **Success Response (200 OK)**: Returns AI analysis report.
*   **Error Responses**: 401, 404, 500

### `POST /practices/{practiceId}/generate-report`

Generate the final practice report.

*   **Auth Required**: Yes
*   **URL Parameters**: `practiceId`.
*   **Success Response (200 OK)**: Returns report content and format.
*   **Error Responses**: 401, 404, 500

---

## 9. Exams Mode Endpoints (`/exams`)

### `GET /exams/history`

Retrieve a summary list of the user's past exams (uploaded and generated).

*   **Auth Required**: Yes
*   **Query Parameters**: `limit`, `offset`, `sortBy`, `sortOrder` (optional).
*   **Success Response (200 OK)**:
    ```json
    {
      "exams": [ ExamSummary, ... ],
      "totalCount": 12 // Example total count
    }
    ```
*   **Error Responses**: 401, 500

### `POST /exams/upload`

Upload a real exam file.

*   **Auth Required**: Yes
*   **Request Body**: `multipart/form-data` with the file.
*   **Success Response (200 OK)**: Returns `examId`, `fileName`, `detectedQuestions`.
*   **Error Responses**: 400, 401, 500

### `PUT /exams/{examId}/structure`

Manually update the detected structure (questions) of an uploaded exam.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`.
*   **Request Body**:
    ```json
    {
      "updatedQuestions": [
        { "id": "q1", "title": "Pregunta 1 Corregida", "type": "Teoría" },
        // ... full updated question list
      ]
    }
    ```
*   **Success Response (200 OK)**: Returns the updated question list.
*   **Error Responses**: 400 (Invalid structure), 401, 404

### `POST /exams/generate`

Generate a simulated exam.

*   **Auth Required**: Yes
*   **Request Body**: Parameters for generation (subject, topics, numQuestions, etc.).
*   **Success Response (200 OK)**: Returns `examId`, `title`, `questions`, `timer`.
*   **Error Responses**: 400, 401, 500

### `GET /exams/{examId}/questions`

Retrieve the list of questions for an exam.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`.
*   **Success Response (200 OK)**: Returns list of question summaries.
*   **Error Responses**: 401, 404

### `GET /exams/{examId}/questions/{questionId}`

Get details for a specific question.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`, `questionId`.
*   **Success Response (200 OK)**: Returns question details including statement, answer, correction.
*   **Error Responses**: 401, 404

### `PUT /exams/{examId}/questions/{questionId}/answer`

Save/update student's answer for a question.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`, `questionId`.
*   **Request Body**: `{ "answerText": "..." }` (or file upload).
*   **Success Response (200 OK)**: Confirmation message.
*   **Error Responses**: 400, 401, 404

### `POST /exams/{examId}/correct`

Trigger AI correction for the exam.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`.
*   **Request Body**: (Optional) `{ "questionIds": ["q1", "q2"] }`
*   **Success Response (202 Accepted)**: `{ "message": "Correction process initiated.", "statusUrl": "..." }`*   **Success Response (200 OK)**: (If synchronous) Returns corrections and analysis.
    ```json
    {
      "message": "Exam corrected successfully.",
      "corrections": {
        "q1": { /* AI Correction object */ },
        "q2": { /* AI Correction object */ }
      },
      "globalAnalysis": { /* Global analysis summary */ }
    }
    ```
*   **Error Responses**: 400, 401, 404, 500 (Correction failed)

### `GET /exams/{examId}/correction-status`

Check the status of an asynchronous correction process.

*   **Auth Required**: Yes
*   **URL Parameters**: `examId`.
*   **Success Response (200 OK)**:
    ```json
    {
      "status": "pending | processing | completed | failed",
      "progress": 80, // Optional: percentage
      "results": null // Or the full correction results if status is 'completed'
    }
    ```
*   **Error Responses**: 401, 404

### `POST /exams/questions/{questionId}/generate-similar`

Generate an exercise similar to a specific exam question.

*   **Auth Required**: Yes
*   **URL Parameters**: `questionId`.
*   **Success Response (201 Created)**: Returns a new exercise object.
*   **Error Responses**: 400, 401, 404, 500

---

## 10. Notifications Endpoints (`/notifications`)

### `GET /notifications`

Retrieve the user's notifications.

*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `filter` (optional): `all` | `unread` (default: `unread`).
    *   `limit`, `offset`, `sortBy`, `sortOrder` (optional).
*   **Success Response (200 OK)**:
    ```json
    {
      "notifications": [ Notification, ... ],
      "unreadCount": 3,
      "totalCount": 15 // If paginating 'all'
    }
    ```
*   **Error Responses**: 401, 500

### `POST /notifications/{notificationId}/read`

Mark a specific notification as read.

*   **Auth Required**: Yes
*   **URL Parameters**: `notificationId`.
*   **Success Response (204 No Content)**
*   **Error Responses**: 401, 404

### `POST /notifications/read-all`

Mark all unread notifications as read for the user.

*   **Auth Required**: Yes
*   **Success Response (204 No Content)**
*   **Error Responses**: 401, 500

---

## 11. Feedback Endpoints (`/feedback`)

### `POST /feedback`

Submit general feedback about the platform.

*   **Auth Required**: Yes
*   **Request Body**:
    ```json
    {
      "type": "bug | suggestion | compliment | other", // Enum for feedback type
      "message": "Detailed feedback message from the user.",
      "context": { // Optional context
        "screen": "/daily-coach",
        "component": "NodeNavigator"
      }
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "Feedback submitted successfully. Thank you!"
    }
    ```
*   **Error Responses**: 400 (Missing message or invalid type), 4
