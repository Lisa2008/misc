import { Component, OnInit } from '@angular/core';

import { LetterGeneratorService } from './letter-generator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LetterGeneratorService,
    {provide: 'gameWidth', useValue: 200}
  ]
})
export class AppComponent implements OnInit {
  score = 0;
  level = 1;
  tempshow: string;

  constructor(private letterGenerator: LetterGeneratorService) {
  }

  ngOnInit() {
    this.letterGenerator.getLetter(4).subscribe(x => this.tempshow = x);
  }

}
