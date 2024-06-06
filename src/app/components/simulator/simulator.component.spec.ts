import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimulatorComponent } from './simulator.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('SimulatorComponent', () => {
  let component: SimulatorComponent;
  let fixture: ComponentFixture<SimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimulatorComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule,
        FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
