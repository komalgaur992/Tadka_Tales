from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, FavoriteRecipeListView

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('', include(router.urls)),
    path('favorites/', FavoriteRecipeListView.as_view(), name='favorite-recipes-list'),
]

from .views import RecipeStepDetailView
urlpatterns.append(path('<int:recipe_pk>/steps/<int:step_number>/', RecipeStepDetailView.as_view(), name='recipe-step-detail'))
