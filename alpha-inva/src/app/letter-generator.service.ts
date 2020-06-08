import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, of, interval, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LetterGeneratorService {

  source: Observable<number>;
  private stopSignal$: Subject<any> = new Subject();

  constructor(@Inject('serviceConfig') private serviceConfig) {
    this.source = interval(this.serviceConfig.interval);
   }

  private randomLetter( condition: string ): string {
    if (condition === 'lowercase') {
      return String.fromCharCode(
        Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
      );
    } else {
      const ra = Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0));
      return String.fromCharCode(
        Math.round(Math.random()) === 1 ? (ra + 'A'.charCodeAt(0)) : (ra + 'a'.charCodeAt(0))
      );
    }
 }

 getLetter(level: number): Observable<string> {
   return this.source.pipe(
     take(this.serviceConfig.levelThreshold),
     //take(5),
     map(x => {
       return level > 3 ? this.randomLetter('all') : this.randomLetter('lowercase');
     }),
     takeUntil(this.stopSignal$)
   );
}

stopGenerateLetters() {
  this.stopSignal$.next();
}
}
