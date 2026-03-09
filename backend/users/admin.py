from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, PasswordReset


@admin.register(User)
class CustomUserAdmin(UserAdmin):
	fieldsets = UserAdmin.fieldsets + (
		("Custom Fields", {"fields": ("role",)}),
	)
	add_fieldsets = UserAdmin.add_fieldsets + (
		("Custom Fields", {"fields": ("role",)}),
	)
	list_display = ("username", "email", "role", "is_staff", "is_superuser")


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
	list_display = ("user", "token", "created_at", "expires_at", "is_used")
	list_filter = ("is_used", "created_at")
	search_fields = ("user__username", "user__email", "token")
	readonly_fields = ("token", "created_at")
