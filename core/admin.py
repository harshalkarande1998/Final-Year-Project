from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import VendorProfile, Product, Order, Category, CartItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'color', 'has_image', 'preview')
    list_editable = ('order', 'color')
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ('preview',)
    ordering = ('order',)

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Has image?"

    def preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="120" '
                f'style="border-radius:6px;object-fit:cover;"/>'
            )
        return "No image"
    preview.short_description = "Preview"


@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'user', 'phone')
    search_fields = ('shop_name', 'user__username', 'phone')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'category', 'price', 'created_at', 'has_image')
    list_filter = ('category', 'vendor')
    search_fields = ('name', 'vendor__shop_name', 'category__name')
    date_hierarchy = 'created_at'

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Has image?"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'product', 'customer', 'vendor',
        'quantity', 'status', 'placed_at'
    )
    list_filter = ('status', 'placed_at')
    search_fields = ('customer__username', 'product__name', 'vendor__shop_name')
    date_hierarchy = 'placed_at'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'added_at')
    search_fields = ('user__username', 'product__name')
    date_hierarchy = 'added_at'
