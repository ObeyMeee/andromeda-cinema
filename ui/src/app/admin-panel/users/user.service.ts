import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../shared/base.service';
import { User } from './user.interface';
import { Page } from '../../shared/pagination/page.interface';
import { RequestStatusService } from '../../shared/pending/request-status.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private http: HttpClient,
    private requestStatusService: RequestStatusService,
  ) {
    super();
  }

  getAll(page: number = 0, size: number = 10) {
    const url = `${this.baseUrl}users`;
    const request = this.http.get<Page<User>>(url, {
      params: {
        page,
        size,
      },
    });
    return this.requestStatusService.handleRequestWithStatus(request);
  }

  delete(id: string) {
    const url = `${this.baseUrl}users/${id}`;
    const request = this.http.delete<void>(url);
    return this.requestStatusService.handleRequestWithStatus(request);
  }
}
