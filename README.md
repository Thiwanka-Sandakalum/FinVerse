# FinVerse 🏦💼

**Your Intelligent Financial Companion for Smart Money Decisions**

🌐 **Live Application:** [https:finverse.com](https://finverselk.web.app/)

FinVerse is a **cloud-native, AI-powered financial marketplace** that connects users with financial institutions, enabling smart comparison, discovery, and decision-making across financial products through personalized insights.

---

## 🎯 What is FinVerse?

FinVerse is a **two-sided marketplace** designed for both consumers and financial institutions.

### 👤 For Users

* Compare financial products across multiple institutions
* Save and organize favorite products
* Share product comparisons with others
* Chat with an AI assistant for instant financial guidance
* Create user profiles for personalized recommendations

### 🏛️ For Financial Institutions

* List and manage financial products
* Showcase competitive rates and features
* Connect with qualified prospects
* Access analytics on product performance and engagement

---

## 🏗️ High-Level Architecture

* **Frontend:** Firebase-hosted React applications
* **Backend:** Azure-hosted microservices (Node.js & Python)
* **API Gateway:** Azure API Management (single public entry point)
* **Authentication:** Auth0 (OIDC + RBAC)
* **AI Layer:** RAG-based agent using Gemini + LangChain
* **Data:** Azure MySQL, Redis, MongoDB Vector DB
* **Networking:** Private Azure VNet with subnet isolation

---

## 🧱 Technology Stack

<div align="center">

### **Frontend & UI**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge\&logo=redux\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge\&logo=mantine\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)

### **Backend & APIs**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![Azure API Management](https://img.shields.io/badge/Azure_APIM-0078D4?style=for-the-badge\&logo=microsoft-azure\&logoColor=white)

### **Databases & Messaging**

![Azure MySQL](https://img.shields.io/badge/Azure_MySQL-0078D4?style=for-the-badge\&logo=mysql\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Vector_DB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

### **AI & ML**

![Google Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge\&logo=google\&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge\&logo=langchain\&logoColor=white)

### **Cloud & DevOps**

![Microsoft Azure](https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge\&logo=microsoft-azure\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge\&logo=github-actions\&logoColor=white)

</div>

---

## 🚀 Key Features

### 💰 Smart Financial Product Comparison

* Loans, fixed deposits, credit cards, and banking services
* Institution-to-institution comparisons
* Personalized ranking based on user profile

---

### 🤖 AI-Powered Financial Assistant

* RAG-based AI chat assistant
* Product-aware recommendations
* Simplified explanations of complex financial products
* 24/7 availability

---

### 📊 Personal Financial Workspace

* Save and manage favorite products
* Create and share comparison lists
* Track research and decisions in one place

---

### 📈 Interest Rate Intelligence

* Monitor real-time interest rates
* Historical trend analysis
* Rate change alerts
* Best-rate recommendations

---

### 🏛️ Institutional Marketplace

* Product listing and management
* Customer engagement tools
* Performance and engagement analytics

---

## 🔐 Security & Access Control

* Auth0-based authentication (OIDC)
* JWT-secured APIs
* Role-based access control (User / Institution / Admin)
* Private backend services within Azure VNet
* Single public backend entry via Azure API Management

---

## 🏆 Why FinVerse?

* **All-in-one financial discovery platform**
* **AI-driven, personalized insights**
* **Enterprise-grade security**
* **Scalable microservice architecture**
* **User-friendly experience for all skill levels**

---

## 🏗️ Architecture Overview

FinVerse follows a secure, scalable, cloud-native microservices architecture with clear separation between frontend, API gateway, backend services, and data layers.

🔍 Key Architectural Principles

* **Single public backend entry point via Azure API Management**

* **Private backend services isolated within an Azure VNet**

* **Role-based authentication and authorization using Auth0**

* **Microservices per domain (User, Product, AI Agent)**

AI-first design using a RAG-based agent architecture

## 📐 System Architecture Diagram

The diagram below illustrates the complete FinVerse system architecture, including frontend hosting, API gateway, backend microservices, private networking, databases, and external services.

![FinVerse Architecture](assets/diagram.png)