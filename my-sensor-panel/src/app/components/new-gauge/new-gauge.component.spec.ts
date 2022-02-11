import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGaugeComponent } from './new-gauge.component';

describe('NewGaugeComponent', () => {
  let component: NewGaugeComponent;
  let fixture: ComponentFixture<NewGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
