# 💕 Nuestra Historia

Una página web romántica estática hecha con HTML, CSS y JavaScript puro — sin frameworks, sin dependencias, sin base de datos. Diseñada para desplegarse en **GitHub Pages** de forma gratuita.

---

## ✨ Características

- **Portada** con imagen principal y contador de días juntos
- **Galería de medios** — fotos y videos de YouTube mezclados
- **Álbumes** con filtros por categoría
- **Línea de tiempo** de momentos especiales
- **Mapa interactivo** con Leaflet + OpenStreetMap
- **Carta** desplegable con animación
- **Lightbox** para ver fotos a pantalla completa con navegación por teclado
- **Videos con lazy loading** — el video de YouTube solo carga al hacer clic
- **Diseño responsive** — funciona en móvil, tablet y escritorio
- **Accesibilidad** — navegación por teclado, ARIA labels, skip link

---

## 📁 Estructura del proyecto

```
nuestra-historia/
├── index.html              # Página principal
├── data/
│   └── memories.js         # ⭐ Todo tu contenido va aquí
├── js/
│   └── main.js             # Lógica de la página
├── css/
│   └── styles.css          # Estilos
└── assets/
    └── photos/             # Tus fotos van aquí
```

---

## 🚀 Cómo subir a GitHub Pages

### 1. Crear el repositorio

1. Entra a [github.com](https://github.com) e inicia sesión
2. Haz clic en **New repository**
3. Ponle un nombre, ejemplo: `nuestra-historia`
4. Déjalo en **Public**
5. Haz clic en **Create repository**

### 2. Subir los archivos

Desde tu terminal, dentro de la carpeta `nuestra-historia/`:

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nuestra-historia.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Entra a **Settings → Pages**
3. En **Build and deployment** elige **Deploy from a branch**
4. Selecciona la rama `main` y carpeta `/ (root)`
5. Haz clic en **Save**

La URL de tu página quedará así:

```
https://TU-USUARIO.github.io/nuestra-historia/
```

> Los cambios pueden tardar 1-2 minutos en verse reflejados después de cada push.

---

## ⚙️ Personalización

Todo el contenido se edita en **un solo archivo**: `data/memories.js`.

### Nombres y fecha de inicio

```js
names: {
  yourName:    "TU NOMBRE",
  partnerName: "NOMBRE DE TU PAREJA"
},
relationshipStart: "2024-06-15",  // formato YYYY-MM-DD
```

### Agregar fotos

1. Comprime tu foto con [Squoosh](https://squoosh.app) (formato WebP)
2. Colócala en `assets/photos/`
3. Agrégala en el array `media`:

```js
{
  type:     "photo",
  title:    "Nuestra primera cita",
  caption:  "Una tarde que siempre voy a recordar.",
  category: "Citas",
  date:     "15 de junio",
  image:    "assets/photos/primera-cita.webp",
  alt:      "Nosotros en el café"
}
```

### Agregar videos de YouTube

1. Sube tu video a YouTube en modo **No listado**
2. Copia el ID del video (parte después de `?v=` en la URL)
3. Agrégalo en el array `media`:

```js
{
  type:      "video",
  title:     "Nuestro primer viaje",
  caption:   "Un día que nunca voy a olvidar.",
  category:  "Aventuras",
  date:      "Julio 2024",
  videoId:   "ID_DEL_VIDEO",
  thumbnail: ""  // vacío = miniatura automática de YouTube
}
```

### Tamaños recomendados de imágenes

| Uso | Campo | Ancho | Calidad |
|-----|-------|-------|---------|
| Foto de portada | `hero.image` | 1200px | 80% | *
| Fotos de galería | `media[].image` | 800px | 75% | 
| Portadas de álbum | `albums[].cover` | 600px | 75% | *
| Línea de tiempo | `moments[].image` | 900px | 75% | *

### Agregar un lugar al mapa

1. Abre [Google Maps](https://maps.google.com)
2. Haz clic derecho en el lugar → copia las coordenadas
3. Agrégalo en el array `places`:

```js
{
  name:      "El café donde nos conocimos",
  address:   "Av. Larco 345, Miraflores",
  date:      "15 de junio 2024",
  note:      "Aquí fue todo.",
  latitude:  -12.1219,
  longitude: -77.0282,
  icon:      "heart"   // "heart" = ♥   "star" = ✦
}
```

### Álbumes

Los álbumes usan `mediaIndexes` — son las posiciones (desde 0) de los elementos en el array `media`:

```js
media: [
  { title: "Foto A" },   // índice 0
  { title: "Foto B" },   // índice 1
  { title: "Video C" },  // índice 2
]

albums: [
  {
    title:        "Nuestras citas",
    category:     "Citas",
    description:  "Momentos que atesoramos.",
    cover:        "assets/photos/portada.webp",
    mediaIndexes: [0, 1]   // incluye Foto A y Foto B
  }
]
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Estilos y diseño responsive |
| JavaScript ES6 | Lógica del cliente |
| [Leaflet 1.9.4](https://leafletjs.com/) | Mapa interactivo |
| [OpenStreetMap](https://www.openstreetmap.org/) | Tiles del mapa |
| [Google Fonts](https://fonts.google.com/) | Tipografías (Playfair Display + DM Sans) |
| YouTube IFrame API | Reproductor de video lazy |

---

## 🔒 Privacidad

GitHub Pages publica el contenido de forma **pública**. Ten en cuenta:

- No subas fotos o información que no quieras hacer pública
- Los videos de YouTube en modo **No listado** solo los ve quien tenga el link
- Para hacer la página privada necesitarías un plan de pago en GitHub o un hosting alternativo

---

## 📝 Licencia

Proyecto personal. Libre para uso y modificación.
