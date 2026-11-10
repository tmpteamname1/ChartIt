from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Uloga', {'fields': ('role',)}),
        ('Tvrtka', {'fields': ('company',)}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Uloga i tvrtka', {'fields': ('email', 'role', 'company')}),
    )

    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'role',
        'company',
        'is_active',
    )

    list_filter = ('role', 'company', 'is_active', 'is_staff', 'is_superuser')

    list_select_related = ('company',)
