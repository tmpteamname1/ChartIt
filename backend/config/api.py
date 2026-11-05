"""Project-wide API conventions (docs chapter 4.9), referenced from REST_FRAMEWORK in settings.py."""

from rest_framework import exceptions, pagination
from rest_framework.views import exception_handler as drf_exception_handler


class DefaultPagination(pagination.PageNumberPagination):
    """Response of every list endpoint: {count, next, previous, results}."""

    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


def exception_handler(exc, context):
    """Return every API error as {"detail": str, "code": str, "errors": {field: [str]} | null}."""
    response = drf_exception_handler(exc, context)
    if response is None:
        # Unexpected exceptions stay a plain 500 without technical details (DEBUG off).
        return None

    if isinstance(exc, exceptions.ValidationError):
        errors = response.data
        if not isinstance(errors, dict):
            # serializers.ValidationError('...') raised outside a field, e.g. in validate().
            errors = {'non_field_errors': errors if isinstance(errors, list) else [errors]}
        response.data = {
            'detail': str(exceptions.ValidationError.default_detail),
            'code': exceptions.ValidationError.default_code,
            'errors': errors,
        }
        return response

    detail = response.data.get('detail') if isinstance(response.data, dict) else None
    response.data = {
        'detail': str(detail or exc),
        'code': getattr(detail, 'code', None) or getattr(exc, 'default_code', 'error'),
        'errors': None,
    }
    return response
