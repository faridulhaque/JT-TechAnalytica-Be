# 🗂️ Task Management App (Frontend)


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

1. **Clone the BACKEND repository, navigate to the project folder & use Docker**
   ```bash
   git clone https://github.com/faridulhaque/JT-TechAnalytica-Be.git

2. **Navigate to the project folder**
    ```bash
    cd JT-TechAnalytica-Be

3. **Start Docker and run the command**

    ```bash
   docker compose up --build

4. **Hit http://localhost:3000 to access the frontend UI.**
   
5. **Use these credentials for normal user login**
    - Username: user1
    - Password: pass1234

6. **Use these credentials for admin login**
    - Username: admin
    - Password: pass1234

**Note** : `docker-compose up --build` must be run in the backend repository.


# AI used: ChatGPT
## Purpose: To speed up code development

**UI Refinement**

Prompt:

    Refine the UI  
        - Only update the JSX  
        - Use Tailwind CSS  
        - Do not touch logic  
        - Keep consistency in padding, margin, and colors across the project  
        - Maintain responsiveness  
    
**DTO, Entities, and Service Functions**

Sample Prompt 1:

    Create a DTO with: title, description, employeeId. All required except description  

Sample Prompt 2:

    Create TaskEntity with:  
        - id (uuid)  
        - title  
        - description  
        - status (pending, done, processing; default: pending)  
        - isDeleted (default: false)  
        - assignedBy (ManyToOne with User)  
        - assignedTo (ManyToOne with User)  
    

Sample Prompt 3:

    Refine this function by adding:  
        - try/catch  
        - logger  
        - HttpException  
        - HttpStatus 
        - Don't touch the logic 
    

**Frontend Repository:** https://github.com/faridulhaque/JT-TechAnalytica-Fe

🧑‍🤝‍🧑 **Author**
    Faridul Haque Murshed https://github.com/faridulhaque