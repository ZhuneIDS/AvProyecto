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

.
├── controllers/          # Controladores para manejar la lógica de las rutas

│   ├── authController.js      # Maneja la lógica de autenticación (registro, login, JWT)

│   └── documentController.js  # Maneja operaciones CRUD para documentos

├── routes/               # Rutas de la API

│   ├── authRoutes.js          # Rutas relacionadas con la autenticación (/api/auth)

│   └── documentRoutes.js      # Rutas para manipular documentos (/api/documents)

├── models/               # Modelos de MongoDB (por ejemplo, User.js)

│   └── User.js                # Esquema de usuario (username, password, email)

├── front/                # Archivos estáticos del frontend (HTML, CSS, JS)

│   ├── index.html             # Página principal del frontend

│   ├── styles.css             # Archivo CSS para estilos

│   └── app.js                 # Lógica del frontend para interactuar con la API

├── .env                  # Archivo de configuración de variables de entorno (MongoDB URI, JWT_SECRET, etc.)

├── app.js                # Archivo principal del backend, define rutas y conexión a MongoDB

└── README.md             # Documentación del proyecto

