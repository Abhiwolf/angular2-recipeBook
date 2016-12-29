import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormArray, FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {RecipeService} from '../recipe.service';
import {Subscription} from 'rxjs/Rx';
import {Recipe} from '../recipe';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm: FormGroup;
  private recipeIndex: number;
  private recipe: Recipe;
  private isNew = true;
  private subscription: Subscription;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.isNew = false;
          this.recipeIndex = +params['id'];
          this.recipe = this.recipeService.getRecipes(this.recipeIndex);
        } else {
          this.isNew = true;
          this.recipe = null;
        }
        this.initForm();
      }
    );
  }

  onSubmit() {
    const newRecipe = this.recipeForm.value;
    if (this.isNew) {
      this.recipeService.addRecipe(newRecipe);
    } else {
      this.recipeService.editRecipe(this.recipe, newRecipe);
    }
    this.navigateBack();
  };

  private navigateBack() {
    this.router.navigate(['../'])
  };
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onCancel() {
    this.navigateBack();
  }
  onAddItem(name: string, amount: string) {
    (<FormArray>this.recipeForm.controls['ingredient']).push(
      new FormGroup({
        name: new FormControl(name, Validators.required),
        amount: new FormControl(amount, [Validators.required,
          Validators.pattern("\\d+")
        ])
      })
    )
  }

  onRemoveItem(index: number) {
    (<FormArray>this.recipeForm.controls['ingredient']).removeAt(index);
  }
  private initForm() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeContent = '';
    let recipeIngredients: FormArray = new FormArray([]);

    if (!this.isNew) {
      if (this.recipe.hasOwnProperty('ingredient')) {
        for (let i = 0; i < this.recipe.ingredient.length; i++) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(this.recipe.ingredient[i].name, Validators.required),
              amount: new FormControl(this.recipe.ingredient[i].amount,
                [Validators.required,
                  Validators.pattern("\\d+")
                ])
            })
          );
        }
      }
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imagePath;
      recipeContent = this.recipe.description;
    }
    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      imagePath: [recipeImageUrl, Validators.required],
      description: [recipeContent, Validators.required],
      ingredient: recipeIngredients
    })
  }

}
