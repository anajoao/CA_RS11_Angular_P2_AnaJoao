import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessosmodalComponent } from './acessosmodal.component';

describe('AcessosmodalComponent', () => {
  let component: AcessosmodalComponent;
  let fixture: ComponentFixture<AcessosmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcessosmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcessosmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
