import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { OldKanbanService } from 'src/app/services/apps/kanban/kanban.service';
import { Todos } from './kanban';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from 'src/app/icon/icon.module';
import { KanbanService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { IEpic, ITask } from 'src/app/common/models/interfaces';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  imports: [MaterialModule, CommonModule, IconModule, NgScrollbarModule],
})
export class AppKanbanComponent {
  todos: IEpic[] = [];
  inprogress: IEpic[] = [];
  completed: IEpic[] = [];
  isExpanded: boolean = false;

  courseId: number | null =
    Number(this.route.snapshot.paramMap.get('courseId')) || null;
  selectedId: any;

  constructor(
    public dialog: MatDialog,
    public taskService: OldKanbanService,
    private service: KanbanService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.service.getData(this.courseId ?? 0).subscribe((data) => {
      this.todos = data.filter((task) => task.percentage_completed === 0);
      this.inprogress = data.filter(
        (task) =>
          task.percentage_completed > 0 && task.percentage_completed < 100,
      );
      this.completed = data.filter((task) => task.percentage_completed === 100);
    });
  }

  goToTopic(topicId: number) {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`
        .replace(':courseId', this.courseId?.toString() || '0')
        .replace(':topicId', topicId.toString()),
    ]);
  }

  toggleExpand(epic: IEpic) {
    if (this.selectedId === epic.id) {
      this.selectedId = 0;
    } else {
      this.selectedId = epic.id;
    }
  }
}
