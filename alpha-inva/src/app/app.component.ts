import { Component, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { LetterGeneratorService } from './letter-generator.service';
import { LevelConfig } from './app.config';
import { Observable, fromEvent, timer } from 'rxjs';
import { map, merge} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LetterGeneratorService,
    {provide: 'serviceConfig', useValue: LevelConfig}
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild ('gamearea') gamearea: ElementRef;

  keyPress: Observable<string>;
  gameLetters: Observable<any>;

  game = { status: false,
           level: 1,
           score: 0,
           higestScore: 0
          };

  lines = [];
  currentLine = null;
  private maxlines = 0;

  infoDiv: any;

  constructor(private letterGenerator: LetterGeneratorService,
              private render: Renderer2) {
  }

  ngOnInit() {
    this.keyPress = fromEvent(document, 'keypress').pipe(
      map((event: KeyboardEvent) => event.key)
    );
  }

  ngAfterViewInit() {
    this.infoDiv = this.render.createElement('div');
    this.infoDiv.setAttribute('class', 'info');
    this.render.appendChild(this.gamearea.nativeElement, this.infoDiv);
  }

  startGame() {
    this.infoDiv.classList.remove('gameover');
    this.infoDiv.innerHTML = `Level ${this.game.level}`;
    this.infoDiv.style.display = 'block';

    this.game.status = true;
    this.gameLetters = this.letterGenerator.getLetter(this.game.level).pipe(
      map(x => {
          return {source: 'g', letter: x};
      }),
      merge(this.keyPress)
    );

    this.gameLetters.subscribe( val => {
      this.infoDiv.style.display = 'none';
      if (typeof val === 'object'){
        let line = this.render.createElement('div');
        line.setAttribute('class', 'line');
        let word = this.render.createElement('span');
        word.setAttribute('class', 'letter');
        word.style.left = `${this.getWPosition()}px`;
        word.textContent = val.letter;
        this.render.appendChild(line, word);
        this.render.insertBefore(this.gamearea.nativeElement, line, this.currentLine);
        this.currentLine = line;
        this.lines.push({element: line, letter: val.letter});
        this.maxlines = this.maxlines === 0 ? Math.ceil(this.gamearea.nativeElement.offsetHeight / line.offsetHeight) : this.maxlines;
      } else {
        if (this.lines.length > 0 && val === this.lines[0].letter) {
          this.render.removeChild(this.gamearea.nativeElement, this.lines[0].element);
          this.lines.shift();
          this.game.score++;
          this.game.higestScore = this.game.higestScore > this.game.score ? this.game.higestScore : this.game.score;
        }
      }
      this.judgeGameOver();
    });
  }

  private getWPosition() {
    const gameAreaWidth = this.gamearea.nativeElement.offsetWidth;
    return Math.random() * gameAreaWidth;
  }

  private judgeGameOver() {
    if (this.lines.length > this.maxlines) {
      this.letterGenerator.stopGenerateLetters();
      this.game.status = false;
      this.game.score = 0;
      this.game.level = 1;
      this.clearChild();
      this.infoDiv.innerHTML = 'Game Over';
      this.infoDiv.classList.add('gameover');
      this.infoDiv.style.display = 'block';
    }

    if(this.lines.length === 0) {
      this.currentLine = null;
    }

    if (this.lines.length > 0 && this.lines[0].letter === ' ') {
      this.letterGenerator.stopGenerateLetters();
      this.clearChild();
      this.game.level++;

      this.infoDiv.innerHTML = `Level ${this.game.level}`;
      this.infoDiv.style.display = 'block';

      const nextTime = timer(2000);
      nextTime.subscribe( x => {
        this.infoDiv.style.display = 'none';
        this.startGame();
      });
    }
  }

  private clearChild() {
    for (let obj of this.lines) {
      this.render.removeChild(this.gamearea.nativeElement, obj.element);
    }
    this.lines = [];
    this.currentLine = null;
  }
}
