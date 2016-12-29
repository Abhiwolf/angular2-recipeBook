import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {Recipe} from "../recipe";
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  //new Recipe('Schnitzel', 'very tasty', 'http://cdn.newsapi.com.au/image/v1/80322b5264c83235f95c2c0e67956f96?width=1024', []),
  //new Recipe('Summer Salad', 'okayish', 'http://bronxvillelibrary.org/wp-content/uploads/panzanella-salad.jpg', [])

  @Output() recipeSelected = new EventEmitter<Recipe>();
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipes = this.recipeService.getRecipe();
    this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => this.recipes = recipes
    );
  }

}
