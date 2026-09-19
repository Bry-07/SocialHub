import Swal from 'sweetalert2';
import { MESSAGES } from './constants';

export const confirmDelete = () =>
  Swal.fire({
    title: MESSAGES.DELETE_CONFIRM_TITLE,
    text: MESSAGES.DELETE_CONFIRM_TEXT,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
  });

export const showSuccess = (message) =>
  Swal.fire({
    icon: 'success',
    title: message || 'Listo',
    timer: 1500,
    showConfirmButton: false,
  });

export const showError = (message) =>
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message || MESSAGES.GENERIC_ERROR,
  });