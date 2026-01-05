# 🚀 Manuel Reeb - Senior Portfolio

Landing page profesional de un Senior Fullstack Developer con 8+ años de experiencia.

## ✨ Características

- **Diseño Minimalista y Profesional**: Interfaz limpia sin distracciones innecesarias
- **Dark Mode**: Toggle entre modo claro y oscuro con persistencia en localStorage
- **Componentes Modulares**: Estructura limpia basada en componentes Angular
- **Responsive Design**: Totalmente adaptable a dispositivos móviles
- **Optimizado**: Compilación AOT, lazy loading y optimizaciones de rendimiento
- **CI/CD**: GitHub Actions configurado para builds automáticos
- **Tailwind CSS**: Utilidades modernas para estilos rápidos y mantenibles

## 🛠️ Stack Técnico

- **Frontend**: Angular 21 (LTS), TypeScript, Tailwind CSS 3
- **Build**: Angular CLI, Webpack
- **DevOps**: GitHub Actions
- **Hosting**: GitHub Pages (configurable para Vercel/Netlify)

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 20+
- npm 10+

### Instalación

```bash
# Instalar dependencias
npm install

# Servir la aplicación localmente
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📦 Comandos

```bash
npm start              # Desarrollo con hot-reload
npm run build         # Build producción
npm test              # Ejecutar tests
npm run lint          # Validar código (si está configurado)
```

## 📁 Estructura

```
src/app/
├── components/
│   ├── navbar/      # Navegación + theme toggle
│   ├── hero/        # Hero section
│   ├── companies/   # Logos de empresas
│   ├── projects/    # Proyectos destacados
│   ├── stack/       # Stack técnico
│   ├── about/       # Sobre mí
│   ├── services/    # Servicios
│   └── footer/      # Footer
├── services/
│   └── theme.ts     # Servicio de tema oscuro/claro
└── app.ts           # Componente raíz
```

## 🎨 Personalización

Edita los componentes en `src/app/components/` para:
- Cambiar información personal en `about.ts`
- Actualizar proyectos en `projects.ts`
- Modificar stack técnico en `stack.ts`
- Agregar logos de empresas en `companies.ts`

## 🚀 Deployment a GitHub Pages

1. Actualiza `cname` en `.github/workflows/ci-cd.yml`
2. Habilita GitHub Pages en settings
3. Apunta tu dominio a GitHub Pages
4. Cada push a `main` deployará automáticamente

## 📊 Características de Producción

✅ TypeScript Strict Mode
✅ Signals en lugar de RxJS cuando es posible
✅ Componentes standalone (Angular 14+)
✅ Tree-shaking automático
✅ Dark mode persistente
✅ Responsive sin librerías extras

## 📄 Licencia

MIT - Libre para usar y modificar

---

**Made with ❤️ using Angular & Tailwind CSS**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
