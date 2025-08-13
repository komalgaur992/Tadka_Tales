from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Recipe(models.Model):
    CATEGORY_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('dessert', 'Dessert'),
        ('snack', 'Snack'),
    ]
    DIETARY_CHOICES = [
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('gluten-free', 'Gluten-Free'),
        ('dairy-free', 'Dairy-Free'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, blank=True)
    dietary_preferences = models.CharField(max_length=100, blank=True) # Storing as comma-separated string for simplicity
    """Model to store recipe information."""
    
    class Difficulty(models.TextChoices):
        EASY = 'easy', 'Easy'
        MEDIUM = 'medium', 'Medium'
        HARD = 'hard', 'Hard'
    
    class Language(models.TextChoices):
        ENGLISH = 'en', 'English'
        HINDI = 'hi', 'Hindi'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    ingredients = models.JSONField(default=list)
    video_url = models.URLField(blank=True, null=True)
    language = models.CharField(max_length=2, choices=Language.choices, default=Language.ENGLISH)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY)
    prep_time = models.DurationField()
    cook_time = models.DurationField()
    servings = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True, null=True)
    rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        default=0.0
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    favorited_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        through='FavoriteRecipe', 
        related_name='favorite_recipes'
    )
    
    class Meta:
        db_table = 'recipes'
        verbose_name = 'Recipe'
        verbose_name_plural = 'Recipes'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class RecipeStep(models.Model):
    """Model to store individual steps of a recipe."""
    
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number = models.PositiveIntegerField()
    instruction = models.TextField()
    image = models.ImageField(upload_to='recipe_steps/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recipe_steps'
        verbose_name = 'Recipe Step'
        verbose_name_plural = 'Recipe Steps'
        ordering = ['recipe', 'step_number']
        unique_together = ('recipe', 'step_number')
    
    def __str__(self):
        return f"Step {self.step_number} for {self.recipe.title}"


class RecipeImage(models.Model):
    """Model to store multiple images for a recipe."""
    
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='recipe_images/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'recipe_images'
        verbose_name = 'Recipe Image'
        verbose_name_plural = 'Recipe Images'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Image for {self.recipe.title}"


class FavoriteRecipe(models.Model):
    """Model to handle user's favorite recipes."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorite_recipes'
        verbose_name = 'Favorite Recipe'
        verbose_name_plural = 'Favorite Recipes'
        unique_together = ('user', 'recipe')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} favorited {self.recipe.title}"
