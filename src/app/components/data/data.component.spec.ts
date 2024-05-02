import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { DataComponent } from './data.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {UserToolbarComponent} from "../user-toolbar/user-toolbar.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {BehaviorSubject, of} from "rxjs";
import {MatTableModule} from "@angular/material/table";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {DataService} from "../../services/data.service";
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
        MatTableModule, RouterModule,
        BrowserModule,
        BrowserAnimationsModule ],
      declarations: [DataComponent,UserToolbarStubComponent],
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
    const fechaPago = component.calcularFechaPago(1); // Obtener la fecha del segundo pago
    const fechaEsperada = new Date(2024, 4, 30); // 30 de mayo de 2024
    expect(fechaPago).toEqual(fechaEsperada);
  });

  it('should get the number of installments', () => {
    const numeroCuotas = 5;
    dataServiceSpy.getNumeroCuotas.and.returnValue(of(numeroCuotas)); // Simular la respuesta del servicio
    component.getNumeroCuotas(); // Llamar al método para obtener el número de cuotas
    expect(component.numeroCuotas).toEqual(numeroCuotas);
  });


  it('should set MaxCuotas to true when trying to add more payments than allowed', () => {
    // Arrange
    const maxCuotas = 3; // Supongamos que el máximo de cuotas permitidas es 3
    spyOn(window, 'alert'); // Espiar la función alert para evitar que se muestre una alerta real
    dataServiceSpy.getNumeroCuotas.and.returnValue(of(maxCuotas)); // Simular que el servicio devuelve un máximo de 3 cuotas

    // Act
    component.getNumeroCuotas(); // Obtener el número de cuotas
    component.numeroCuotas = maxCuotas; // Establecer el número de cuotas permitidas
    component.pagos = [{}, {}, {}]; // Agregar 3 pagos para alcanzar el máximo permitido
    component.agregarPago(); // Intentar agregar otro pago

    // Assert
    expect(component.MaxCuotas).toBeTrue(); // Verificar que MaxCuotas se establece en true
  });
});
