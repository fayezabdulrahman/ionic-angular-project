import { BookingsService } from './service/bookings.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './model/booking.mode';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;
  isBookingLoading = false;
  constructor(private bookingsService: BookingsService, private loadingController: LoadingController) { }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    })

  }

  ionViewWillEnter() {
    this.isBookingLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isBookingLoading = false;
    });
  }


  removeBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    this.loadingController.create({message: 'Canceling booking...'})
    .then(loadingElement => {
      loadingElement.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() =>{
        loadingElement.dismiss();
      });
    });

  };

}
