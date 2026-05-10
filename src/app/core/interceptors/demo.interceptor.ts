import { HttpInterceptorFn } from '@angular/common/http';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const demoUser = localStorage.getItem('demo_user');
  
  if (demoUser && !req.headers.has('Authorization')) {
    const cloned = req.clone({
      setHeaders: {
        'X-Demo-User': demoUser
      }
    });
    return next(cloned);
  }
  
  return next(req);
};
