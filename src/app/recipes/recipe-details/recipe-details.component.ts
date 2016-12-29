import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import { Recipe } from '../recipe';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private recipeIndex: number;
  selectedRecipe: Recipe;
  constructor(private sls: ShoppingListService, private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.recipeIndex = params['id'];
        this.selectedRecipe = this.recipeService.getRecipes(this.recipeIndex);
      }
    )
  }
  onAddShoppingList() {
    this.sls.addItems(this.selectedRecipe.ingredient);
  }
  onEdit() {
    this.router.navigate(['/recipes', this.recipeIndex, 'edit']);
  };
  onDelete() {
    this.recipeService.deleteRecipe(this.selectedRecipe);
    this.router.navigate(['/recipes']);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
