from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
import json

from .models import Recipe, Step
from .serializers import (
    RecipeSerializer, RecipeListSerializer, RecipeCreateSerializer,
    StepSerializer, StepCreateSerializer
)


@api_view(['GET'])
def ping(request):
    """
    Simple ping endpoint to check if the API is running.
    Returns a JSON response with status and timestamp.
    """
    from datetime import datetime
    
    return Response({
        'status': 'success',
        'message': 'pong',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })


# Recipe API Views
class RecipeListCreateView(generics.ListCreateAPIView):
    """
    API view to list all recipes or create a new recipe.
    
    GET: Returns a list of all recipes (paginated)
    POST: Creates a new recipe (requires authentication)
    """
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'author']
    search_fields = ['title', 'description', 'ingredients']
    ordering_fields = ['created_at', 'rating', 'prep_time', 'cook_time']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use different serializers for list and create operations"""
        if self.request.method == 'POST':
            return RecipeCreateSerializer
        return RecipeListSerializer
    
    def perform_create(self, serializer):
        """Set the author to the current user when creating a recipe"""
        serializer.save(author=self.request.user)


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific recipe.
    
    GET: Returns detailed recipe information including steps
    PUT/PATCH: Updates the recipe (only author can update)
    DELETE: Deletes the recipe (only author can delete)
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        """Only the author can update or delete their recipe"""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]
    
    def perform_update(self, serializer):
        """Ensure only the author can update their recipe"""
        recipe = self.get_object()
        if recipe.author != self.request.user:
            raise PermissionError("You can only update your own recipes.")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure only the author can delete their recipe"""
        if instance.author != self.request.user:
            raise PermissionError("You can only delete your own recipes.")
        instance.delete()


# Step API Views
class StepListCreateView(generics.ListCreateAPIView):
    """
    API view to list steps for a recipe or create a new step.
    
    GET: Returns all steps for a specific recipe
    POST: Creates a new step for the recipe (requires authentication)
    """
    serializer_class = StepSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Filter steps by recipe ID from URL"""
        recipe_id = self.kwargs['recipe_id']
        return Step.objects.filter(recipe_id=recipe_id)
    
    def get_serializer_class(self):
        """Use different serializers for list and create operations"""
        if self.request.method == 'POST':
            return StepCreateSerializer
        return StepSerializer
    
    def perform_create(self, serializer):
        """Associate the step with the recipe and check permissions"""
        recipe_id = self.kwargs['recipe_id']
        recipe = get_object_or_404(Recipe, id=recipe_id)
        
        # Only the recipe author can add steps
        if recipe.author != self.request.user:
            raise PermissionError("You can only add steps to your own recipes.")
        
        serializer.save(recipe=recipe)
    
    def get_serializer_context(self):
        """Add recipe to serializer context for validation"""
        context = super().get_serializer_context()
        recipe_id = self.kwargs['recipe_id']
        context['recipe'] = get_object_or_404(Recipe, id=recipe_id)
        return context


class StepDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific step.
    
    GET: Returns detailed step information
    PUT/PATCH: Updates the step (only recipe author can update)
    DELETE: Deletes the step (only recipe author can delete)
    """
    serializer_class = StepSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Filter steps by recipe ID from URL"""
        recipe_id = self.kwargs['recipe_id']
        return Step.objects.filter(recipe_id=recipe_id)
    
    def get_permissions(self):
        """Only the recipe author can update or delete steps"""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]
    
    def perform_update(self, serializer):
        """Ensure only the recipe author can update steps"""
        step = self.get_object()
        if step.recipe.author != self.request.user:
            raise PermissionError("You can only update steps for your own recipes.")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure only the recipe author can delete steps"""
        if instance.recipe.author != self.request.user:
            raise PermissionError("You can only delete steps for your own recipes.")
        instance.delete()


# Additional utility views
@api_view(['GET'])
def recipe_categories(request):
    """
    Returns available recipe categories.
    """
    categories = [{'value': choice[0], 'label': choice[1]} 
                 for choice in Recipe.CATEGORY_CHOICES]
    return Response({'categories': categories})


@api_view(['GET'])
def recipe_difficulties(request):
    """
    Returns available recipe difficulty levels.
    """
    difficulties = [{'value': choice[0], 'label': choice[1]} 
                   for choice in Recipe.DIFFICULTY_CHOICES]
    return Response({'difficulties': difficulties})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_recipes(request):
    """
    Returns recipes created by the current user.
    """
    recipes = Recipe.objects.filter(author=request.user)
    serializer = RecipeListSerializer(recipes, many=True)
    return Response({'recipes': serializer.data})


@api_view(['GET'])
def recipe_stats(request):
    """
    Returns general statistics about recipes.
    """
    total_recipes = Recipe.objects.count()
    total_steps = Step.objects.count()
    categories_count = Recipe.objects.values('category').distinct().count()
    
    return Response({
        'total_recipes': total_recipes,
        'total_steps': total_steps,
        'categories_count': categories_count,
        'avg_steps_per_recipe': round(total_steps / total_recipes, 2) if total_recipes > 0 else 0
    })
