import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';




interface followercards {
  id: number;
  imgSrc: string;
  title: string;
  subtext: string;
  status: boolean;
}
@Component({
  selector: 'app-students',
  imports: [MaterialModule, IconModule, CommonModule, FormsModule],
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
  @Input({ required: true }) students: IUser[] = []

  searchText: string = '';
  filteredCount = signal<number>(0);
  ngOnInit() {
    this.filteredCount.set(this.students.length);
    this.filteredStudents();

  }
  filteredStudents(): IUser[] {
    let result = this.students;
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      result = this.students.filter(student =>
        student?.full_name?.toLowerCase().includes(searchLower) ||
        student?.brief_description?.toLowerCase().includes(searchLower)
      );
    }
    return result;
  }

  clean() {
    this.searchText = '';
    this.filteredCount.set(this.students.length);
  }
}
