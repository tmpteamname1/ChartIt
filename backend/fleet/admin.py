from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Photo, Port, Vessel


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Port)
class PortAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude')
    search_fields = ('name',)


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1
    fields = ('image', 'sort_order', 'thumbnail_preview')
    readonly_fields = ('thumbnail_preview',)

    @admin.display(description='minijatura')
    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" style="max-height: 80px;">', obj.thumbnail.url)
        return '-'


@admin.register(Vessel)
class VesselAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'category', 'home_port', 'daily_price', 'is_active')
    list_filter = ('company', 'category', 'home_port', 'is_active')
    search_fields = ('name',)
    list_select_related = ('company', 'category', 'home_port')
    inlines = [PhotoInline]
