# 📦 SaaS Demo
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Node](https://img.shields.io/badge/Node-24-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## 📖 Introducción
Interfaz de usuario moderna y reactiva para la gestión multi-inquilino. Este frontend actúa como el centro de control para los clientes del ecosistema SaaS Demo.

> **🚧 Proyecto en Desarrollo:** Esta demo técnica se encuentra en fase inicial. El enfoque actual es la implementación de componentes core y lógica de control de estado.

---

## 🛠️ Funcionalidades Técnicas Implementadas / En Curso

El proyecto destaca por resolver retos comunes en aplicaciones empresariales:

*   **Seguridad:** Integración con **Auth0** para identidad y protección de rutas.
*   **Gestión de Estado Moderna:** Uso de **Angular Signals** para manejar el estado de formularios y la UI de forma eficiente.
*   **Internacionalización (i18n):** Sistema multi-idioma (actualmente **ES/EN**).
*   **UI/UX Avanzada:**
    *   Soporte nativo para **Modo Claro / Modo Oscuro**.
    *   **Input de Color:** Selector dinámico para personalización.
    *   **Modales de Control:** Confirmación para eliminaciones y guardias de navegación para evitar la pérdida de cambios sin guardar.
*   **Procesamiento de Multimedia:** Input de imagen con **recorte y compresión mediante Canvas** en el cliente para optimizar el almacenamiento.
*   **Arquitectura de Despliegue:** Configuración segregada por **environments (dev/prod)**.

---

## 🚀 Visión de Futuro (Roadmap de Producto)

El objetivo es evolucionar esta demo hacia una plataforma SaaS completa con:

*   **Ultra-Personalización:** Permitir que cada cliente seleccione su propia paleta de colores corporativos para la interfaz.
*   **Expansión Global:** Soporte para nuevos idiomas (Chino, Italiano, etc.).
*   **Super-Admin Dashboard:**
    *   Capacidad de conmutar entre diferentes Tenants de forma fluida.
    *   **Modo "Impersonate":** Permitir a los administradores visualizar la interfaz tal y como la ve un empleado específico para soporte técnico y auditoría.
*   **Despliegue Multi-Cloud:** Infraestructura preparada para producción.
