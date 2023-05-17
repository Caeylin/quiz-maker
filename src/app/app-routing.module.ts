import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResultsComponent} from "./results/results.component";
import {QuizComponent} from "./quiz/quiz.component";

const routes: Routes = [
  {
    path: '', component: QuizComponent
  },
  {
    path: 'results', component: ResultsComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
