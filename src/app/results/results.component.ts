import {Component, OnInit} from '@angular/core';
import {QuizQuestion, QuizService} from "../quiz.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  finishedQuiz?: QuizQuestion[] = [];
  numberCorrect = 0;
  results: string = '';
  resultClass: string = '';

  constructor(private quizService: QuizService,
              private router: Router) {
    this.quizService.emmiter.subscribe(questions => this.finishedQuiz = questions)
  }

  ngOnInit() {
    this.determineScore();
  }

  getButtonClass(question: QuizQuestion, answer: string) {
    if (answer != question.correct_answer && answer === question.selectedAnswer) {
      return "inactive btn btn-danger"
    } else if (answer === question.correct_answer) {
      return "inactive btn btn-success"
    } else {
      return "inactive btn btn-outline-primary"
    }
  }

  determineScore() {
    this.finishedQuiz!.forEach(question => {
      if (question.selectedAnswer === question.correct_answer) {
        this.numberCorrect++;
      }
      this.results = "You scored " + this.numberCorrect + " out of 5";
      if (this.numberCorrect < 2) {
        this.resultClass = "bg-danger text-white text-center";
      } else if (this.numberCorrect < 4) {
        this.resultClass = "bg-warning text-white text-center";
      } else {
        this.resultClass = "bg-success text-white text-center";
      }
    })
  }

  reset() {
    this.router.navigate(['']);
  }
}
