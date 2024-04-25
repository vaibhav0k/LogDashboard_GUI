import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsGrpbydetailsComponent } from './logs-grpbydetails.component';

describe('LogsGrpbydetailsComponent', () => {
  let component: LogsGrpbydetailsComponent;
  let fixture: ComponentFixture<LogsGrpbydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsGrpbydetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogsGrpbydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
