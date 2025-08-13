from django.contrib import admin
from .models import Recipe, Step


# Inline admin for Steps within Recipe admin
class StepInline(admin.TabularInline):
    """Inline admin to manage steps within recipe admin page"""
    model = Step
    extra = 1  # Show 1 empty step form by default
    fields = ['step_number', 'title', 'instruction', 'duration', 'temperature']
    ordering = ['step_number']


# Recipe admin configuration
@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    """Admin configuration for Recipe model"""
    
    list_display = [
        'title', 'author', 'category', 'difficulty', 
        'prep_time', 'cook_time', 'total_time', 'servings', 
        'rating', 'created_at'
    ]
    
    list_filter = [
        'category', 'difficulty', 'created_at', 
        'author', 'rating'
    ]
    
    search_fields = [
        'title', 'description', 'ingredients', 
        'author__username', 'author__first_name', 'author__last_name'
    ]
    
    readonly_fields = ['created_at', 'updated_at', 'total_time']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'author', 'image')
        }),
        ('Recipe Details', {
            'fields': ('category', 'difficulty', 'prep_time', 'cook_time', 'servings')
        }),
        ('Content', {
            'fields': ('ingredients', 'notes')
        }),
        ('Metadata', {
            'fields': ('rating', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [StepInline]
    
    # Custom methods
    def total_time(self, obj):
        """Display total cooking time"""
        return f"{obj.total_time} minutes"
    total_time.short_description = "Total Time"
    
    def get_queryset(self, request):
        """Optimize queries by selecting related author"""
        return super().get_queryset(request).select_related('author')


# Step admin configuration
@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    """Admin configuration for Step model"""
    
    list_display = [
        'recipe', 'step_number', 'title', 
        'duration', 'temperature', 'created_at'
    ]
    
    list_filter = [
        'recipe__category', 'recipe__difficulty', 
        'created_at', 'recipe__author'
    ]
    
    search_fields = [
        'title', 'instruction', 'recipe__title', 
        'recipe__author__username'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Step Information', {
            'fields': ('recipe', 'step_number', 'title', 'instruction')
        }),
        ('Additional Details', {
            'fields': ('duration', 'temperature', 'image')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    # Custom ordering
    ordering = ['recipe', 'step_number']
    
    def get_queryset(self, request):
        """Optimize queries by selecting related recipe and author"""
        return super().get_queryset(request).select_related('recipe', 'recipe__author')
