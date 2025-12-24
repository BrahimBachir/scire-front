import { Injectable, signal } from '@angular/core';
import { tests } from '../core/student/test/testData';
import { Test } from '../core/student/test/test';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private tests = signal<Test[]>(tests);

  getTests() {
    return this.tests();
  }

  addTest(test: Test): void {
    test.id = this.tests().length + 1;
    this.tests.update((tests) => [...tests, test]);
  }

  updateTest(updatedTest: Test): void {
    this.tests.update((tests) => {
      const index = tests.findIndex((e) => e.id === updatedTest.id);
      if (index !== -1) {
        tests[index] = updatedTest;
      }
      return [...tests];
    });
  }

  deleteTest(testId: number): void {
    this.tests.update((tests) =>
      tests.filter((e) => e.id !== testId)
    );
  }
}
