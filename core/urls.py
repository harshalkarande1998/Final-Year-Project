from django.urls import path
from . import views

urlpatterns = [
    # Home
    path('', views.index, name='index'),

    # Auth
    path('register/', views.register, name='register'),
    # Login yahan optional hai, par rehne do – base.html me {% url 'login' %} kaam karega
    path('login/', views.RoleBasedLoginView.as_view(), name='login'),
    # ❌ LOGOUT YAHAN SE HATA DIYA – ab logout project-level (accounts/logout) se hoga

    # Product
    path('product/<int:pk>/', views.product_detail, name='product_detail'),

    # Vendor Product Delete (sahi view ka naam use kar rahe hain)
    path('vendor/product/<int:pk>/delete/', views.vendor_delete_product, name='delete_product'),

    # Cart
    path('cart/', views.cart, name='cart'),
    path('cart/update/', views.update_cart, name='update_cart'),

    # Checkout
    path('checkout/', views.checkout, name='checkout'),

    # Customer orders
    path('my-orders/', views.my_orders, name='my_orders'),

    # Vendor
    path('vendor/', views.vendor_dashboard, name='vendor_dashboard'),
    path('vendor/add-product/', views.add_product, name='add_product'),
]
