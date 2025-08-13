from django.urls import path
from . import views

urlpatterns = [
    # Basic ping endpoint
    path('ping/', views.ping, name='ping'),
    
    # Recipe endpoints
    path('recipes/', views.RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),
    
    # Step endpoints (nested under recipes)
    path('recipes/<int:recipe_id>/steps/', views.StepListCreateView.as_view(), name='step-list-create'),
    path('recipes/<int:recipe_id>/steps/<int:pk>/', views.StepDetailView.as_view(), name='step-detail'),
    
    # Utility endpoints
    path('recipe-categories/', views.recipe_categories, name='recipe-categories'),
    path('recipe-difficulties/', views.recipe_difficulties, name='recipe-difficulties'),
    path('my-recipes/', views.my_recipes, name='my-recipes'),
    path('recipe-stats/', views.recipe_stats, name='recipe-stats'),
]
