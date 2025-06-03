import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentUpdateModal } from './appointment-update-modal';

describe('AppointmentUpdateModal', () => {
  let component: AppointmentUpdateModal;
  let fixture: ComponentFixture<AppointmentUpdateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentUpdateModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentUpdateModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
