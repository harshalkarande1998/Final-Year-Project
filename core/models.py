from django.db import models
from django.contrib.auth.models import User


# -------------------- VENDOR PROFILE --------------------
class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=200)
    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.shop_name


# -------------------- CATEGORY MODEL --------------------
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    # naya fields UI ke liye
    order = models.PositiveIntegerField(
        default=0,
        help_text="Home page pe sort karne ke liye number (chhota number pehle aayega)."
    )
    color = models.CharField(
        max_length=7,
        blank=True,
        help_text="Optional hex colour (jaise #ff6f00)."
    )
    image = models.ImageField(
        upload_to="category_icons/",
        blank=True,
        null=True,
        help_text="Optional icon for category (Instamart style)."
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


# -------------------- PRODUCT MODEL --------------------
class Product(models.Model):
    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.CASCADE,
        related_name="products"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products"
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # REAL IMAGE UPLOAD (already use ho raha hai)
    image = models.ImageField(upload_to="product_images/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# -------------------- CART ITEM MODEL --------------------
class CartItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

    @property
    def line_total(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"


# -------------------- ORDER MODEL --------------------
class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("out_for_delivery", "Out for delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    )

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.CASCADE,
        related_name="orders",
        null=True,
        blank=True,
    )

    quantity = models.PositiveIntegerField(default=1)
    placed_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="pending",
    )

    # -------------------- DELIVERY DETAILS --------------------
    full_name = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address_line = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=20, blank=True)
    notes = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"
