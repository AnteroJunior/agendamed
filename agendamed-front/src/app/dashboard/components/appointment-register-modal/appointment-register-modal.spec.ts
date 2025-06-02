import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRegisterModal } from './appointment-register-modal';

describe('AppointmentRegisterModal', () => {
  let component: AppointmentRegisterModal;
  let fixture: ComponentFixture<AppointmentRegisterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRegisterModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentRegisterModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
