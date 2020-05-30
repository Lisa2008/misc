import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, of, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LetterGeneratorService {
  readonly levelChangeThreshold = 20;

  source = interval(1000);

  constructor(@Inject('gameWidth') private gameWidth: number) { }

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
     take(this.levelChangeThreshold),
     map(x => {
       return level > 3 ? this.randomLetter('all') : this.randomLetter('lowercase');
     })
   );
}
}
