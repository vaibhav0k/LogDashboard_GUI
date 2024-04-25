import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsDetailsComponent } from './logs-details.component';

describe('LogsDetailsComponent', () => {
  let component: LogsDetailsComponent;
  let fixture: ComponentFixture<LogsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
