from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Recipe, RecipeStep, RecipeImage, FavoriteRecipe
from apps.users.serializers import UserProfileSerializer


class RecipeStepSerializer(serializers.ModelSerializer):
    """Serializer for RecipeStep model."""
    
    class Meta:
        model = RecipeStep
        fields = ('step_number', 'instruction', 'image', 'video_url')


class RecipeImageSerializer(serializers.ModelSerializer):
    """Serializer for RecipeImage model."""
    
    class Meta:
        model = RecipeImage
        fields = ('id', 'image', 'caption', 'uploaded_at')


class RecipeListSerializer(serializers.ModelSerializer):
    """Serializer for listing recipes."""
    
    author = UserProfileSerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ('id', 'title', 'description', 'author', 'main_image', 'difficulty',
                  'prep_time', 'cook_time', 'servings', 'rating', 'language', 'created_at')
    
    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_main_image(self, obj):
        main_image = obj.images.first()
        if main_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(main_image.image.url)
            return main_image.image.url
        return None


class RecipeDetailSerializer(serializers.ModelSerializer):
    """Serializer for recipe details."""
    
    author = UserProfileSerializer(read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    images = RecipeImageSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ('id', 'title', 'description', 'author', 'ingredients', 'steps',
                  'images', 'video_url', 'language', 'difficulty', 'prep_time',
                  'cook_time', 'servings', 'notes', 'rating', 'is_favorited',
                  'created_at', 'updated_at')
    
    @extend_schema_field(serializers.BooleanField())
    def get_is_favorited(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.favorited_by.filter(id=user.id).exists()
        return False


class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating recipes."""
    
    steps = RecipeStepSerializer(many=True)
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    
    class Meta:
        model = Recipe
        fields = ('title', 'description', 'ingredients', 'steps', 'images',
                  'video_url', 'language', 'difficulty', 'prep_time', 'cook_time',
                  'servings', 'notes')
    
    def create(self, validated_data):
        steps_data = validated_data.pop('steps')
        images_data = validated_data.pop('images', [])
        
        recipe = Recipe.objects.create(**validated_data)
        
        # Create recipe steps
        for step_data in steps_data:
            RecipeStep.objects.create(recipe=recipe, **step_data)
        
        # Create recipe images
        for image_data in images_data:
            RecipeImage.objects.create(recipe=recipe, image=image_data)
        
        return recipe
    
    def update(self, instance, validated_data):
        steps_data = validated_data.pop('steps', None)
        images_data = validated_data.pop('images', None)
        
        # Update recipe instance
        instance = super().update(instance, validated_data)
        
        # Update steps
        if steps_data is not None:
            instance.steps.all().delete()
            for step_data in steps_data:
                RecipeStep.objects.create(recipe=instance, **step_data)
        
        # Update images
        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                RecipeImage.objects.create(recipe=instance, image=image_data)
        
        return instance


class FavoriteRecipeSerializer(serializers.ModelSerializer):
    """Serializer for FavoriteRecipe model."""
    
    recipe = RecipeListSerializer(read_only=True)
    
    class Meta:
        model = FavoriteRecipe
        fields = ('id', 'recipe', 'created_at')


class FavoriteRecipeCreateSerializer(serializers.Serializer):
    """Serializer for adding a recipe to favorites."""
    
    recipe_id = serializers.UUIDField()
    
    def validate_recipe_id(self, value):
        if not Recipe.objects.filter(id=value).exists():
            raise serializers.ValidationError("Recipe not found.")
        return value
