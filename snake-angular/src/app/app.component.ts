import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { ViewChild, ElementRef, TemplateRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild ('gamearea') gamearea: ElementRef;
  @ViewChild ('snakehead') snakeHead: ElementRef;
  @ViewChild ('food') food: ElementRef;
  @ViewChild ('gameover') goDialog: TemplateRef<any>;

  snake = {
    body: [],
    step: 32,
    status: false,
    move: false,
    direction: 'ArrowRight'
  };

  moveInterval: Subscription;

  constructor( private dialog: MatDialog, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.moveInterval = interval(800).subscribe(n => {
      if (this.snake.status && this.snake.move) {
        this.movesnake();
      }
    });

  }

  startgame() {
    this.resetSnake();
    this.snake.status = true;
    this.snake.move = true;
    this.putFood();
    this.gamearea.nativeElement.focus();
  }

  pause() {
    this.snake.move = !this.snake.move;
    this.gamearea.nativeElement.focus();
  }

  keymovesnake(e: KeyboardEvent) {
    if (e.code === this.snake.direction) {
      return;
    } else {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        this.snake.direction = e.code;
        this.movesnake();
      }
    }
  }

  movesnake() {
    const headTop = this.snakeHead.nativeElement.offsetTop;
    const headLeft = this.snakeHead.nativeElement.offsetLeft;

    const foodTop = this.food.nativeElement.offsetTop;
    const foodLeft = this.food.nativeElement.offsetLeft;

    let tempp: number;

    switch (this.snake.direction) {
      case 'ArrowUp': {
        tempp = headTop - this.snake.step;
        if (tempp <= 0 || (this.snake.body.length > 0 && tempp === this.snake.body[this.snake.body.length -1].offsetTop && headLeft === this.snake.body[this.snake.body.length -1].offsetLeft)){
          this.snake.status = false;
        } else {
          this.snakeHead.nativeElement.style.top = `${tempp}px`;
        }
        break;
      }
      case 'ArrowDown': {
        tempp = headTop + this.snake.step;
        if ( tempp >= 800 || (this.snake.body.length > 0 && tempp === this.snake.body[this.snake.body.length -1].offsetTop && headLeft === this.snake.body[this.snake.body.length -1].offsetLeft)) {
          this.snake.status = false;
        } else {
          this.snakeHead.nativeElement.style.top = `${tempp}px`;
        }
        break;
      }
      case 'ArrowLeft': {
        tempp = headLeft - this.snake.step;
        if (tempp <= 0 || (this.snake.body.length > 0 && tempp === this.snake.body[this.snake.body.length -1].offsetLeft && headTop === this.snake.body[this.snake.body.length -1].offsetTop)) {
          this.snake.status = false;
        } else {
          this.snakeHead.nativeElement.style.left = `${tempp}px`;
        }
        break;
      }
      case 'ArrowRight': {
        tempp = headLeft + this.snake.step;
        if (tempp >= 800 || (this.snake.body.length > 0 && tempp === this.snake.body[this.snake.body.length -1].offsetLeft && headTop === this.snake.body[this.snake.body.length -1].offsetTop)) {
          this.snake.status = false;
        } else {
          this.snakeHead.nativeElement.style.left = `${tempp}px`;
        }
        break;
      }
      default: {
        break;
      }
    }
    if(!this.snake.status) {
      this.gameOver();
      return;
    }
    if (this.snakeHead.nativeElement.offsetTop === this.food.nativeElement.offsetTop && this.snakeHead.nativeElement.offsetLeft === this.food.nativeElement.offsetLeft) {
      this.eatFood();
    }
    this.movetail(headTop,headLeft);
  }

  private putFood() {
    this.food.nativeElement.style.backgroundColor = this.getRandomColor();
    this.food.nativeElement.style.top = Math.floor(Math.random() * (800 / this.snake.step)) * this.snake.step + 'px';
    this.food.nativeElement.style.left = Math.floor(Math.random() * (800 / this.snake.step)) * this.snake.step + 'px';
  }

  private getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private eatFood() {
    let tail = this.renderer.createElement('div');
    tail.setAttribute('class', 'snakebodypart');
    tail.style.backgroundColor = this.food.nativeElement.style.backgroundColor;

    const headTop = this.snakeHead.nativeElement.offsetTop;
    const headLeft = this.snakeHead.nativeElement.offsetLeft;

    switch (this.snake.direction) {
      case 'ArrowUp': {
        tail.style.top = `${headTop + this.snake.step}px`;
        tail.style.left = `${headLeft}px`;
        break;
      }
      case 'ArrowDown': {
        tail.style.top = `${headTop - this.snake.step}px`;
        tail.style.left = `${headLeft}px`;
        break;
      }
      case 'ArrowLeft': {
        tail.style.top = `${headTop}px`;
        tail.style.left = `${headLeft + this.snake.step}px`;
        break;
      }
      case 'ArrowRight': {
        tail.style.top = `${headTop}px`;
        tail.style.left = `${headLeft - this.snake.step}px`;
        break;
      }
      default: {
        break;
      }
    }

    this.snake.body.push(tail);
    this.renderer.appendChild(this.gamearea.nativeElement, tail);
    //new food
    this.putFood();
  }

  private movetail(top, left) {
    if (!(this.snake.status && this.snake.move)) {
      return;
    }
    let sTop = top;
    let sLeft = left;

    let pTop, pLeft;

    for (let i = 0; i < this.snake.body.length; i++) {
      pTop = this.snake.body[i].offsetTop;
      pLeft = this.snake.body[i].offsetLeft;

      this.snake.body[i].style.top = `${sTop}px`;
      this.snake.body[i].style.left = `${sLeft}px`;

      sTop = pTop;
      sLeft = pLeft;
    }
  }

  private resetSnake() {
    for(let i = 0; i < this.snake.body.length; i++){
      this.renderer.removeChild(this.gamearea.nativeElement, this.snake.body[i]);
    }
    this.snake.body = [];
    this.snake.direction = 'ArrowRight';
    this.snakeHead.nativeElement.style.top = '0px';
    this.snakeHead.nativeElement.style.left = '0px';
  }

  private gameOver() {
    this.snake.move = false;
    this.snake.status = false;
    this.dialog.open(this.goDialog);
    this.resetSnake();
  }

  ngOnDestroy() {
    this.moveInterval.unsubscribe();
  }

}
