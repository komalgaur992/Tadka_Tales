from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Step


# User serializer for author information
class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model - used to show author information"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']
        read_only_fields = ['id']


# Step serializer - for individual recipe steps
class StepSerializer(serializers.ModelSerializer):
    """Serializer for Step model - handles individual cooking steps"""
    
    class Meta:
        model = Step
        fields = [
            'id', 'step_number', 'title', 'instruction', 
            'duration', 'temperature', 'image', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_step_number(self, value):
        """Ensure step number is positive"""
        if value < 1:
            raise serializers.ValidationError("Step number must be at least 1.")
        return value


# Recipe serializer - for complete recipes
class RecipeSerializer(serializers.ModelSerializer):
    """Serializer for Recipe model - handles complete recipes with steps"""
    
    # Include related data
    author = UserSerializer(read_only=True)  # Show author details
    steps = StepSerializer(many=True, read_only=True)  # Include all steps
    total_time = serializers.ReadOnlyField()  # Calculated property
    steps_count = serializers.SerializerMethodField()  # Custom field
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'author', 'category', 'difficulty',
            'prep_time', 'cook_time', 'total_time', 'servings', 'ingredients',
            'notes', 'image', 'rating', 'created_at', 'updated_at',
            'steps', 'steps_count'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'total_time']
    
    def get_steps_count(self, obj):
        """Get the number of steps for this recipe"""
        return obj.get_steps_count()
    
    def validate_prep_time(self, value):
        """Ensure prep time is reasonable"""
        if value < 0:
            raise serializers.ValidationError("Preparation time cannot be negative.")
        if value > 1440:  # 24 hours
            raise serializers.ValidationError("Preparation time seems too long (max 24 hours).")
        return value
    
    def validate_cook_time(self, value):
        """Ensure cook time is reasonable"""
        if value < 0:
            raise serializers.ValidationError("Cooking time cannot be negative.")
        if value > 1440:  # 24 hours
            raise serializers.ValidationError("Cooking time seems too long (max 24 hours).")
        return value
    
    def validate_servings(self, value):
        """Ensure servings is reasonable"""
        if value < 1:
            raise serializers.ValidationError("Servings must be at least 1.")
        if value > 50:
            raise serializers.ValidationError("Servings cannot exceed 50.")
        return value


# Recipe creation serializer - simplified for creating new recipes
class RecipeCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating new recipes"""
    
    class Meta:
        model = Recipe
        fields = [
            'title', 'description', 'category', 'difficulty',
            'prep_time', 'cook_time', 'servings', 'ingredients',
            'notes', 'image'
        ]
    
    def create(self, validated_data):
        """Create a new recipe with the current user as author"""
        # The author will be set in the view
        return Recipe.objects.create(**validated_data)


# Step creation serializer - for adding steps to recipes
class StepCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new steps"""
    
    class Meta:
        model = Step
        fields = [
            'step_number', 'title', 'instruction', 
            'duration', 'temperature', 'image'
        ]
    
    def create(self, validated_data):
        """Create a new step for a recipe"""
        # The recipe will be set in the view
        return Step.objects.create(**validated_data)
    
    def validate(self, data):
        """Validate step data"""
        recipe = self.context.get('recipe')
        step_number = data.get('step_number')
        
        if recipe and step_number:
            # Check if step number already exists for this recipe
            if Step.objects.filter(recipe=recipe, step_number=step_number).exists():
                raise serializers.ValidationError({
                    'step_number': f'Step {step_number} already exists for this recipe.'
                })
        
        return data


# Recipe list serializer - simplified for listing recipes
class RecipeListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing recipes (without steps)"""
    
    author = UserSerializer(read_only=True)
    total_time = serializers.ReadOnlyField()
    steps_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'author', 'category', 'difficulty',
            'prep_time', 'cook_time', 'total_time', 'servings', 
            'image', 'rating', 'created_at', 'steps_count'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'total_time']
    
    def get_steps_count(self, obj):
        """Get the number of steps for this recipe"""
        return obj.get_steps_count()
