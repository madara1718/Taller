import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactoComponent } from './artefacto.component';

describe('ArtefactoComponent', () => {
  let component: ArtefactoComponent;
  let fixture: ComponentFixture<ArtefactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtefactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtefactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
