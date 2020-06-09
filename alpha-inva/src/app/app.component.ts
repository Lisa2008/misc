import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

import { LetterGeneratorService } from './letter-generator.service';
import { LevelConfig } from './app.config';
import { Observable, Subscription, fromEvent, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LetterGeneratorService,
    {provide: 'serviceConfig', useValue: LevelConfig}
  ]
})
export class AppComponent implements OnInit {
  @ViewChild ('gamearea') gamearea: ElementRef;

  keyPress: Observable<string>;

  score = 0;
  level = 1;
  lines = [];
  currentLine = null;
  private maxlines = 0;

  constructor(private letterGenerator: LetterGeneratorService,
              private render: Renderer2) {
  }

  ngOnInit() {
    this.keyPress = fromEvent(document, 'keypress').pipe(
      map((event: KeyboardEvent) => event.key)
    );
  }

  startGame() {
    this.letterGenerator.getLetter(1).subscribe(x => {
      let line = this.render.createElement('div');
      line.setAttribute('class', 'line');
      let word = this.render.createElement('span');
      word.setAttribute('class', 'letter');
      word.style.left = `${this.getWPosition()}px`;
      word.textContent = x;
      this.render.appendChild(line, word);
      this.render.insertBefore(this.gamearea.nativeElement, line, this.currentLine);
      this.currentLine = line;
      this.lines.push({element: line, letter: x});

      this.maxlines = this.maxlines === 0 ? Math.ceil(this.gamearea.nativeElement.offsetHeight / line.offsetHeight) : this.maxlines;

      this.judgeGameOver();
    });

    this.keyPress.subscribe( key => {
      if(this.lines.length > 0 && key === this.lines[0].letter){
        this.render.removeChild(this.gamearea.nativeElement, this.lines[0].element);
        this.lines.shift();
      }
    });
  }

  private getWPosition() {
    const gameAreaWidth = this.gamearea.nativeElement.offsetWidth;
    return Math.random() * gameAreaWidth;
  }

  private judgeGameOver() {
    if(this.lines.length > this.maxlines) {

      this.letterGenerator.stopGenerateLetters();
      alert('Game Over');
    }
  }

}
