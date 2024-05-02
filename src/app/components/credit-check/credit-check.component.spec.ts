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
      providers: [ { provide: ExcludedUsersPrueba, useValue: new ExcludedUsersPrueba() } ] // Mock ExcludedUsersPrueba
    }).compileComponents();


    fixture = TestBed.createComponent(CreditCheckComponent);
    component = fixture.componentInstance;
    excludedUsersPrueba = TestBed.inject(ExcludedUsersPrueba);
    fixture.detectChanges();
  });
  it('should get excluded DNIs', () => {
    const excludedDNIs: string[] = ['12345678', '87654321']; // Suponiendo que estos son los DNIs excluidos

    // Simulamos el comportamiento de getDNIList en la clase ExcludedUsersPrueba
    spyOn(excludedUsersPrueba, 'getDNIList').and.returnValue(excludedDNIs);

    // Llamamos a la función que queremos probar
    component.getExcludedDnis();

    // Verificamos que la lista de DNIs excluidos se haya obtenido correctamente
    expect(component.excludedUserDNIs).toEqual(excludedDNIs);
  });
  it('should set validateDni to false when DNI is not excluded', fakeAsync(() => {
    const testDNI = '12345678'; // Example DNI not in the excluded list (assuming your ExcludedUsersPrueba has different DNs)
    component.dniInput = testDNI;

    component.checkDNI();
    tick(); // Simulate asynchronous operations (if any)

    expect(component.validateDni).toBeFalsy();
  }));
  it('should return true for a valid DNI length (8 digits)', () => {
    const validDNI = '12345678';
    component.dniInput = validDNI;

    expect(component.checkDNILength()).toBeTruthy();
  });

  it('should return false for an invalid DNI length (less than 8 digits)', () => {
    const invalidDNI = '1234567';
    component.dniInput = invalidDNI;

    expect(component.checkDNILength()).toBeFalsy();
  });

  it('should return false for an invalid DNI length (more than 8 digits)', () => {
    const invalidDNI = '123456789';
    component.dniInput = invalidDNI;

    expect(component.checkDNILength()).toBeFalsy();
  });
  it('should return true for a DNI in the excluded list', () => {
    const excludedDNI = '12345678'; // Assuming this DNI is present in the excluded list
    component.excludedUserDNIs = [excludedDNI];
    component.dniInput = excludedDNI;

    expect(component.validateDNIExclusion()).toBeTruthy();
  });

  it('should return false for a DNI not in the excluded list', () => {
    const nonExcludedDNI = '87654321'; // Assuming this DNI is not present in the excluded list
    component.excludedUserDNIs = ['12345678'];
    component.dniInput = nonExcludedDNI;

    expect(component.validateDNIExclusion()).toBeFalsy();
  });

});
