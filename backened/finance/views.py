from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import Transaction
from .serializers import TransactionSerializer
from .filters import TransactionFilter
from users.permissions import IsAdmin, IsViewer

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = TransactionFilter
    ordering_fields = ['date', 'amount', 'created_at']
    search_fields = ['notes', 'category']

    def get_queryset(self):
        # Exclude soft deleted records
        return Transaction.objects.filter(is_deleted=False)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [IsViewer()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(is_deleted=False)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsViewer()]
        return [IsAdmin()]

    def destroy(self, request, *args, **kwargs):
        # Soft delete instead of hard delete
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(
            {"message": "Transaction deleted successfully."},
            status=status.HTTP_200_OK
        )