from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django import forms

from .models import (
    Product,
    Category,
    CartItem,
    Order,
    VendorProfile
)

from .forms import (
    UserRegistrationForm,
    ProductForm,
    CheckoutForm
)

# ---------------------- HOME PAGE WITH CATEGORIES ----------------------
def index(request):
    categories = Category.objects.all()
    products = Product.objects.order_by('-created_at')

    q = request.GET.get('q')
    if q:
        products = products.filter(name__icontains=q)

    category_slug = request.GET.get('category')
    if category_slug:
        products = products.filter(category__slug=category_slug)

    return render(request, 'core/index.html', {
        'categories': categories,
        'products': products
    })


# ---------------------- PRODUCT DETAIL (ADD TO CART) ----------------------
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('login')

        qty = int(request.POST.get('quantity', 1))

        item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product
        )

        if created:
            item.quantity = qty
        else:
            item.quantity += qty

        item.save()
        return redirect('cart')

    return render(request, 'core/product_detail.html', {'product': product})


# ---------------------- CART PAGE ----------------------
@login_required
def cart(request):
    items = CartItem.objects.filter(user=request.user)
    total = sum([i.line_total for i in items])
    return render(request, 'core/cart.html', {'items': items, 'total': total})


@login_required
def update_cart(request):
    if request.method == 'POST':
        for key, val in request.POST.items():
            if key.startswith('qty_'):
                item_id = key.split('_')[1]
                try:
                    item = CartItem.objects.get(id=item_id, user=request.user)
                    qty = int(val)

                    if qty <= 0:
                        item.delete()
                    else:
                        item.quantity = qty
                        item.save()
                except:
                    pass

    return redirect('cart')


# ---------------------- CHECKOUT ----------------------
@login_required
def checkout(request):
    items = CartItem.objects.filter(user=request.user)
    if not items.exists():
        return redirect('cart')

    total = sum([i.line_total for i in items])

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            for item in items:
                Order.objects.create(
                    customer=request.user,
                    product=item.product,
                    vendor=item.product.vendor,
                    quantity=item.quantity,
                    full_name=form.cleaned_data['full_name'],
                    phone=form.cleaned_data['phone'],
                    address_line=form.cleaned_data['address_line'],
                    city=form.cleaned_data['city'],
                    pincode=form.cleaned_data['pincode'],
                    notes=form.cleaned_data['notes']
                )
            items.delete()
            return render(request, 'core/checkout_success.html')

    else:
        form = CheckoutForm()

    return render(request, 'core/checkout.html', {
        'items': items,
        'total': total,
        'form': form
    })


# ---------------------- CUSTOMER ORDERS ----------------------
@login_required
def my_orders(request):
    orders = Order.objects.filter(customer=request.user).order_by('-placed_at')
    return render(request, 'core/my_orders.html', {'orders': orders})


# ---------------------- REGISTRATION ----------------------
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()

            role = form.cleaned_data['role']

            if role == 'vendor':
                shop_name = form.cleaned_data['shop_name'] or f"{user.username}'s shop"
                VendorProfile.objects.create(user=user, shop_name=shop_name)

            login(request, user)

            if role == 'vendor':
                return redirect('vendor_dashboard')
            return redirect('index')

    else:
        form = UserRegistrationForm()

    return render(request, 'core/register.html', {'form': form})


# ---------------------- LOGIN REDIRECT BASED ON ROLE ----------------------
class RoleBasedLoginView(LoginView):
    template_name = 'core/login.html'

    def get_success_url(self):
        user = self.request.user
        if hasattr(user, 'vendorprofile'):
            return reverse('vendor_dashboard')
        return reverse('index')


# ---------------------- VENDOR DASHBOARD ----------------------
@login_required
def vendor_dashboard(request):
    try:
        vendor = request.user.vendorprofile
    except VendorProfile.DoesNotExist:
        return redirect('index')

    products = vendor.products.all()
    orders = Order.objects.filter(vendor=vendor).order_by('-placed_at')

    return render(request, 'core/vendor_dashboard.html', {
        'vendor': vendor,
        'products': products,
        'orders': orders
    })


# ---------------------- VENDOR ADD PRODUCT ----------------------
@login_required
def add_product(request):
    try:
        vendor = request.user.vendorprofile
    except VendorProfile.DoesNotExist:
        return redirect('index')

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)

        if form.is_valid():
            p = form.save(commit=False)
            p.vendor = vendor
            p.save()
            return redirect('vendor_dashboard')

    else:
        form = ProductForm()

    return render(request, 'core/add_product.html', {'form': form})

@login_required
def vendor_delete_product(request, pk):
    """Allow a vendor to delete ONLY their own product."""
    try:
        vendor = request.user.vendorprofile
    except VendorProfile.DoesNotExist:
        return redirect('index')

    product = get_object_or_404(Product, pk=pk, vendor=vendor)
    # simple delete without confirm (project ke liye enough hai)
    product.delete()
    return redirect('vendor_dashboard')
