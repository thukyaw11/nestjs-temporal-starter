# NestJS Temporal Starter Template

This repository provides a starter template for integrating **Temporal** with a **NestJS** project . Temporal is a distributed, scalable, and durable workflow engine, while NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. This template will help you quickly set up a NestJS project with Temporal integration.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** (package managers)
- **Temporal CLI** (for running Temporal locally)
- **NestJS CLI** (optional, but recommended)

---


## Clone the Repository

Clone this repository to your local machine: 

```bash 
git cone https://github.com/thukyaw11/nestjs-temporal-starter.git
cd nestjs-temporal-starter
```


## Set Up Temporal 

To run Temporal without Docker, you need to install and set up the Temporal CLI. Follow the official Temporal CLI installation instructions here:

👉 [Temporal Setup Guide](https://temporal.io/setup/install-temporal-cli)


Once the Temporal CLI is installed, start the Temporal server using the following command:

```bash
temporal server start-dev
```
This will start the Temporal server with an in-memory database. The server will be accessible at **localhost:7233** and temporal UI at **localhost:8233**
