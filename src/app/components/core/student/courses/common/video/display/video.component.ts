import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { TablerIconComponent } from 'angular-tabler-icons';
import { getElementActionByEntity, IElementAction } from 'src/app/common/data';
import { IncomingNavigableEntity, IVideo } from 'src/app/common/models/interfaces';
import { VideoService } from 'src/app/services/video.service';
import { AppElementNavigationComponent } from '../../element-navigation/element-navigation.component';
import { MyOwnElementPipe } from 'src/app/common/pipe/my-own-element.pipe';

@Component({
  selector: 'app-video',
  imports: [
    YouTubePlayerModule,
    TablerIconComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    AppElementNavigationComponent,
    MyOwnElementPipe
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnChanges {
  private service = inject(VideoService)
  private breakpointObserver = inject(BreakpointObserver);
  entityToCreate = output<string>();

  videoWidth = 800;
  videoHeight = 450;

  creationAction: IElementAction = getElementActionByEntity('VIDEO')!;

  @Input() ruleId!: number;
  @Input() articleId!: number;
  video: IVideo;

  navigationState: IncomingNavigableEntity = {
    item: { id: 0 },
    hasNext: false,
    hasPrevious: false,
  };

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe(result => {
      this.calculateDimensions();
    });

    this.goNext();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }

  calculateDimensions() {
    const screenWidth = window.innerWidth;
    this.videoWidth = Math.min(screenWidth * 0.8, 1200);
    this.videoHeight = this.videoWidth * 0.563; // Maintain 16:9
  }

  createElement(type: string) {
    this.entityToCreate.emit(type);
  }

  goNext() {
    this.service.navigate(this.articleId, { videoId: this.navigationState.nextId! })
      .subscribe(res => {
        this.video = res.item as IVideo;
        this.navigationState = res;
      });
  }

  goPrevious() {
    this.service.navigate(this.articleId, { videoId: this.navigationState.previousId! })
      .subscribe(res => {
        this.video = res.item as IVideo;
        this.navigationState = res;
      });
  }
}
