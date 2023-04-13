import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HallService} from "./hall.service";
import {firstValueFrom} from "rxjs";
import {SessionBuyTicketDto} from "./session-buy-ticket.dto";
import {Ticket} from "./models/ticket.model";
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import OktaAuth from "@okta/okta-auth-js";

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css']
})
export class HallComponent implements OnInit {
  session!: SessionBuyTicketDto;
  sessionId!: string;
  tickets: Ticket[] = [];
  isAuthenticated: boolean | undefined;

  @ViewChild("purchaseButton") purchaseButtonElementRef!: ElementRef;

  constructor(private route: ActivatedRoute,
              private hallService: HallService,
              private oktaStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
  }

  async ngOnInit() {
    const params = await firstValueFrom(this.route.params);
    this.sessionId = params['sessionId'];
    this.session = await firstValueFrom(this.hallService.getSession(this.sessionId));
    this.isAuthenticated = (await firstValueFrom(this.oktaStateService.authState$)).isAuthenticated
  }

  getTotalPrice() {
    return this.tickets.map(ticket => ticket.price)
      .reduce((acc, price) => acc + price, 0);
  }

  async onPurchaseTickets() {
    this.purchaseButtonElementRef.nativeElement.disabled = true;
    this.isAuthenticated && this.hallService.purchaseTickets(this.tickets, this.sessionId).subscribe(_ =>
      alert('Our cats get their tickets for free! Enjoy the film =)')
    )
  }

  async onSelectSeat(btnSeat: HTMLButtonElement) {
    const dataset = btnSeat.dataset;
    const selectedRow = +dataset['row']!;
    const selectedSeat = +dataset['seat']!;
    const isAlreadyTaken = this.session.hall.rows.find(row => row.number === selectedRow)
      ?.seats.find(seat => seat.number === selectedSeat)?.taken;
    if (isAlreadyTaken) return;

    this.changeSeatIcon(btnSeat);
    const ticket = new Ticket(selectedRow, selectedSeat, dataset['type']!, +dataset['price']!);
    const foundedIndex = this.tickets.findIndex(value => JSON.stringify(value) === JSON.stringify(ticket));
    const isTicketSelected = foundedIndex !== -1;
    isTicketSelected ? this.removeTicket(foundedIndex) : this.add(ticket);
  }

  private changeSeatIcon(btnSeat: HTMLButtonElement) {
    const seatDiv = btnSeat.querySelector('.seat');
    const className = `selected-${seatDiv!.classList.contains('good-seat') ? 'good' : 'lux'}-seat`;
    seatDiv!.classList.toggle(className);
  }

  private add(ticket: Ticket) {
    this.tickets.push(ticket);
  }

  private removeTicket(index: number) {
    return this.tickets.splice(index, 1);
  }
}
