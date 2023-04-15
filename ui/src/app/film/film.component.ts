import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FilmService} from './film.service';
import {Film} from "./models/film.model";
import {ActivatedRoute} from "@angular/router";
import {firstValueFrom, Observable} from "rxjs";
import {SessionDto} from "../poster/dto/session.dto";
import {isFuture, isSameDay, isToday, isTomorrow} from "date-fns";


@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
  film$!: Observable<Film>;
  sessions!: SessionDto[];
  selectedDate = new Date();
  @ViewChild('daySelect') daySelect!: ElementRef;

  constructor(private filmService: FilmService,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.film$ = this.filmService.getFilm(id);
    this.sessions = await firstValueFrom(this.filmService.getSessionsId(id));
  }

  mapStartAtDates() {
    return this.sessions.map(session => new Date(session.startAt))
      .sort((a, b) => a.getTime() - b.getTime());
  }

  getDateType(date: Date): 'today' | 'tomorrow' | 'other' {
    if (isToday(date)) {
      return 'today';
    }
    if (isTomorrow(date)) {
      return 'tomorrow';
    }
    return 'other';
  }

  isSameDay(dateStr: string | Date, date: Date) {
    return isSameDay(new Date(dateStr), date);
  }

  isTodayOrFuture(date: Date) {
    return isToday(date) || isFuture(date);
  }

  onSelectDate(date: Date) {
    this.selectedDate = date;
    this.hideSelection();
  }

  private hideSelection() {
    console.log(this.daySelect.nativeElement, this.daySelect.nativeElement.classList.contains('d-none'));
    this.daySelect.nativeElement.classList.add('d-none');
    console.log(this.daySelect.nativeElement, this.daySelect.nativeElement.classList.contains('d-none'));

  }

  onOpenSelection() {
    this.daySelect.nativeElement.classList.remove('d-none');
  }
}
