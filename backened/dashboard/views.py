from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncWeek
from datetime import date, timedelta
from finance.models import Transaction
from users.permissions import IsAnalyst, IsAdmin, IsViewer


class SummaryView(APIView):
    """
    Returns total income, total expenses, and net balance.
    Access: Analyst, Admin
    """
    permission_classes = [IsAnalyst]

    def get(self, request):
        qs = Transaction.objects.filter(is_deleted=False)

        total_income = qs.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0

        total_expense = qs.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0

        net_balance = total_income - total_expense

        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': net_balance,
        })


class CategoryWiseView(APIView):
    """
    Returns total amount grouped by category.
    Access: Analyst, Admin
    """
    permission_classes = [IsAnalyst]

    def get(self, request):
        qs = Transaction.objects.filter(is_deleted=False)

        income_by_category = (
            qs.filter(type='income')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        expense_by_category = (
            qs.filter(type='expense')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response({
            'income_by_category': list(income_by_category),
            'expense_by_category': list(expense_by_category),
        })


class MonthlyTrendView(APIView):
    """
    Returns monthly income and expense totals for the last 6 months.
    Access: Analyst, Admin
    """
    permission_classes = [IsAnalyst]

    def get(self, request):
        six_months_ago = date.today() - timedelta(days=180)

        qs = Transaction.objects.filter(
            is_deleted=False,
            date__gte=six_months_ago
        )

        monthly_income = (
            qs.filter(type='income')
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        monthly_expense = (
            qs.filter(type='expense')
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        return Response({
            'monthly_income': list(monthly_income),
            'monthly_expense': list(monthly_expense),
        })


class WeeklyTrendView(APIView):
    """
    Returns weekly income and expense totals for the last 8 weeks.
    Access: Analyst, Admin
    """
    permission_classes = [IsAnalyst]

    def get(self, request):
        eight_weeks_ago = date.today() - timedelta(weeks=8)

        qs = Transaction.objects.filter(
            is_deleted=False,
            date__gte=eight_weeks_ago
        )

        weekly_income = (
            qs.filter(type='income')
            .annotate(week=TruncWeek('date'))
            .values('week')
            .annotate(total=Sum('amount'))
            .order_by('week')
        )

        weekly_expense = (
            qs.filter(type='expense')
            .annotate(week=TruncWeek('date'))
            .values('week')
            .annotate(total=Sum('amount'))
            .order_by('week')
        )

        return Response({
            'weekly_income': list(weekly_income),
            'weekly_expense': list(weekly_expense),
        })


class RecentActivityView(APIView):
    """
    Returns the 10 most recent transactions.
    Access: All roles
    """
    permission_classes = [IsViewer]

    def get(self, request):
        recent = Transaction.objects.filter(
            is_deleted=False
        ).order_by('-created_at')[:10]

        data = [
            {
                'id': t.pk,
                'amount': t.amount,
                'type': t.type,
                'category': t.category,
                'date': t.date,
                'notes': t.notes,
            }
            for t in recent
        ]

        return Response({'recent_activity': data})


class FullDashboardView(APIView):
    """
    Returns everything in one single API call.
    Access: Analyst, Admin
    """
    permission_classes = [IsAnalyst]

    def get(self, request):
        qs = Transaction.objects.filter(is_deleted=False)

        # --- Summary ---
        total_income = qs.filter(type='income').aggregate(
            total=Sum('amount'))['total'] or 0
        total_expense = qs.filter(type='expense').aggregate(
            total=Sum('amount'))['total'] or 0
        net_balance = total_income - total_expense

        # --- Category wise ---
        expense_by_category = list(
            qs.filter(type='expense')
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        # --- Monthly trends (last 6 months) ---
        six_months_ago = date.today() - timedelta(days=180)
        monthly_income = list(
            qs.filter(type='income', date__gte=six_months_ago)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )
        monthly_expense = list(
            qs.filter(type='expense', date__gte=six_months_ago)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        # --- Recent activity ---
        recent = Transaction.objects.filter(
            is_deleted=False
        ).order_by('-created_at')[:5]

        recent_activity = [
            {
                'id': t.pk,
                'amount': t.amount,
                'type': t.type,
                'category': t.category,
                'date': t.date,
                'notes': t.notes,
            }
            for t in recent
        ]

        return Response({
            'summary': {
                'total_income': total_income,
                'total_expense': total_expense,
                'net_balance': net_balance,
            },
            'expense_by_category': expense_by_category,
            'monthly_trends': {
                'income': monthly_income,
                'expense': monthly_expense,
            },
            'recent_activity': recent_activity,
        })