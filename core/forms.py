from django import forms
from django.contrib.auth.models import User
from .models import Product, Order, Category

# ------------------------- REGISTRATION FORM -------------------------
class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    role = forms.ChoiceField(
        choices=(('customer', 'Customer'), ('vendor', 'Vendor')),
        widget=forms.RadioSelect
    )
    shop_name = forms.CharField(
        max_length=200,
        required=False,
        help_text="Required for vendors"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']


# ------------------------- PRODUCT FORM -------------------------
class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'image', 'category']


# ------------------------- CATEGORY FORM (optional) -------------------------
class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'slug', 'image', 'color', 'order']


# ------------------------- CHECKOUT FORM -------------------------
class CheckoutForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = [
            'full_name',
            'phone',
            'address_line',
            'city',
            'pincode',
            'notes',
            # quantity is handled per-cart-item; include only if you need a global field
        ]
