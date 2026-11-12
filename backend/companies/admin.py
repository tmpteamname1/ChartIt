from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'oib', 'email', 'is_active')
    search_fields = ('name', 'oib')
    list_filter = ('is_active',)
    actions = ['deactivate']

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description='Deaktiviraj odabrane tvrtke')
    def deactivate(self, request, queryset):
        queryset.update(is_active=False)
