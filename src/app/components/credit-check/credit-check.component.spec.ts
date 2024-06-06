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


});
