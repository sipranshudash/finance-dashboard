from django.urls import path
from .views import (
    SummaryView,
    CategoryWiseView,
    MonthlyTrendView,
    WeeklyTrendView,
    RecentActivityView,
    FullDashboardView,
)

urlpatterns = [
    path('summary/', SummaryView.as_view(), name='summary'),
    path('categories/', CategoryWiseView.as_view(), name='categories'),
    path('trends/monthly/', MonthlyTrendView.as_view(), name='monthly-trends'),
    path('trends/weekly/', WeeklyTrendView.as_view(), name='weekly-trends'),
    path('recent/', RecentActivityView.as_view(), name='recent-activity'),
    path('full/', FullDashboardView.as_view(), name='full-dashboard'),
]