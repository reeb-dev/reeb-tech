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
