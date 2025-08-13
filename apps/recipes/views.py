from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Recipe, FavoriteRecipe
from .serializers import (
    RecipeListSerializer, 
    RecipeDetailSerializer, 
    RecipeCreateUpdateSerializer,
    FavoriteRecipeSerializer,
    FavoriteRecipeCreateSerializer
)
from .permissions import IsAuthorOrReadOnly


class RecipeViewSet(viewsets.ModelViewSet):
    """ViewSet for handling recipe CRUD, search, filtering, and favoriting."""
    
    queryset = Recipe.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # Removed author__username as custom User has no username field. Use author__email if needed.
    filterset_fields = ['difficulty', 'language', 'category', 'dietary_preferences', 'author']
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['rating', 'created_at', 'prep_time', 'cook_time']
    permission_classes = [IsAuthorOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return RecipeListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return RecipeCreateUpdateSerializer
        return RecipeDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def favorite(self, request, pk=None):
        """Mark a recipe as a favorite."""
        recipe = self.get_object()
        user = request.user
        
        if FavoriteRecipe.objects.filter(user=user, recipe=recipe).exists():
            return Response({'detail': 'Recipe already in favorites.'}, status=status.HTTP_400_BAD_REQUEST)
        
        FavoriteRecipe.objects.create(user=user, recipe=recipe)
        return Response({'detail': 'Recipe added to favorites.'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unfavorite(self, request, pk=None):
        """Remove a recipe from favorites."""
        recipe = self.get_object()
        user = request.user
        
        try:
            favorite = FavoriteRecipe.objects.get(user=user, recipe=recipe)
            favorite.delete()
            return Response({'detail': 'Recipe removed from favorites.'}, status=status.HTTP_204_NO_CONTENT)
        except FavoriteRecipe.DoesNotExist:
            return Response({'detail': 'Recipe not in favorites.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='my-recipes')
    def my_recipes(self, request):
        """List recipes created by the authenticated user."""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        recipes = self.get_queryset().filter(author=request.user)
        page = self.paginate_queryset(recipes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recipes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get statistics about recipes."""
        total_recipes = Recipe.objects.count()
        easy_recipes = Recipe.objects.filter(difficulty='easy').count()
        medium_recipes = Recipe.objects.filter(difficulty='medium').count()
        hard_recipes = Recipe.objects.filter(difficulty='hard').count()
        
        return Response({
            'total_recipes': total_recipes,
            'difficulty_counts': {
                'easy': easy_recipes,
                'medium': medium_recipes,
                'hard': hard_recipes
            }
        })


class FavoriteRecipeListView(generics.ListAPIView):
    """View to list a user's favorite recipes."""
    
    serializer_class = FavoriteRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Prevent schema generation from executing user-dependent queryset
        if getattr(self, "swagger_fake_view", False):
            return FavoriteRecipe.objects.none()
        return FavoriteRecipe.objects.filter(user=self.request.user)

from .models import RecipeStep
from .serializers import RecipeStepSerializer
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

class RecipeStepDetailView(generics.RetrieveAPIView):
    queryset = RecipeStep.objects.all()
    serializer_class = RecipeStepSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        queryset = self.get_queryset()
        recipe_pk = self.kwargs.get('recipe_pk')
        step_number = self.kwargs.get('step_number')
        obj = get_object_or_404(queryset, recipe_id=recipe_pk, step_number=step_number)
        self.check_object_permissions(self.request, obj)
        return obj
