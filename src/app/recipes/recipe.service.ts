import { Injectable, EventEmitter } from '@angular/core';
import {Recipe} from './recipe';
import {Ingredient} from '../shared/ingredient';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class RecipeService {
  recipesChanged = new EventEmitter<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe('vage Biryani', 'very tasty', 'http://cdn.newsapi.com.au/image/v1/80322b5264c83235f95c2c0e67956f96?width=1024', [
      new Ingredient('French Fries', 2),
      new Ingredient('Indian biryani', 3)
    ]),
    new Recipe('Summer Salad', 'okayish', 'http://bronxvillelibrary.org/wp-content/uploads/panzanella-salad.jpg', [
      new Ingredient('Italian', 1),
      new Ingredient('French', 3),
    ])
  ];
  constructor(private http: Http) { }
  getRecipe() {
    return this.recipes;
  };
  getRecipes(id: number) {
    return this.recipes[id];
  };

  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.indexOf(recipe), 1);
  };

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  };
  editRecipe(oldRecipe: Recipe, newRecipe: Recipe) {
    this.recipes[this.recipes.indexOf(oldRecipe)] = newRecipe;
  }
  storeData() {
    const body = JSON.stringify(this.recipes);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post('https://recipebook-68dd5.firebaseio.com/recipes.json', body, { headers: headers });
  };

  fetchData() {
    return this.http.get('https://recipebook-68dd5.firebaseio.com/recipes.json')
      .map((response: Response) => response.json())
      .subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
        this.recipesChanged.emit(this.recipes);
      }
      )
  };
}
