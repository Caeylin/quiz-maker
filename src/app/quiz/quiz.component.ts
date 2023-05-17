import {Component, OnInit} from '@angular/core';
import {Category, Difficulties, QuizQuestion, QuizService} from "../quiz.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  categories: Category[] = [];
  quiz: QuizQuestion[] = [];
  difficulties = Object.values(Difficulties);
  selectedCategory?: number;
  selectedDifficulty?: Difficulties;
  quizFinished = false;

  constructor(private quizService: QuizService,
              private router: Router) {
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.quizService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  createQuiz() {
    this.quizService.getQuestions(this.selectedCategory!, this.selectedDifficulty!).subscribe(
      quizQuestions => this.quiz = quizQuestions);
  }

  selectAnswer(selectedAnswer: number, question: QuizQuestion, quiz: QuizQuestion[]) {
    question.selectedAnswer = question.answers[selectedAnswer];
    this.checkAnswersCompleted(quiz)
  }


  checkAnswersCompleted(quiz: QuizQuestion[]) {
    for (let question of quiz) {
      if (question.selectedAnswer === "") {
        return;
      }
    }
    this.quizFinished = true;
  }

  submitQuiz(quiz: QuizQuestion[]) {
    this.router.navigate(['/results']).then(() =>
      this.quizService.emmiter.emit(quiz))
  }
}


