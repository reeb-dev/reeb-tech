import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toMatch(/Android, Angular/);
  });

  it('should link the demos catalog', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const catalog = compiled.querySelector('#demos a[href="/demos/"]');
    expect(catalog).toBeTruthy();
    expect(compiled.querySelector('nav a[href="/demos/"]')?.textContent).toMatch(
      /Ejemplos de sistemas|Business demos/
    );
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/comercios|shops/i);
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/conviene tener una web|website is worth it/i);
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/aplicaciones móviles|Mobile apps as well/i);
    expect(compiled.querySelector('#demos #precios')).toBeNull();
    expect(compiled.querySelector('#demos a[href="/demos/#precios"]')).toBeTruthy();
  });

  it('should explain demo systems with an honest capability table', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const sistemas = compiled.querySelector('#demos #sistemas');
    expect(sistemas).toBeTruthy();
    expect(sistemas?.textContent).toMatch(/según su rubro|by trade/i);
    expect(sistemas?.textContent).toMatch(/todo incluido|everything included/i);
    expect(sistemas?.textContent).toMatch(/Kiosco \/ almacén|Kiosk \/ grocer/);
    expect(sistemas?.textContent).toMatch(/No es lo habitual|Not the usual need/);
    expect(sistemas?.textContent).toMatch(/expedientes no salen|Case files do not go/i);
    expect(sistemas?.textContent).toMatch(/Visitas: las ve el panel|Viewings: the panel sees them/);
    expect(sistemas?.textContent).toMatch(/precios en pesos|prices in Argentine pesos/);
    expect(sistemas?.querySelector('a[href="/demos/#sistemas"]')).toBeTruthy();
    expect(sistemas?.querySelector('a[href="/demos/#precios"]')).toBeTruthy();
    expect(compiled.querySelector('#demos #precios')).toBeNull();
  });

  it('should link the demos catalog from contact', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const contact = compiled.querySelector('#contact');
    expect(contact).toBeTruthy();
    const catalog = contact?.querySelector('a[href="/demos/"]');
    expect(catalog).toBeTruthy();
    expect(catalog?.textContent).toMatch(/Ver ejemplos de sistemas|See business demos/);
    expect(contact?.querySelector('a[href="https://wa.me/5492915757934"]')).toBeTruthy();
    expect(contact?.textContent).toMatch(/\+54 9 2915 75-7934/);
    expect(contact?.querySelector('a[href="mailto:manuelreeb@icloud.com"]')).toBeTruthy();
  });
});
