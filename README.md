# AvProyecto

Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

Node.js: Descárgalo e instálalo desde nodejs.org.
MongoDB: Puedes usar MongoDB local o un servicio en la nube como MongoDB Atlas.
Git: Para clonar el repositorio. Descárgalo desde git-scm.com.

Configuración del Proyecto

Clona el repositorio:

git clone https://github.com/ZhuneIDS/AVPROYECTO.git
cd "tu-repositorio"

npm install

Configura las variables de entorno:
Crea un archivo .env en la raíz del proyecto.
Agrega la siguiente línea con tu URI de MongoDB:

MONGO_URI="tu uri para conectar a mongo"

Inicia el servidor:

npm run dev

Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

"""
___controllers/          # Controladores para manejar la lógica de las rutas
│______authController.js
│   └── documentController.js
├── routes/               # Rutas de la API
│   ├── authRoutes.js
│   └── documentRoutes.js
├── models/               # Modelos de MongoDB (por ejemplo, User.js)
├── front/                # Archivos estáticos del frontend (HTML, CSS, JS)
├── .env                  # Archivo de configuración de variables de entorno
├── app.js                # Archivo principal del backend
└── README.md             # Este archivo """
