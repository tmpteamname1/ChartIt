from django.contrib import admin

from .models import Category, Port, Vessel


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Port)
class PortAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude')
    search_fields = ('name',)


@admin.register(Vessel)
class VesselAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'category', 'home_port', 'daily_price', 'is_active')
    list_filter = ('company', 'category', 'home_port', 'is_active')
    search_fields = ('name',)
    list_select_related = ('company', 'category', 'home_port')
