from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'oib', 'email', 'is_active')
    search_fields = ('name', 'oib')
    list_filter = ('is_active',)
