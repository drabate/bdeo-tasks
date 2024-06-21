import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpsertTaskComponent } from '../pages/taskboard/upsert-task/upsert-task.component';
import { Task } from '../models/task';

export const matDialogRefMock = {
  close: () => {},
};

export const noDataMock = {
  data: {},
};

export const taskMock = {
  _id: 'id',
  title: 'Test title',
  description: 'Test description',
  status: 'in-progress',
};

describe('Task Creation', () => {
  beforeEach(() => {
    cy.mount(UpsertTaskComponent, {
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: noDataMock },
      ],
    });
  });

  it('Title and description are required', () => {
    cy.get('mat-form-field.ng-invalid')
      .get('[formcontrolname="title"]')
      .should('exist');
    cy.get('mat-form-field.ng-invalid')
      .get('[formcontrolname="description"]')
      .should('exist');
  });

  it('Title and description are valid when filled', () => {
    cy.get('[formcontrolname="title"]').type('title');
    cy.get('[formcontrolname="title"]').type('description');

    cy.get('mat-form-field.ng-valid')
      .get('[formcontrolname="title"]')
      .should('exist');
    cy.get('mat-form-field.ng-valid')
      .get('[formcontrolname="description"]')
      .should('exist');
  });
});

describe('Task Edition', () => {
  beforeEach(() => {
    cy.mount(UpsertTaskComponent, {
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: taskMock },
      ],
    });
  });

  it('Title and description are filled', () => {
    cy.get('mat-form-field.ng-valid')
      .get('[formcontrolname="title"]')
      .should('have.value', 'Test title');
    cy.get('mat-form-field.ng-valid')
      .get('[formcontrolname="description"]')
      .should('have.value', 'Test description');
  });

  it('Title is deactivated when task is not in to-do status', () => {
    cy.get('mat-form-field.mat-form-field-disabled')
      .get('[formcontrolname="title"]')
      .should('exist');
  });
});
