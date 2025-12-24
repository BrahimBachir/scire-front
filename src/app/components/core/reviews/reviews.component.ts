import {
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { IconModule } from 'src/app/icon/icon.module';
import { CommonModule } from '@angular/common';
import { FeatureType, IRate, IReview } from 'src/app/common/models/interfaces';
import { ReviewsService } from 'src/app/services';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';

@Component({
  selector: 'app-reviews',
  imports: [MaterialModule, CarouselModule, IconModule, CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class AppReviewsComponent implements OnInit {
  private reviewService = inject(ReviewsService)
  private dialog = inject(MatDialog)
  @Input() featureId: number;
  @Input() featureType: FeatureType;
  private take: number = 5;
  private skip: number = 0;


  public averageRating: number = 0.0;
  public ratingCount: number = 0;
  public ratings: IRate[] = [];
  public latestReviews: IReview[] = [];

/*   ratings = [
    { label: 1, value: 30, count: 485 },
    { label: 2, value: 20, count: 215 },
    { label: 3, value: 10, count: 110 },
    { label: 4, value: 60, count: 620 },
    { label: 5, value: 15, count: 160 },
  ]; */

  ngOnInit(): void {
    console.log("Feature: ", this.featureType, "FeatureID: ", this.featureId)
    this.loadReviewData();
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '450px',
      data: { title: 'Ayúdanos a mejorar' }
    });

    // Handle the result when the dialog closes
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 'result' contains { rating: number, reviewText: string }
        console.log('Review submitted:', result);
        this.submitReview(result.rating, result.reviewText);
      }
    });
  }

  loadReviewData() {
    this.reviewService.getReviewSummary({ featureId: this.featureId, featureType: this.featureType }).subscribe(summary => {
      this.averageRating = Number(summary.averageRating);
      this.ratingCount = summary.ratingCount;
      console.log("Start Distribution: ", summary)

      this.ratings = Object.keys(summary.starDistribution).map(key => {
        const count = summary.starDistribution[Number(key)];

        const percentage = (count / this.ratingCount) * 100;

        return {
          label: Number(key),
          value: percentage,
          count: count,
        };
      }).sort((a, b) => b.label - a.label);


      console.log(this.ratings)
    });

    this.reviewService.getLatestReviews({ featureId: this.featureId, featureType: this.featureType, take: this.take, skip: this.skip }).subscribe(reviews => {
      console.log("Reviews: ", reviews)
      this.latestReviews = reviews;
    });
  }

  submitReview(rating: number, reviewText: string): void {
    this.reviewService.createReview({
      featureId: this.featureId,
      featureType: this.featureType,
      rating,
      reviewText
    }).subscribe({
      next: (response) => {
        alert('Reseña enviada con éxito!');
        // Refresh the review list and summary data after a successful post
        this.loadReviewData();
      },
      error: (err) => {
        console.error(err)
        //alert(`Error al enviar reseña: ${err.error.message || 'Inténtalo de nuevo.'}`);
      }
    });
  }

  getFormattedRating(): string {
    return `${this.averageRating.toFixed(1)}/5`;
  }

  getStarClass(index: number): string {
    const fullStars = Math.floor(this.averageRating);
    const halfStar = (this.averageRating % 1) >= 0.5;

    if (index < fullStars) {
      return 'fill-warning';
    } else if (index === fullStars && halfStar) {
      return 'text-warning';
    } else {
      return 'text-gray';
    }
  }

  /* 
        const distribution: [] = [
            { label: '5 estrellas', value: parseInt(results.count || 0, 10) / parseInt(results.stars5 || 0, 10), count: parseInt(results.stars5 || 0, 10) },
            { label: '4 estrellas', value: parseInt(results.count || 0, 10) / parseInt(results.stars5 || 0, 10), count: parseInt(results.stars5 || 0, 10) },
            { label: '3 estrellas', value: parseInt(results.count || 0, 10) / parseInt(results.stars5 || 0, 10), count: parseInt(results.stars5 || 0, 10) },
            { label: '2 estrellas', value: parseInt(results.count || 0, 10) / parseInt(results.stars5 || 0, 10), count: parseInt(results.stars5 || 0, 10) },
            { label: '1 estrellas', value: parseInt(results.count || 0, 10) / parseInt(results.stars5 || 0, 10), count: parseInt(results.stars5 || 0, 10) }
        ]
  
  */

}
