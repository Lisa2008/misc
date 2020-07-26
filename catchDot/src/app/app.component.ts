import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, fromEvent, interval } from 'rxjs';
import { map, tap, takeWhile, switchMap, scan } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild ('gamearea') gamearea: ElementRef;
  @ViewChild ('dot') dot: ElementRef;
  @ViewChild ('info') info: ElementRef;

  gameStatus = {
    hitCount: 0,
    interval: 800,
    gameStart: false
  };

  timerText = '';

  mouseMove: Observable<any>;

  ngAfterViewInit() {
    this.mouseMove = fromEvent(this.dot.nativeElement, 'mouseover').pipe(
      tap(ev => this.moveTheDot.call(this)),
      tap(ev => this.nextStatus.call(this)),
      switchMap(v => this.makeTimer()),
      tap(v => this.setDotSize.call(this, 30)),
      takeWhile( v => v > 0)
    );
  }

  startGame() {
    this.timerText = '';
    this.gameStatus = {
      hitCount: 0,
      interval: 800,
      gameStart: false
    };
    this.gameStatus.gameStart = true;
    this.resetTheDot();
    this.mouseMove.subscribe( n => {}, e => {}, () => {
      this.gameOver();
    });
  }

  private resetTheDot() {
    this.setDotSize(30);
    this.dot.nativeElement.style.transform = 'translate(0px, 0px)';
    this.dot.nativeElement.style.backgroundColor = 'lightgray';
  }

  private moveTheDot() {
    let dotX = Math.random() * 480;
    let dotY = Math.random() * 480;
    this.setDotSize(5);
    this.dot.nativeElement.style.transform = `translate(${dotX}px, ${dotY}px)`;
  }

  private setDotSize(size) {
    this.dot.nativeElement.style.width = size + 'px';
    this.dot.nativeElement.style.height = size + 'px';
  }

  private setTimerText(text) {
    this.timerText = text;
  }

  private makeTimer() {
    return interval(this.gameStatus.interval).pipe(
      map( v => 5 - v),
      tap( v => this.setTimerText.call(this, v)),
    );
  }

  private nextStatus() {
    this.gameStatus.hitCount++;
    if (this.gameStatus.hitCount % 3 === 0) {
      this.dot.nativeElement.style.backgroundColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
      this.gameStatus.interval = this.gameStatus.interval - 50;
    }
  }

  private gameOver() {
    this.timerText = 'Game Over';
    this.gameStatus.gameStart = false;
  }
}
