import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../../model/offer.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Offer;

  constructor() { }

  ngOnInit() {}


}
