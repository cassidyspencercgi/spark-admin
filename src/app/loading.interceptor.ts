import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from './loader.service';

let totalRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  totalRequests++;
  loadingService.setLoading(true);
  return next(req).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests == 0) {
        loadingService.setLoading(false);
      }
    })
  );
};