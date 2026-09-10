/** Rutas en `public/tech/` (Simple Icons). Claves = nombre visible ES/EN. */
export const TECH_LOGOS: Record<string, string> = {
  Android: '/tech/android.svg',
  'Android nativo': '/tech/android.svg',
  'Native Android': '/tech/android.svg',
  Kotlin: '/tech/kotlin.svg',
  Java: '/tech/openjdk.svg',
  'Jetpack Compose': '/tech/jetpackcompose.svg',
  'Material Design': '/tech/materialdesign.svg',
  Angular: '/tech/angular.svg',
  TypeScript: '/tech/typescript.svg',
  JavaScript: '/tech/javascript.svg',
  RxJS: '/tech/reactivex.svg',
  'Tailwind CSS': '/tech/tailwindcss.svg',
  Ionic: '/tech/ionic.svg',
  'Spring Boot': '/tech/springboot.svg',
  'APIs REST': '/tech/swagger.svg',
  'REST APIs': '/tech/swagger.svg',
  JWT: '/tech/jsonwebtokens.svg',
  'Node.js': '/tech/nodedotjs.svg',
  Laravel: '/tech/laravel.svg',
  PostgreSQL: '/tech/postgresql.svg',
  Oracle: '/tech/oracle.svg',
  JUnit: '/tech/junit5.svg',
  'Karma / Jasmine': '/tech/jasmine.svg',
  Git: '/tech/git.svg',
  Docker: '/tech/docker.svg',
  'CI/CD': '/tech/githubactions.svg',
  Flutter: '/tech/flutter.svg',
  'Three.js': '/tech/threedotjs.svg',
};

export function techLogo(name: string): string | undefined {
  return TECH_LOGOS[name];
}
