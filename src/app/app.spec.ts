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
    const catalog = compiled.querySelector('#demos a[href="demos/"]');
    expect(catalog).toBeTruthy();
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/comercios|shops/i);
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/conviene tener una web|website is worth it/i);
    expect(compiled.querySelector('#demos')?.textContent).toMatch(/aplicaciones móviles|Mobile apps as well/i);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/Presencia|Presence/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/USD 350/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/conversable|negotiable/i);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/1–2 semanas|1–2 weeks/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/ARCA en producción|Production ARCA/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/no carga stock|do not load stock/i);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/alquiler del local|renting a shop/i);
    expect(compiled.querySelector('#demos #precios')?.textContent).not.toMatch(/Capacitación|Training/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/GitHub Pages/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/USD 8–15/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/Cobros en línea|Online collections/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/USD 200/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/Mercado Pago/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/pasarela|payment gateway/i);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/A cotizar|To be quoted/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/según el caso|quoted for the case/);
    expect(compiled.querySelector('#demos #precios')?.textContent).toMatch(/no está incluido en el piso|not included in the USD 700 floor/);
    expect(compiled.querySelector('#demos #precios a[href^="https://wa.me/5492915757934"]')).toBeTruthy();
    expect(compiled.querySelector('#demos #precios a[href="mailto:manuelreeb@icloud.com"]')).toBeTruthy();
  });

  it('should link the demos catalog from contact', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const contact = compiled.querySelector('#contact');
    expect(contact).toBeTruthy();
    const catalog = contact?.querySelector('a[href="demos/"]');
    expect(catalog).toBeTruthy();
    expect(catalog?.textContent).toMatch(/Ver demos|See demos/);
  });
});
