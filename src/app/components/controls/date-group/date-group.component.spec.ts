import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateGroupComponent } from './date-group.component';

describe('DateGroupComponent', () => {
  let component: DateGroupComponent;
  let fixture: ComponentFixture<DateGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
