from django.contrib import admin
from .models import Recipe, RecipeStep, RecipeImage, FavoriteRecipe


class RecipeStepInline(admin.TabularInline):
    """Inline admin for RecipeStep model."""
    model = RecipeStep
    extra = 1
    fields = ('step_number', 'instruction', 'image', 'video_url')


class RecipeImageInline(admin.TabularInline):
    """Inline admin for RecipeImage model."""
    model = RecipeImage
    extra = 1
    fields = ('image', 'caption')


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    """Admin view for Recipe model."""
    list_display = ('title', 'author', 'difficulty', 'language', 'rating', 'created_at')
    list_filter = ('difficulty', 'language', 'author')
    search_fields = ('title', 'description', 'author__username')
    inlines = [RecipeStepInline, RecipeImageInline]
    fieldsets = (
        (None, {'fields': ('title', 'author', 'description', 'language', 'difficulty')}),
        ('Timings & Servings', {'fields': ('prep_time', 'cook_time', 'servings')}),
        ('Content', {'fields': ('ingredients', 'notes', 'video_url')}),
        ('Metadata', {'fields': ('rating',)}),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(FavoriteRecipe)
class FavoriteRecipeAdmin(admin.ModelAdmin):
    """Admin view for FavoriteRecipe model."""
    list_display = ('user', 'recipe', 'created_at')
    list_filter = ('user', 'recipe')
    search_fields = ('user__email', 'recipe__title')
    readonly_fields = ('created_at',)
