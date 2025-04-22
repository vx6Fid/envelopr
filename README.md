# Envelopr

**Envelopr** is a secure, real-time, collaborative file editing and sharing platform built to support modern workflows with a focus on performance, control, and simplicity. Designed for individuals and teams, Envelopr offers powerful tools to create, manage, and share content in a secure, intuitive environment.

## Key Features

- **User Authentication**: Robust JWT-based login and registration system.
- **File Management**: Authenticated users can create, update, delete, and manage files via a user-friendly interface.
- **Collaborative Editing**: Real-time editing support for shared files with auto-save and update propagation.
- **Auto-Save Functionality**: Edits are saved automatically using a debounced mutation system to ensure performance and reliability.
- **Access Control**: Role-based permissions allow for full control over file visibility and edit rights.
- **Public File Sharing**: Files can be made publicly accessible via a secure, unique link.
- **Personal Dashboard**: Manage owned and shared files with detailed insights and control options.

## Tech Stack

### Frontend
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL communication
- **Zustand** for state management

### Backend
- **Go (Golang)** using gqlgen
- **GraphQL API** (schema-first approach)
- **PostgreSQL** with persistent Docker volume
- **Custom JWT Authentication**
- **Secure Middleware & Access Context Handling**

## 📁 Project Structure Overview

### Backend
```
backend/
├── auth/
│   ├── jwt.go
│   └── middleware.go
├── graph/
│   ├── schema.graphqls
│   ├── resolver.go
│   └── model/
├── db.go
├── main.go
```

### Frontend
```
frontend/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── files/[id]/
│   └── public/[id]/
├── graphql/
│   ├── mutations.ts
│   └── queries.ts
    ├── client.ts
├── store/
│   └── authStore.ts
```

## 🗺 Roadmap

- [x] Secure user authentication (JWT)
- [x] File creation, editing, deletion (CRUD)
- [x] File sharing with individual users
- [x] Auto-saving file content with debounce
- [x] Publicly viewable file routes
- [ ] Real-time collaboration via WebSocket and CRDT
- [ ] File version history with rollback
- [ ] Rich text and markdown editor support

## 👤 Author
**vxF6id**
Crafted with precision, performance, and purpose.
---

> This project is currently maintained for personal or closed use. Contributions are not open at this time.

For questions or custom deployments, feel free to reach out via the GitHub issues page.
