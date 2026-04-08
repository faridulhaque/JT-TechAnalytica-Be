# 🗂️ Task Management App
<!-- ## 🎥 Demo
[![Watch the demo](public/taskflow-ss.png)](https://www.loom.com/share/2cf921599b7c4f37af09c2c34bbfd582) -->

## 🚀 Overview

A simple task management app where users are assigned tasks by an admin, can update their status, and admins can assign tasks, make updates, and track activity logs.



## 🧰 Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Daisy UI

### Backend
- NestJS
- TypeORM

## 🧑‍💻 Test Instructions

1. **Clone the BACKEND repository, navigate to the project folder & use docker**
   ```bash
   git clone https://github.com/faridulhaque/JT-TechAnalytica-Be

   cd JT-TechAnalytica-Be

   docker compose up --build
   
2. **Use these credentials for normal user login**
    - Username: user1
    - Password: pass1234

3. **Use these credentials for admin login**
    - Username: admin
    - Password: pass1234

**Note** : `docker-compose up --build` must be run in the backend repository.


# AI used: ChatGPT
## Purpose: To speed up code development

**UI Refinement**

Prompt:

    `Refine the UI  
        - Only update the JSX  
        - Use Tailwind CSS  
        - Do not touch logic  
        - Keep consistency in padding, margin, and colors across the project  
        - Maintain responsiveness  
    `
**DTO, Entities, and Service Functions**

Sample Prompt 1:

    `Create a DTO with: title, description, employeeId. All required except description`  

Sample Prompt 2:

    `Create TaskEntity with:  
        - id (uuid)  
        - title  
        - description  
        - status (pending, done, processing; default: pending)  
        - isDeleted (default: false)  
        - assignedBy (ManyToOne with User)  
        - assignedTo (ManyToOne with User)  
    `

Sample Prompt 3:

    `Refine this function by adding:  
        - try/catch  
        - logger  
        - HttpException  
        - HttpStatus 
        - Don't touch the logic 
    `

**Frontend Repository:** https://github.com/faridulhaque/JT-TechAnalytica-Fe

🧑‍🤝‍🧑 Author

    Faridul Haque Murshed https://github.com/faridulhaque