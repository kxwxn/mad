import { PostgrestError } from '@supabase/supabase-js';
import { ApiError, DatabaseError, NotFoundError, ValidationError } from './errors';

export const handleSupabaseError = (error: PostgrestError): never => {
  if (error.code === 'PGRST116') {
    throw new NotFoundError('Resource not found');
  }
  
  if (error.code === '23505') {
    throw new ValidationError('Duplicate entry', error.details);
  }

  throw new DatabaseError('Database operation failed', error);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const getErrorStatus = (error: unknown): number => {
  if (isApiError(error)) {
    return error.status || 500;
  }
  return 500;
};

export const getErrorCode = (error: unknown): string => {
  if (isApiError(error)) {
    return error.code || 'UNKNOWN_ERROR';
  }
  return 'UNKNOWN_ERROR';
}; 