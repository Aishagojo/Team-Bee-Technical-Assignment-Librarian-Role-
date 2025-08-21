# Group Bee – Librarian Role Solution

## Overview
This project is the **Librarian Role** for the Maktaba system.  
The librarian can manage book requests, approvals, rejections, and returns through a simple web interface built with **HTML, CSS, and JavaScript**.

---

## Core Features
- **Login as Librarian**  
- **View Pending Requests** → see all reader requests  
- **Approve Requests**  
  - Decrease stock (not below 0)  
  - Add book to reader’s borrowed list  
  - Update borrow log  
- **Reject Requests** → mark with reason  
- **Handle Returns**  
  - Check book condition (Good / Damaged)  
  - Increase stock back  
  - Close borrow log  

---

## Librarian Dashboard
- **Pending Requests** (Approve / Reject buttons)  
- **Borrowed Books** (who has what, due dates)  
- **Returns** (mark returned + condition)  
- Real-time stock count updates  

---

## Example Flow
1. Reader requests **“Clean Code”** (stock = 3)  
2. Librarian approves  → stock = 2, log updated  
3. Reader returns book → Librarian marks “Good” → stock = 3 again  

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Data Handling:** JSON (to simulate requests, books, logs)  

---

## How to Run
1. Open `index.html` in your browser.  
2. Use the dashboard to manage requests.  
3. Approve, reject, and return books.  

