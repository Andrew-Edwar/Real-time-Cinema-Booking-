// notification.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private newTutorialAddedSource = new Subject<void>();
  private tutorialNotificationSource = new Subject<string>();

  newTutorialAdded$ = this.newTutorialAddedSource.asObservable();
  tutorialNotification$ = this.tutorialNotificationSource.asObservable();

  announceNewTutorialAdded() {
    this.newTutorialAddedSource.next();
  }

  announceTutorialNotification(message: string) {
    this.tutorialNotificationSource.next(message);
  }
}
