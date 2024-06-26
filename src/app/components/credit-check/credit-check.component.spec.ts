import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { CreditCheckComponent } from './credit-check.component';
import {HttpClientModule} from "@angular/common/http";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {CarsComponent} from "../cars/cars.component";
import {UserToolbarComponent} from "../user-toolbar/user-toolbar.component";
import {FormsModule} from "@angular/forms";
import {ExcludedUsersService} from "../../services/excluded_users/excluded-users.service";
import {ExcludedUsersPrueba} from "../../models/excluded_users_prueba";

describe('CreditCheckComponent', () => {
  let component: CreditCheckComponent;
  let fixture: ComponentFixture<CreditCheckComponent>;
  let excludedUsersPrueba: ExcludedUsersPrueba;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,RouterModule, MatIconModule, FormsModule],
      declarations: [CreditCheckComponent, UserToolbarComponent],
      providers:[{provide:ExcludedUsersPrueba,useValue:new ExcludedUsersPrueba() } ]
    }).compileComponents();


    fixture = TestBed.createComponent(CreditCheckComponent);
    component = fixture.componentInstance;
    excludedUsersPrueba = TestBed.inject(ExcludedUsersPrueba);
    fixture.detectChanges();
  });
  it('deberia establecer validarDni en falso cuando el DNI no está excluido', fakeAsync(() => {
    const testDNI = '12345678';
    component.dniInput = testDNI;

    component.checkDNI();
    tick(); // Simulate asynchronous operations (if any)

    expect(component.validateDni).toBeFalsy();
  }));
  it('debería retornar true cuando la longitud del DNI es 8', () => {
    component.dniInput = '12345678';
    expect(component.checkDNILength()).toBeTrue();
  });

  it('debería retornar false cuando la longitud del DNI no es 8', () => {
    component.dniInput = '1234567';
    expect(component.checkDNILength()).toBeFalse();
  });

  it('debería devolver verdadero para un DNI en la lista de excluidos', () => {
    const excludedDNI = '12345678';
    component.excludedUserDNIs = [excludedDNI];
    component.dniInput = excludedDNI;

    expect(component.validateDNIExclusion()).toBeTruthy();
  });

  it('debería mostrar un mensaje de exclusión si el DNI está en la lista de excluidos', () => {
    spyOn(component, 'checkDNILength').and.returnValue(true);
    spyOn(component, 'validateDNIExclusion').and.returnValue(true);

    component.checkDNI();
    expect(component.message).toBe('El DNI está en la lista de usuarios excluidos.');
    expect(component.validateDni).toBeFalse();
  });


});

