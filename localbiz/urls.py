from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from core.views import RoleBasedLoginView  # Login redirect logic

# serve media files
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Custom Login
    path('accounts/login/', RoleBasedLoginView.as_view(), name='login'),

    # Logout
    path('accounts/logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),

    # App URLs
    path('', include('core.urls')),
]

# media support
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
