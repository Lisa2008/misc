import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

import { LetterGeneratorService } from './letter-generator.service';
import { LevelConfig } from './app.config';

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

  score = 0;
  level = 1;
  lines = [];
  currentLine = null;
  private maxlines = 0;

  constructor(private letterGenerator: LetterGeneratorService,
              private render: Renderer2) {
  }

  ngOnInit() {
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
      this.lines.push(line);

      this.maxlines = this.maxlines === 0 ? Math.ceil(this.gamearea.nativeElement.offsetHeight / line.offsetHeight) : this.maxlines;

      this.judgeGameOver();
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
