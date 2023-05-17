import {EventEmitter, Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";

export interface Category {
  id: number;
  name: string;
}

export enum Difficulties {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface CategoriesResponse {
  trivia_categories: Category[];
}

export interface QuizResponse {
  response_code: number,
  results: QuizQuestion[]
}

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
  selectedAnswer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private static QUESTIONS_BASE_URL = 'https://opentdb.com/api.php';
  private static CATEGORIES_URL = 'https://opentdb.com/api_category.php';
  emmiter: EventEmitter<QuizQuestion[]> = new EventEmitter<QuizQuestion[]>();

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoriesResponse>(QuizService.CATEGORIES_URL).pipe(map(
      response => {
        return response.trivia_categories
      }
    ));
  }

  getQuestions(categoryId: number, difficulty: string): Observable<QuizQuestion[]> {
    const options = {
      params: this.createParameters(categoryId, difficulty)
    };
    return this.http.get<QuizResponse>(QuizService.QUESTIONS_BASE_URL, options).pipe(
      map(result => {
        for (let question of result.results) {
          question.question = this.decodeHtml(question.question);
          question.correct_answer = this.decodeHtml(question.correct_answer);
          question.incorrect_answers = question.incorrect_answers.map(answer => {
            return this.decodeHtml(answer);
          });
          question.answers = this.getPossibleAnswers(question);
          question.selectedAnswer = '';
        }
        return result.results;
      }));
  }

  shuffleArray(array: string[]): string[] {
    for (let pos = array.length - 1; pos > 0; pos--) {
      const randomPos = Math.floor(Math.random() * (pos + 1));
      const current = array[pos];
      array[pos] = array[randomPos];
      array[randomPos] = current;
    }
    return array;
  }

  decodeHtml(html: string): string {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  getPossibleAnswers(question: QuizQuestion): string[] {
    return this.shuffleArray(question.incorrect_answers.concat(question.correct_answer).slice(0));
  }

  createParameters(categoryId: number, difficulty: string): HttpParams {
    return new HttpParams()
      .set('amount', 5)
      .set('category', categoryId)
      .set('difficulty', difficulty)
      .set('type', 'multiple')
  }
}
