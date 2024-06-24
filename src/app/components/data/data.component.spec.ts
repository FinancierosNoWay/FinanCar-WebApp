import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DataComponent } from './data.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { UserToolbarComponent } from "../user-toolbar/user-toolbar.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { Component } from "@angular/core";
import { DataService } from "../../services/data.service";

// Creamos un stub para ActivatedRoute
@Component({
  selector: 'app-user-toolbar',
  template: ''
})
class UserToolbarStubComponent {}

class ActivatedRouteStub {
  private subject = new BehaviorSubject({}); // Inicializamos con un objeto vacío
  params = this.subject.asObservable();

  // Setter para actualizar los parámetros
  setParams(params: any) {
    this.subject.next(params);
  }
}

describe('DataComponent', () => {
  let component: DataComponent;
  let fixture: ComponentFixture<DataComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let activatedRoute: ActivatedRouteStub;
  let router: Router;

  beforeEach(async () => {
    const dataServiceSpyObj = jasmine.createSpyObj('DataService', ['getNumeroCuotas']);
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, MatPaginatorModule, MatIconModule,
        MatTableModule, RouterModule, BrowserModule, BrowserAnimationsModule ],
      declarations: [ DataComponent, UserToolbarStubComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterTestingModule }
      ]
    }).compileComponents();
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;

    fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute) as any;
    router = TestBed.inject(Router);

    spyOn(component['authService'], 'getUser').and.returnValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      repassword: 'password123',
      user_id: 1
    });

    // Simulamos el número de cuotas permitidas
    spyOn(component['dataService'], 'getNumeroCuotas').and.returnValue(of(5));

    // Inicializamos el componente
    fixture.detectChanges();
  });
  it('should verify if payments are allowed', () => {
    // Configuramos el número de cuotas
    component.numeroCuotas = 5;
    // Verificamos que las cuotas estén permitidas
    expect(component.VerificarCuotas()).toBe(false);
  });
  it('should calculate payment date correctly', () => {
    const fechaInicio = new Date(2024, 3, 30); // 30 de abril de 2024
    component.fechaInicio = fechaInicio;
    const fechaPago = component.calcularFechaPago(1);
    const fechaEsperada = new Date(2024, 4, 30); // 30 de mayo de 2024
    expect(fechaPago).toEqual(fechaEsperada);
  });

  it('should get the number of installments', () => {
    const numeroCuotas = 20;
    dataServiceSpy.getNumeroCuotas.and.returnValue(of(numeroCuotas));
    component.getNumeroCuotas();
    expect(component.numeroCuotas).toEqual(numeroCuotas);
  });
  it('should set MaxCuotas to true when no data is found', () => {
    // Simulamos que no hay datos para el usuario actual
    spyOn(component['dataService'], 'getList').and.returnValue(of([]));

    // Llamamos a ComprobarData(), que debería retornar false porque no hay datos
    const result = component.ComprobarData();

    // Verificamos que ComprobarData() devuelva false
    expect(result).toBe(false);

    // Intentamos agregar un pago, lo que debería establecer MaxCuotas en true
    component.agregarPago();

    // Verificamos que MaxCuotas sea true después de intentar agregar un pago sin datos
    expect(component.MaxCuotas).toBe(true);
  });

});
