import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulatorComponent } from './simulator.component';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Data } from 'src/app/models/data';
import { Users } from 'src/app/models/users';
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

describe('SimulatorComponent', () => {
  let component: SimulatorComponent;
  let fixture: ComponentFixture<SimulatorComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['createItem', 'getList']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      declarations: [ SimulatorComponent ],
      imports: [ RouterTestingModule, MatIconModule, FormsModule ],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should prepare credito data', () => {
    // Simular el usuario obtenido del servicio de autenticación
    const user: Users = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      repassword: 'password',
      user_id: 123
    };
    authServiceSpy.getUser.and.returnValue(user);

    // Simular el retorno del servicio de datos al crear un elemento
    const mockData: Data = {
      id:0,
      moneda: 'Soles',
      precioVivienda: 100000,
      cuotaInicial: 64200,
      tasaEfectiva: 8,
      periodoGraciaParcial: 0,
      perodoGraciaTotal: 0,
      cuota: 0,
      numeroCuotas: 60,
      userId: 1
    };
    dataServiceSpy.createItem.and.returnValue(of<Data>(mockData));

    // Llamar al método de preparación de datos de crédito
    const creditoData = component.prepareCreditoData();

    // Verificar que los datos preparados coincidan con los datos simulados
    expect(creditoData['moneda']).toBe('Soles');
    expect(creditoData['precioVivienda']).toBe(64200);
    expect(creditoData['cuotaInicial']).toBe(4815);
    expect(creditoData['tasaEfectiva']).toBe(8);
    expect(creditoData['numeroCuotas']).toBe(60);

  });

});
