import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { IVideo } from 'src/app/common/models/interfaces';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video',
  imports: [
    YouTubePlayerModule
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnChanges {
  private service = inject(VideoService)
  @Input() ruleCode!: string;
  @Input() artiCode!: string;
  video: IVideo;

  ngOnInit(): void {
    this.service.getByRule(this.ruleCode, this.artiCode).subscribe({
      next: (data) => {
        console.log("Video from the server: ",data)
        this.video = data;
      },
      error: (error) => console.error(error) 
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }
}
